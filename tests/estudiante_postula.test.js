import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Flujo Estudiante: Postulación a Proyecto', function() {
    let driver;
    this.timeout(50000); 

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        
        // Crear un PDF de prueba básico localmente
        const pdfPath = path.resolve(__dirname, 'dummy_cv.pdf');
        if (!fs.existsSync(pdfPath)) {
            // Un PDF crudo mínimo para pasar la validación frontend/backend
            const pdfContent = "%PDF-1.4\n%âãÏÓ\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 21>>\nstream\nBT /F1 12 Tf 100 700 Td (CV de Prueba) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000015 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000215 00000 n \ntrailer\n<</Size 5/Root 1 0 R>>\nstartxref\n285\n%%EOF";
            fs.writeFileSync(pdfPath, pdfContent);
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Debe registrar estudiante y postular a un proyecto', async function() {
        // --- 1. REGISTRO DE ESTUDIANTE (Rápido) ---
        await driver.get('http://localhost:5173/register/estudiante');
        
        // Paso 0
        const randomDni = Math.floor(10000000 + Math.random() * 90000000).toString();
        const inputDni = await driver.wait(until.elementLocated(By.name('dni')), 5000);
        await inputDni.sendKeys(randomDni);
        await driver.sleep(500);
        
        await driver.findElement(By.name('nombres')).sendKeys('JUAN PABLO');
        await driver.findElement(By.name('apellidoPaterno')).sendKeys('PEREZ');
        await driver.findElement(By.name('apellidoMaterno')).sendKeys('GOMEZ');
        
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // Paso 1
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.sleep(500);
        const testEmail = `estudiante_${Date.now()}@gmail.com`;
        await inputEmail.sendKeys(testEmail);
        
        await driver.findElement(By.name('password')).sendKeys('Test2024*');
        await driver.findElement(By.name('confirmPassword')).sendKeys('Test2024*');
        
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // Paso 2
        const selectUniversidad = await driver.wait(until.elementLocated(By.name('universidad')), 5000);
        await driver.sleep(500);
        await selectUniversidad.sendKeys('UPN');
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
        await driver.executeScript("arguments[0].click();", btnRegistrar);
        
        await driver.sleep(3000);
        
        // Extraer errores si los hay
        const erroresRegistro = await driver.findElements(By.css('.err, [style*="color: rgb(239, 68, 68)"], [style*="color: #EF4444"]'));
        for (let el of erroresRegistro) {
            const textoError = await el.getText();
            if (textoError) console.log("⚠️ Error en pantalla al registrar:", textoError);
        }
        
        // Esperamos llegar al dashboard de estudiante
        await driver.wait(until.urlContains('/dashboard/estudiante'), 10000);
        console.log("✅ Registro exitoso, ingresando al dashboard de Estudiante...");
        
        
        // --- 2. POSTULAR AL PROYECTO ---
        // Ir a la lista de proyectos
        await driver.get('http://localhost:5173/proyectos');
        await driver.sleep(3000); // Esperar carga de API
        
        // Clic en el primer proyecto de la lista (asumimos que hay al menos 1 publicado)
        const primerProyecto = await driver.wait(until.elementLocated(By.css('h3')), 5000);
        console.log("📄 Abriendo proyecto:", await primerProyecto.getText());
        await driver.executeScript("arguments[0].click();", primerProyecto);
        
        // Esperar a que el panel de detalles cargue a la derecha
        await driver.sleep(3000);
        
        // Clic en "Postular ahora"
        const btnPostular = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Postular ahora')]")), 5000);
        await driver.executeScript("arguments[0].click();", btnPostular);
        await driver.sleep(1000);
        
        // Seleccionamos "Cargar nuevo CV"
        const opcionNuevoCV = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Cargar nuevo CV')]/..")), 5000);
        await driver.executeScript("arguments[0].click();", opcionNuevoCV);
        
        // Subir el archivo PDF
        const pdfPath = path.resolve(__dirname, 'dummy_cv.pdf');
        const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
        await fileInput.sendKeys(pdfPath);
        await driver.sleep(1000);
        
        // Escribir mensaje
        const textareaMensaje = await driver.findElement(By.css('textarea'));
        await textareaMensaje.sendKeys('Hola, me encantaría participar en este proyecto para aplicar mis conocimientos.');
        
        // Clic en "Enviar postulación"
        const btnEnviar = await driver.findElement(By.xpath("//button[contains(., 'Enviar postulación')]"));
        await driver.executeScript("arguments[0].click();", btnEnviar);
        
        // --- VERIFICACIÓN FINAL ---
        // Esperamos a que aparezca "Postulación Enviada" o un error visible
        await driver.sleep(5000);
        
        const errores = await driver.findElements(By.css('.err, [style*="color: rgb(239, 68, 68)"], [style*="color: #dc2626"]'));
        for (let el of errores) {
            const textoError = await el.getText();
            if (textoError) console.log("⚠️ Error en pantalla al postular:", textoError);
        }
        
        const image = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-estudiante-postulado.png', image, 'base64');
        console.log("📸 Captura de la postulación guardada como 'evidencia-estudiante-postulado.png'");
        
        // Validar que el botón ahora diga "Ya has postulado" o la pantalla de éxito haya aparecido
        const pageText = await driver.findElement(By.css('body')).getText();
        expect(pageText).to.match(/Postulación Enviada|Ya has postulado/);
    });
});
