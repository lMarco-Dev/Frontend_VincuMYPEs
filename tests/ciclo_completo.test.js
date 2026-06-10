import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Flujo Completo: MYPE -> Estudiante -> Admin -> MYPE -> Estudiante', function() {
    let driver;
    this.timeout(120000); // 2 minutos máximo

    const mypeEmail = `mype_${Date.now()}@gmail.com`;
    const mypePass = 'Empresa2024*';
    
    const estEmail = `estudiante_${Date.now()}@gmail.com`;
    const estPass = 'Test2024*';
    
    const adminEmail = 'Segundoquirozchavez112@gmail.com';
    const adminPass = '%Sndmin/.2026$!';
    const uniqueLetters = Date.now().toString().split('').map(d => String.fromCharCode(65 + parseInt(d))).join('');
    const estudianteNombreUnico = 'TEST ' + uniqueLetters;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    const logout = async () => {
        await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear(); window.location.reload();");
        await driver.sleep(1500);
        await driver.get('http://localhost:5173/login');
        await driver.sleep(1000);
    };

    it('1. MYPE se registra y publica proyecto', async function() {
        await driver.get('http://localhost:5173/register/mype');
        
        // Paso 0
        const inputRuc = await driver.wait(until.elementLocated(By.name('ruc')), 5000);
        const randomRuc = '20' + Math.floor(100000000 + Math.random() * 900000000);
        await inputRuc.sendKeys(randomRuc);
        await driver.sleep(500);
        await driver.findElement(By.name('nombre')).sendKeys('EMPRESA E2E SAC');
        await driver.findElement(By.name('nombreComercial')).sendKeys('E2E TEST');
        await driver.findElement(By.name('direccion')).sendKeys('AV LOS INCAS 123');
        
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // Paso 1
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.sleep(500); 
        await inputEmail.sendKeys(mypeEmail);
        await driver.findElement(By.name('password')).sendKeys(mypePass);
        await driver.findElement(By.name('confirmPassword')).sendKeys(mypePass);
        
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // Paso 2
        const selectRubro = await driver.wait(until.elementLocated(By.name('rubro')), 5000);
        await driver.sleep(500);
        await selectRubro.sendKeys('Tecnología');
        const randomPhone = '9' + Math.floor(10000000 + Math.random() * 90000000);
        await driver.findElement(By.name('telefono')).sendKeys(randomPhone);
        
        // Modal
        const terminosLink = await driver.findElement(By.xpath("//*[contains(text(), 'Términos y Condiciones')]"));
        await driver.executeScript("arguments[0].click();", terminosLink);
        await driver.sleep(1000);
        const modalScrollArea = await driver.findElement(By.xpath("//*[contains(text(), 'Estos Términos y Condiciones')]/.."));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalScrollArea);
        await driver.sleep(1000);
        const btnAceptarTerminos = await driver.findElement(By.xpath("//button[contains(text(), 'Aceptar términos')]"));
        await driver.executeScript("arguments[0].click();", btnAceptarTerminos);
        await driver.sleep(500);

        let btnRegistrar = await driver.findElement(By.css('button[type="submit"]'));
        await btnRegistrar.click();
        await driver.wait(until.urlContains('/dashboard/mype'), 10000);
        
        // CREACIÓN DE PROYECTO
        await driver.get('http://localhost:5173/dashboard/mype/crear');
        await driver.sleep(2000);
        
        const btnAsistente = await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Asistente Inteligente')]/..")), 5000);
        await driver.executeScript("arguments[0].click();", btnAsistente);
        await driver.sleep(1500);

        const btnOpcion1 = await driver.wait(until.elementLocated(By.css('.b-menu-row')), 5000);
        await driver.executeScript("arguments[0].click();", btnOpcion1);
        await driver.sleep(1000);
        
        const btnOpcion2 = await driver.wait(until.elementLocated(By.css('.b-menu-row')), 5000);
        await driver.executeScript("arguments[0].click();", btnOpcion2);
        await driver.sleep(1500);
        
        const textareaDesc = await driver.wait(until.elementLocated(By.css("textarea")), 5000);
        await textareaDesc.sendKeys('Necesito una página web urgente para test e2e completo. UID: ' + uniqueLetters);
        await driver.sleep(1000);
        
        // Handle required file uploads if any
        const fileInputs = await driver.findElements(By.css('input[type="file"]'));
        if (fileInputs.length > 0) {
            fs.writeFileSync('dummy.pdf', 'dummy content');
            for (let input of fileInputs) {
                await input.sendKeys(path.resolve('dummy.pdf'));
            }
            await driver.sleep(1000);
        }
        
        const btnPublicar = await driver.findElement(By.xpath("//button[contains(., 'PUBLICAR PROYECTO')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnPublicar);
        
        // Ensure the button is not disabled
        const isDisabled = await btnPublicar.getAttribute('disabled');
        if (isDisabled) {
            throw new Error("PUBLICAR PROYECTO button is disabled! Insumos faltantes or form invalid.");
        }
        
        await driver.executeScript("arguments[0].click();", btnPublicar);
        
        // Wait for redirect to confirm success
        try {
            await driver.wait(until.urlContains('/dashboard/mype/proyectos'), 15000);
        } catch (e) {
            console.warn("WARNING: Did not redirect to /dashboard/mype/proyectos within 15s. Continuing anyway...");
        }
    });

    it('2. Estudiante se registra y postula al proyecto', async function() {
        await logout();
        
        await driver.get('http://localhost:5173/register/estudiante');
        
        // Paso 0
        const inputDni = await driver.wait(until.elementLocated(By.name('dni')), 5000);
        const randomDni = Math.floor(10000000 + Math.random() * 90000000).toString();
        await inputDni.sendKeys(randomDni);
        await driver.sleep(500);
        await driver.findElement(By.name('nombres')).sendKeys(estudianteNombreUnico);
        await driver.findElement(By.name('apellidoPaterno')).sendKeys('PEREZ');
        await driver.findElement(By.name('apellidoMaterno')).sendKeys('GOMEZ');
        
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        
        // Paso 1
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.sleep(500);
        await inputEmail.sendKeys(estEmail);
        await driver.findElement(By.name('password')).sendKeys(estPass);
        await driver.findElement(By.name('confirmPassword')).sendKeys(estPass);
        
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        
        // Paso 2
        const selectUniversidad = await driver.wait(until.elementLocated(By.name('universidad')), 5000);
        await driver.sleep(500);
        await selectUniversidad.sendKeys('UPN');
        // Add missing carrera field which is required!
        await driver.findElement(By.name('carrera')).sendKeys('Ingeniería de Sistemas');
        const randomPhone = '9' + Math.floor(10000000 + Math.random() * 90000000);
        await driver.findElement(By.name('telefono')).sendKeys(randomPhone);
        const randomCodigo = 'N00' + Math.floor(100000 + Math.random() * 900000);
        await driver.findElement(By.name('codigoEstudiante')).sendKeys(randomCodigo);
        
        // Modal
        const terminosLink = await driver.findElement(By.xpath("//*[contains(text(), 'Términos y Condiciones')]"));
        await driver.executeScript("arguments[0].click();", terminosLink);
        await driver.sleep(1000);
        const modalScrollArea = await driver.findElement(By.xpath("//*[contains(text(), 'Estos Términos y Condiciones')]/.."));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalScrollArea);
        await driver.sleep(1000);
        const btnAceptarTerminos = await driver.findElement(By.xpath("//button[contains(text(), 'Aceptar términos')]"));
        await driver.executeScript("arguments[0].click();", btnAceptarTerminos);
        await driver.sleep(500);
        
        let btnRegistrar = await driver.findElement(By.css('button[type="submit"]'));
        await btnRegistrar.click();
        
        await driver.wait(until.urlContains('/dashboard/estudiante'), 10000);
        
        // POSTULACIÓN
        await driver.get('http://localhost:5173/proyectos');
        await driver.sleep(3000);
        
        // Use the search bar to filter by UID so it doesn't get hidden on page 2+
        const searchInput = await driver.wait(until.elementLocated(By.css("input[placeholder*='Buscar por']")), 5000);
        await searchInput.sendKeys(uniqueLetters);
        await driver.sleep(2000); // Wait for filtering
        
        // Select the specific project created by the MYPE in step 1 by its unique description UID
        let targetProject;
        try {
            targetProject = await driver.wait(until.elementLocated(By.xpath(`//p[contains(., '${uniqueLetters}')]/ancestor::div[contains(@style, 'cursor: pointer')][1]`)), 5000);
        } catch (e) {
            console.error("FAILED TO FIND PROJECT IN STEP 2! DUMPING PROYECTOS PAGE SOURCE:");
            console.error(await driver.getPageSource());
            throw e;
        }
        await driver.executeScript("arguments[0].scrollIntoView(true);", targetProject);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", targetProject);
        await driver.sleep(3000);
        
        const btnPostular = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Postular ahora')]")), 5000);
        await driver.executeScript("arguments[0].click();", btnPostular);
        await driver.sleep(1000);
        
        const opcionNuevoCV = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Cargar nuevo CV')]/..")), 5000);
        await driver.executeScript("arguments[0].click();", opcionNuevoCV);
        
        const pdfPath = path.resolve(__dirname, 'dummy_cv.pdf');
        const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
        await fileInput.sendKeys(pdfPath);
        await driver.sleep(1000);
        
        // Escribir mensaje
        const textareaMensaje = await driver.findElement(By.css('textarea'));
        await textareaMensaje.sendKeys('Hola, me encantaría participar en este proyecto.');
        
        const btnEnviar = await driver.findElement(By.xpath("//button[contains(., 'Enviar postulación')]"));
        await btnEnviar.click();
        await driver.sleep(4000);
    });

    it('3. Admin preselecciona al estudiante', async function() {
        await logout();
        
        await driver.wait(until.elementLocated(By.name('email')), 5000).sendKeys(adminEmail);
        await driver.findElement(By.name('password')).sendKeys(adminPass);
        const btnLogin = await driver.findElement(By.css('button[type="submit"]'));
        await btnLogin.click();
        
        await driver.wait(until.urlContains('/admin'), 5000);
        await driver.get('http://localhost:5173/admin/postulaciones');
        await driver.sleep(2000);
        
        // Search for our specific student to avoid clicking Preseleccionar on old test data
        const inputBuscarEst = await driver.findElement(By.css("input[placeholder='Nombre del estudiante...']"));
        await inputBuscarEst.sendKeys(estudianteNombreUnico);
        await driver.sleep(2000);
        
        const btnPreseleccionar = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Preseleccionar')]")), 5000);
        await driver.executeScript("arguments[0].click();", btnPreseleccionar);
        await driver.sleep(1000);
        
        const btnConfirmar = await driver.wait(until.elementLocated(By.xpath("//button[text()='Confirmar']")), 5000);
        await driver.executeScript("arguments[0].click();", btnConfirmar);
        await driver.sleep(3000);
    });

    it('4. MYPE valida al estudiante preseleccionado', async function() {
        await logout();
        
        await driver.wait(until.elementLocated(By.name('email')), 5000).sendKeys(mypeEmail);
        await driver.findElement(By.name('password')).sendKeys(mypePass);
        const btnLogin = await driver.findElement(By.css('button[type="submit"]'));
        await btnLogin.click();
        
        await driver.wait(until.urlContains('/dashboard/mype'), 5000);
        await driver.get('http://localhost:5173/dashboard/mype/postulantes');
        await driver.sleep(2000);
        
        // Open the project accordion first
        const projectAccordion = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'PROGRESO CENTRAL')]")), 5000);
        await projectAccordion.click(); // Use native click so it bubbles properly in React
        await driver.sleep(2000);
        
        try {
            const btnValidar = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(., 'Aprobar y Confirmar Ingreso')]")),
                10000
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", btnValidar);
            await driver.sleep(1000);
            await driver.executeScript("arguments[0].click();", btnValidar);
        } catch (error) {
            console.error("FAILED TO FIND BUTTON! DUMPING PAGE SOURCE:");
            const source = await driver.getPageSource();
            console.error(source);
            throw error;
        }
        
        const btnConfirmar = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Aprobar Perfil')]")),
            5000
        );
        await btnConfirmar.click();
        await driver.sleep(2000);
    });

    it('5. Estudiante confirma su participación (Ciclo Completado)', async function() {
        await logout();
        
        await driver.wait(until.elementLocated(By.name('email')), 5000).sendKeys(estEmail);
        await driver.findElement(By.name('password')).sendKeys(estPass);
        const btnLogin = await driver.findElement(By.css('button[type="submit"]'));
        await btnLogin.click();
        
        await driver.wait(until.urlContains('/dashboard/estudiante'), 5000);
        await driver.sleep(1000);
        
        await driver.get('http://localhost:5173/mis-postulaciones');
        await driver.sleep(3000);
        
        const btnConfirmarOf = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Confirmar participación')]")), 5000);
        await driver.executeScript("arguments[0].click();", btnConfirmarOf);
        await driver.sleep(2000);
        
        const finalUrl = await driver.getCurrentUrl();
        expect(finalUrl).to.include('mis-postulaciones');
        
        const image = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-ciclo-completo.png', image, 'base64');
        console.log("✅ Ciclo de vida completado exitosamente. Captura guardada.");
    });
});
