import { Builder, By, until, Key } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Visualización Lenta: Obtención de Certificado (Ciclo Completo)', function() {
    let driver;
    this.timeout(400000);

    const mypeEmail = `mype_cert_${Date.now()}@gmail.com`;
    const mypePass = 'Empresa2024*';
    
    const estEmail = `est_cert1_${Date.now()}@gmail.com`;
    const estPass = 'Test2024*';
    
    const estEmail2 = `est_cert2_${Date.now()}@gmail.com`;
    const estPass2 = 'Test2024*';

    const adminEmail = 'Segundoquirozchavez112@gmail.com';
    const adminPass = '%Sndmin/.2026$!';
    
    const uniqueLetters = Date.now().toString().split('').map(d => String.fromCharCode(65 + parseInt(d))).join('');
    const estudianteNombreUnico = 'CERA ' + uniqueLetters;
    const estudianteNombreUnico2 = 'CERB ' + uniqueLetters;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
    });

    after(async function() {
        if (driver) {
            await driver.sleep(5000);
            await driver.quit();
        }
    });

    const logout = async () => {
        await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear(); window.location.reload();");
        await driver.sleep(2000);
        await driver.get('http://localhost:5173/login');
        await driver.sleep(2000);
    };

    it('1. MYPE se registra y publica proyecto', async function() {
        console.log("-> Registrando MYPE...");
        await driver.get('http://localhost:5173/register/mype');
        
        const inputRuc = await driver.wait(until.elementLocated(By.name('ruc')), 15000);
        await inputRuc.sendKeys('20' + Math.floor(100000000 + Math.random() * 900000000));
        await driver.sleep(1500);
        await driver.findElement(By.name('nombre')).sendKeys('EMPRESA CERTIFICADO');
        await driver.findElement(By.name('nombreComercial')).sendKeys('CERTIFICADO SAC');
        await driver.findElement(By.name('direccion')).sendKeys('AV LOS INCAS 123');
        await driver.sleep(1500);
        
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        await driver.sleep(2000);
        
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 15000);
        await inputEmail.sendKeys(mypeEmail);
        await driver.findElement(By.name('password')).sendKeys(mypePass);
        await driver.findElement(By.name('confirmPassword')).sendKeys(mypePass);
        
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        
        const selectRubro = await driver.wait(until.elementLocated(By.name('rubro')), 15000);
        await selectRubro.sendKeys('Tecnología');
        await driver.findElement(By.name('telefono')).sendKeys('9' + Math.floor(10000000 + Math.random() * 90000000));
        
        const terminosLink = await driver.findElement(By.xpath("//*[contains(text(), 'Términos y Condiciones')]"));
        await driver.executeScript("arguments[0].click();", terminosLink);
        await driver.sleep(1500);
        
        const modalScrollArea = await driver.findElement(By.xpath("//*[contains(text(), 'Estos Términos y Condiciones')]/.."));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalScrollArea);
        await driver.sleep(1500);
        
        const btnAceptarTerminos = await driver.findElement(By.xpath("//button[contains(text(), 'Aceptar términos')]"));
        await driver.executeScript("arguments[0].click();", btnAceptarTerminos);
        await driver.sleep(1500);
        
        let btnRegistrar = await driver.findElement(By.css('button[type="submit"]'));
        await driver.executeScript("arguments[0].click();", btnRegistrar);
        await driver.wait(until.urlContains('/dashboard/mype'), 10000);
        await driver.sleep(3000);
        
        console.log("-> MYPE creando proyecto...");
        await driver.get('http://localhost:5173/dashboard/mype/crear');
        await driver.sleep(3000);
        
        const btnAsistente = await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Asistente Inteligente')]/..")), 15000);
        await driver.executeScript("arguments[0].click();", btnAsistente);
        await driver.sleep(2000);

        const opciones1 = await driver.wait(until.elementsLocated(By.css('.b-menu-row')), 15000);
        await driver.executeScript("arguments[0].click();", opciones1[0]);
        await driver.sleep(2000);
        
        const opciones2 = await driver.wait(until.elementsLocated(By.css('.b-menu-row')), 15000);
        await driver.executeScript("arguments[0].click();", opciones2[0]);
        await driver.sleep(2000);
        
        const textareaDesc = await driver.wait(until.elementLocated(By.css("textarea")), 15000);
        await textareaDesc.sendKeys('Proyecto para probar certificado. UID: ' + uniqueLetters);
        await driver.sleep(2000);
        
        const fileInputs = await driver.findElements(By.css('input[type="file"]'));
        if (fileInputs.length > 0) {
            const mypePdfPath = path.resolve(__dirname, 'dummy_mype.pdf');
            fs.writeFileSync(mypePdfPath, 'dummy content');
            for (let input of fileInputs) {
                await input.sendKeys(mypePdfPath);
            }
            await driver.sleep(1000);
        }
        
        const btnPublicar = await driver.findElement(By.xpath("//button[contains(., 'PUBLICAR PROYECTO')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnPublicar);
        
        const isDisabled = await btnPublicar.getAttribute('disabled');
        if (isDisabled) throw new Error("Button PUBLICAR PROYECTO is disabled!");
        
        await driver.executeScript("arguments[0].click();", btnPublicar);
        
        try {
            await driver.wait(until.urlContains('/dashboard/mype/proyectos'), 15000);
            await driver.sleep(3000);
        } catch (e) {
            console.warn("WARNING: Did not redirect to /dashboard/mype/proyectos within 15s. Checking for errors in page source...");
            const src = await driver.getPageSource();
            if (src.includes("Error") || src.includes("obligatorio")) {
                fs.writeFileSync("error_proyectos.html", src);
                throw new Error("Form validation failed during publish!");
            }
        }
    });

    const registrarYPostularEstudiante = async (email, pass, nombre, paterno, materno) => {
        await logout();
        console.log(`-> Registrando estudiante: ${nombre}...`);
        
        await driver.get('http://localhost:5173/register/estudiante');
        await driver.sleep(2000);
        
        const inputDni = await driver.wait(until.elementLocated(By.name('dni')), 15000);
        await inputDni.sendKeys(Math.floor(10000000 + Math.random() * 90000000).toString());
        await driver.sleep(2000); // Dar más tiempo a la API de RENIEC
        
        const inputNombres = await driver.findElement(By.name('nombres'));
        await inputNombres.clear();
        await inputNombres.sendKeys(nombre);
        
        const inputPaterno = await driver.findElement(By.name('apellidoPaterno'));
        await inputPaterno.clear();
        await inputPaterno.sendKeys(paterno);
        
        const inputMaterno = await driver.findElement(By.name('apellidoMaterno'));
        await inputMaterno.clear();
        await inputMaterno.sendKeys(materno);
        await driver.sleep(1500);
        
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        await driver.sleep(2000);
        
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 15000);
        await inputEmail.sendKeys(email);
        await driver.findElement(By.name('password')).sendKeys(pass);
        await driver.findElement(By.name('confirmPassword')).sendKeys(pass);
        await driver.sleep(1500);
        
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        
        const selectUniversidad = await driver.wait(until.elementLocated(By.name('universidad')), 15000);
        await selectUniversidad.sendKeys('UPN');
        await driver.findElement(By.name('carrera')).sendKeys('Ingeniería de Sistemas');
        await driver.findElement(By.name('telefono')).sendKeys('9' + Math.floor(10000000 + Math.random() * 90000000));
        await driver.findElement(By.name('codigoEstudiante')).sendKeys('N00' + Math.floor(100000 + Math.random() * 900000));
        await driver.sleep(1500);
        
        const terminosLink = await driver.findElement(By.xpath("//*[contains(text(), 'Términos y Condiciones')]"));
        await driver.executeScript("arguments[0].click();", terminosLink);
        await driver.sleep(1500);
        
        const modalScrollArea = await driver.findElement(By.xpath("//*[contains(text(), 'Estos Términos y Condiciones')]/.."));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalScrollArea);
        await driver.sleep(1500);
        
        const btnAceptarTerminos = await driver.findElement(By.xpath("//button[contains(text(), 'Aceptar términos')]"));
        await driver.executeScript("arguments[0].click();", btnAceptarTerminos);
        await driver.sleep(1500);
        
        let btnRegistrar = await driver.findElement(By.css('button[type="submit"]'));
        await driver.executeScript("arguments[0].click();", btnRegistrar);
        
        try {
            await driver.wait(until.urlContains('/dashboard/estudiante'), 20000);
        } catch (e) {
            console.error("Student registration failed. Page source:");
            console.error(await driver.getPageSource());
            throw e;
        }
        await driver.sleep(3000);
        
        console.log(`-> Estudiante ${nombre} postulando...`);
        await driver.get('http://localhost:5173/proyectos');
        await driver.sleep(3000);
        const searchInput = await driver.wait(until.elementLocated(By.css("input[placeholder*='Buscar por']")), 15000);
        await searchInput.sendKeys(uniqueLetters);
        await driver.sleep(2000);
        let targetProject = await driver.wait(until.elementLocated(By.xpath(`//p[contains(., '${uniqueLetters}')]/ancestor::div[contains(@style, 'cursor: pointer')][1]`)), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", targetProject);
        await driver.sleep(2000);
        await driver.executeScript("arguments[0].click();", targetProject);
        await driver.sleep(3000);

        const btnPostular = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Postular ahora')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnPostular);
        await driver.sleep(2000);
        
        const opcionNuevoCV = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Cargar nuevo CV')]/..")), 15000);
        await driver.executeScript("arguments[0].click();", opcionNuevoCV);
        
        const pdfPath = path.resolve(__dirname, 'dummy_cv.pdf');
        fs.writeFileSync(pdfPath, 'cv content');
        const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
        await fileInput.sendKeys(pdfPath);
        await driver.sleep(1500);
        
        const textareaMensaje = await driver.findElement(By.css('textarea'));
        await textareaMensaje.sendKeys('Mensaje de postulación de prueba.');
        await driver.sleep(1000);
        
        const btnEnviar = await driver.findElement(By.xpath("//button[contains(., 'Enviar postulación')]"));
        await driver.executeScript("arguments[0].click();", btnEnviar);
        
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), '¡Postulación Enviada!')]")), 15000);
        await driver.sleep(2000);
    };

    it('2. Estudiante 1 y Estudiante 2 se registran y postulan', async function() {
        await registrarYPostularEstudiante(estEmail, estPass, estudianteNombreUnico, 'Perez', 'Gomez');
        await registrarYPostularEstudiante(estEmail2, estPass2, estudianteNombreUnico2, 'Lopez', 'Diaz');
    });

    it('3. Admin preselecciona a AMBOS estudiantes', async function() {
        await logout();
        console.log("-> Admin preseleccionando estudiantes...");
        
        await driver.wait(until.elementLocated(By.name('email')), 15000).sendKeys(adminEmail);
        await driver.findElement(By.name('password')).sendKeys(adminPass);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains('/admin'), 15000);
        await driver.sleep(2000);
        
        await driver.get('http://localhost:5173/admin/postulaciones');
        await driver.sleep(5000);
        
        const inputBuscarEst = await driver.findElement(By.css("input[placeholder='Nombre del estudiante...']"));
        
        // Use backspaces to ensure full clearance of React input state
        await inputBuscarEst.sendKeys(Key.chord(Key.CONTROL, "a"));
        await inputBuscarEst.sendKeys(Key.BACK_SPACE);
        await inputBuscarEst.sendKeys(estudianteNombreUnico);
        await driver.sleep(2000);
        
        let btnPreseleccionar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Preseleccionar')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnPreseleccionar);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnPreseleccionar);
        await driver.sleep(1500);

        let btnConfirmar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Confirmar')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnConfirmar);
        
        // WAIT FOR THE MODAL TO DISAPPEAR!
        // We wait for the 'Confirmar' button to become stale or invisible.
        await driver.wait(until.stalenessOf(btnConfirmar), 15000);
        await driver.sleep(2000);

        // Limpiar y buscar al SEGUNDO estudiante
        const inputBuscarEst2 = await driver.findElement(By.css("input[placeholder='Nombre del estudiante...']"));
        await inputBuscarEst2.sendKeys(Key.chord(Key.CONTROL, "a"));
        await inputBuscarEst2.sendKeys(Key.BACK_SPACE);
        await inputBuscarEst2.sendKeys(estudianteNombreUnico2);
        await driver.sleep(3000);
        
        btnPreseleccionar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Preseleccionar')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnPreseleccionar);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnPreseleccionar);
        await driver.sleep(1500);
        btnConfirmar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Confirmar')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnConfirmar);
        await driver.sleep(4000);
    });

    it('4. MYPE aprueba a AMBOS postulantes', async function() {
        await logout();
        console.log("-> MYPE aprobando estudiantes...");
        
        await driver.wait(until.elementLocated(By.name('email')), 15000).sendKeys(mypeEmail);
        await driver.findElement(By.name('password')).sendKeys(mypePass);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains('/dashboard/mype'), 15000);
        await driver.get('http://localhost:5173/dashboard/mype/postulantes');
        await driver.sleep(5000);
        
        const btnReclutamiento = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Reclutamiento')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnReclutamiento);
        await driver.executeScript("arguments[0].click();", btnReclutamiento);
        await driver.sleep(2000);
        
        // The project must be expanded first to show the students. We click the first project card's title.
        const projectTitle = await driver.wait(until.elementLocated(By.xpath("//h3[string-length(text()) > 5]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", projectTitle);
        await driver.executeScript("arguments[0].click();", projectTitle);
        await driver.sleep(3000);
        let btnAprobar = await driver.wait(until.elementLocated(By.xpath("(//button[contains(., 'Aprobar y Confirmar Ingreso')])[1]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnAprobar);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnAprobar);
        await driver.sleep(1500);
        let btnConfirmar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Aprobar Perfil')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnConfirmar);
        await driver.sleep(3000);

        btnAprobar = await driver.wait(until.elementLocated(By.xpath("(//button[contains(., 'Aprobar y Confirmar Ingreso')])[last()]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnAprobar);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnAprobar);
        await driver.sleep(1500);
        btnConfirmar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Aprobar Perfil')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnConfirmar);
        await driver.sleep(3000);
    });

    const confirmarParticipacionEstudiante = async (email, pass) => {
        await logout();
        await driver.wait(until.elementLocated(By.name('email')), 15000).sendKeys(email);
        await driver.findElement(By.name('password')).sendKeys(pass);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains('/dashboard/estudiante'), 15000);
        await driver.sleep(2000);
        
        await driver.get('http://localhost:5173/mis-postulaciones');
        await driver.sleep(3000);
        
        const btnConfirmarOf = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Confirmar participación')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnConfirmarOf);
        await driver.sleep(3000);
    };

    it('5. AMBOS Estudiantes confirman su participación', async function() {
        console.log("-> Estudiantes confirmando participación...");
        await confirmarParticipacionEstudiante(estEmail, estPass);
        await confirmarParticipacionEstudiante(estEmail2, estPass2);
    });

    it('6. El test detecta al Delegado y sube el entregable', async function() {
        console.log("-> Buscando qué estudiante fue elegido como Delegado...");
        
        await driver.get('http://localhost:5173/workspace');
        await driver.sleep(4000);
        
        const cardWorkspace = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Abrir Workspace')]/ancestor::div[contains(@style, 'cursor: pointer')] | //span[contains(text(), 'Abrir Workspace')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", cardWorkspace);
        await driver.executeScript("arguments[0].click();", cardWorkspace);
        
        await driver.wait(until.urlContains('/workspace/'), 15000);
        await driver.sleep(3000);
        
        let esDelegado = false;
        try {
            await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Subir entregable')]")), 5000);
            esDelegado = true;
        } catch (e) {
            esDelegado = false;
        }
        
        let btnSubirEntregable;
        if (!esDelegado) {
            console.log("Estudiante 2 NO es el delegado. Cambiando a Estudiante 1...");
            await logout();
            await driver.wait(until.elementLocated(By.name('email')), 15000).sendKeys(estEmail);
            await driver.findElement(By.name('password')).sendKeys(estPass);
            await driver.findElement(By.css('button[type="submit"]')).click();
            
            await driver.wait(until.urlContains('/dashboard/estudiante'), 15000);
            await driver.get('http://localhost:5173/workspace');
            await driver.sleep(3000);
            
            const cardWorkspace1 = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Abrir Workspace')]/ancestor::div[contains(@style, 'cursor: pointer')] | //span[contains(text(), 'Abrir Workspace')]")), 15000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", cardWorkspace1);
            await driver.executeScript("arguments[0].click();", cardWorkspace1);
            
            await driver.wait(until.urlContains('/workspace/'), 15000);
            await driver.sleep(3000);
        } else {
            console.log("Estudiante 2 ES el delegado.");
        }

        for (let i = 1; i <= 5; i++) {
            const btnSubir = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Subir entregable')]")), 15000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", btnSubir);
            await driver.executeScript("arguments[0].click();", btnSubir);
            await driver.sleep(2000);
            
            const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
            const pdfPath = path.resolve(__dirname, `dummy_${i}.pdf`);
            fs.writeFileSync(pdfPath, `dummy final ${i}`);
            await fileInput.sendKeys(pdfPath);
            await driver.sleep(1500);
            
            const textarea = await driver.findElement(By.css('textarea'));
            await textarea.sendKeys(`Entregable ${i}`);
            
            const btnSubirModal = await driver.findElement(By.xpath("(//button[contains(., 'Subir entregable')])[last()]"));
            await driver.executeScript("arguments[0].click();", btnSubirModal);
            
            await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'exitosamente') or contains(text(), 'correctamente')]")), 15000).catch(() => {});
            await driver.sleep(3000);
        }
    });

    it('7. MYPE aprueba entregable, Marca como Completado y EMITE CERTIFICADO', async function() {
        await logout();
        console.log("-> MYPE aprobando entregable y marcando completado...");
        
        await driver.wait(until.elementLocated(By.name('email')), 15000).sendKeys(mypeEmail);
        await driver.findElement(By.name('password')).sendKeys(mypePass);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains('/dashboard/mype'), 15000);
        
        await driver.get('http://localhost:5173/dashboard/mype/ejecucion');
        await driver.sleep(4000);
        
        const btnVerEntregables = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Gestionar Entregables')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnVerEntregables);
        await driver.sleep(1500);
        await driver.executeScript("arguments[0].click();", btnVerEntregables);
        await driver.sleep(3000);
        
        for (let i = 1; i <= 5; i++) {
            const btnAprobar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Aprobar')]")), 15000);
            await driver.executeScript("arguments[0].click();", btnAprobar);
            await driver.sleep(3000);
        }
        
        const btnCompletar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Emitir Certificado')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnCompletar);
        await driver.sleep(2000);

        const btnConfirmarCompletar = await driver.wait(until.elementLocated(By.xpath("(//button[contains(., 'Emitir Certificado')])[last()]")), 15000);
        await driver.executeScript("arguments[0].click();", btnConfirmarCompletar);
        await driver.sleep(5000);
        
        // EMITIR CERTIFICADO
        console.log("-> MYPE emitiendo el certificado...");
        await driver.get('http://localhost:5173/dashboard/mype/certificados');
        await driver.sleep(3000);
        
        const btnEmitir = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Nuevo Certificado')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnEmitir);
        await driver.sleep(2000);
        
        const selectProyecto = await driver.wait(until.elementLocated(By.xpath("//select")), 15000);
        await driver.executeScript("arguments[0].click();", selectProyecto);
        await driver.sleep(1000);
        
        const secondOption = await driver.wait(until.elementLocated(By.xpath("//select/option[2]")), 15000);
        const secondOptionText = await secondOption.getText();
        await selectProyecto.sendKeys(secondOptionText);
        await driver.sleep(2000);
        
        const checkboxes = await driver.findElements(By.xpath("//input[@type='checkbox']"));
        for (let chk of checkboxes) {
            await driver.executeScript("arguments[0].click();", chk);
            await driver.sleep(500);
        }
        
        const inputGerente = await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder, 'refrenda operativamente')]")), 15000);
        await inputGerente.sendKeys("EMPRESA CERTIFICADO");
        await driver.sleep(1000);

        const firmaPath = path.resolve(__dirname, 'firma_prueba.png');
        const fileFirma = await driver.findElement(By.xpath("//input[@type='file']"));
        await fileFirma.sendKeys(firmaPath);
        await driver.sleep(2000);
        
        const btnAplicarFirma = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Aplicar Firma al Certificado')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnAplicarFirma);
        await driver.sleep(2000);
        
        const btnGuardarCertificado = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Emitir Certificado')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnGuardarCertificado);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnGuardarCertificado);
        await driver.sleep(5000);
    });

    it('8. Estudiante visualiza certificado', async function() {
        await logout();
        console.log("-> Estudiante verificando certificado...");
        
        await driver.wait(until.elementLocated(By.name('email')), 15000).sendKeys(estEmail2);
        await driver.findElement(By.name('password')).sendKeys(estPass2);
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        await driver.wait(until.urlContains('/dashboard/estudiante'), 15000);
        
        await driver.get('http://localhost:5173/certificados');
        await driver.sleep(4000);
        
        const certificado = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Certificado') or contains(text(), 'EMPRESA CERTIFICADO')]")), 15000);
        expect(certificado).to.exist;
        
        console.log("    -> Certificado visualizado en la pantalla.");

        await driver.get('http://localhost:5173/dashboard/estudiante');
        await driver.sleep(3000);

        const btnCalificar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'EMPRESA CERTIFICADO') or contains(., 'CERTIFICADO SAC')]")), 15000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnCalificar);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", btnCalificar);
        await driver.sleep(2000);

        const estrellas = await driver.findElements(By.xpath("//div[contains(@style, 'gap: 8')]//button | //button[.//svg[contains(@class, 'lucide-star')]]"));
        if(estrellas.length >= 5) {
            await driver.executeScript("arguments[0].click();", estrellas[4]);
            await driver.sleep(1000);
        }

        const btnEnviar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Enviar calificación')]")), 15000);
        await driver.executeScript("arguments[0].click();", btnEnviar);
        await driver.sleep(3000);

        console.log("✅ Ciclo de Certificación completado exitosamente.");
    });
});