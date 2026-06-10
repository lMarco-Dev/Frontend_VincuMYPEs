import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';

describe('Flujo de Registro de Estudiante', function() {
    let driver;
    this.timeout(30000); // 30 segundos porque llenar un formulario toma tiempo

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Debe registrar un estudiante nuevo', async function() {
        // 1. Navegar al registro de estudiante
        await driver.get('http://localhost:5173/register/estudiante');
        
        // --- PASO 1: Identidad ---
        const inputDni = await driver.wait(until.elementLocated(By.name('dni')), 5000);
        await inputDni.sendKeys('76543210');
        
        // Esperamos 1 segundo para que carguen los campos o animaciones
        await driver.sleep(1000);
        
        await driver.findElement(By.name('nombres')).sendKeys('Juan Perez');
        await driver.findElement(By.name('apellidoPaterno')).sendKeys('Gomez');
        await driver.findElement(By.name('apellidoMaterno')).sendKeys('Perez');
        
        // Hacer clic en Siguiente (botón tipo button)
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // --- PASO 2: Cuenta (Email y Passwords) ---
        // Esperamos a que el campo email sea visible (indicando cambio de paso)
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.sleep(500); // pequeña pausa por las animaciones de framer-motion
        
        // Usamos un correo dinámico para que no falle si lo ejecutas varias veces
        const testEmail = `estudiante_${Date.now()}@upn.pe`;
        await inputEmail.sendKeys(testEmail);
        
        await driver.findElement(By.name('password')).sendKeys('Estudiante2024*');
        await driver.findElement(By.name('confirmPassword')).sendKeys('Estudiante2024*');
        
        // Hacer clic en Siguiente
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // --- PASO 3: Detalles Universitarios ---
        let selectUniv;
        try {
            selectUniv = await driver.wait(until.elementLocated(By.name('universidad')), 8000);
            await driver.sleep(500);
        } catch (error) {
            // Si falla, tomamos una foto para ver qué pasó (qué error muestra la pantalla)
            const errorImg = await driver.takeScreenshot();
            fs.writeFileSync('error-paso-universidad.png', errorImg, 'base64');
            console.log("📸 Hubo un error al avanzar al paso 3. Revisar 'error-paso-universidad.png'");
            throw error;
        }
        
        // Seleccionamos las opciones
        await selectUniv.sendKeys('Universidad Privada del Norte (UPN)');
        await driver.findElement(By.name('carrera')).sendKeys('Ingeniería de Sistemas Computacionales');
        
        await driver.findElement(By.name('telefono')).sendKeys('987654321');
        await driver.findElement(By.name('codigoEstudiante')).sendKeys('N00123456');
        
        // Aceptamos términos y condiciones (si hay un checkbox, u abrimos el modal)
        // Revisando el form, parece que hay un Modal de Términos. En el registro puede haber un texto o checkbox.
        // Si hay que abrir el modal y darle "Aceptar", lo haremos. Si falla aquí, ajustaremos.
        
        try {
            // Buscamos el texto para abrir el modal
            const terminosLink = await driver.findElement(By.xpath("//*[contains(text(), 'Términos y Condiciones')]"));
            // Usamos JavaScript click por si está bloqueado por otro elemento
            await driver.executeScript("arguments[0].click();", terminosLink);
            await driver.sleep(1000); // esperar a que abra el modal
            
            // El modal requiere que hagamos scroll hasta el final para habilitar el botón "Aceptar términos"
            // Buscamos el contenedor scrolleable del modal
            const modalScrollArea = await driver.findElement(By.xpath("//*[contains(text(), 'Estos Términos y Condiciones')]/.."));
            await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalScrollArea);
            
            // Dar tiempo a que React detecte el scroll y habilite el botón
            await driver.sleep(1000);
            
            // Clic en el botón "Aceptar términos"
            const btnAceptarTerminos = await driver.findElement(By.xpath("//button[contains(text(), 'Aceptar términos')]"));
            await driver.executeScript("arguments[0].click();", btnAceptarTerminos);
            await driver.sleep(1000);
        } catch (e) {
            console.log("No se pudo interactuar con el modal de términos o ya fue aceptado.", e.message);
        }

        // Hacer clic en Registrar (Submit final)
        btnSiguiente = await driver.findElement(By.css('button[type="submit"]'));
        // Forzamos el clic con JS en caso de que algún overlay o la animación de cierre de modal interfiera
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        
        // --- COMPROBACIÓN FINAL ---
        // Esperamos a que nos mande al dashboard, login o muestre un mensaje de éxito
        await driver.sleep(3000);
        const image = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-registro-estudiante.png', image, 'base64');
        console.log("📸 Captura del registro guardada como 'evidencia-registro-estudiante.png'");
        
        // Asertamos que la URL cambió o que no hay error
        const currentUrl = await driver.getCurrentUrl();
        console.log("URL Final:", currentUrl);
        expect(currentUrl).to.not.include('/register/estudiante');
    });
});
