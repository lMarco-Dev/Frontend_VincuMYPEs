import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';

describe('Flujo de Registro de MYPE', function() {
    let driver;
    this.timeout(30000); 

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Debe registrar una MYPE nueva', async function() {
        // 1. Navegar al registro de MYPE
        await driver.get('http://localhost:5173/register/mype');
        
        // --- PASO 1: Identidad Empresa ---
        const inputRuc = await driver.wait(until.elementLocated(By.name('ruc')), 5000);
        // Generar un RUC aleatorio que empiece con 20 (11 dígitos en total)
        const randomRuc = '20' + Math.floor(100000000 + Math.random() * 900000000);
        await inputRuc.sendKeys(randomRuc);
        
        await driver.sleep(1000); // animaciones
        
        // NOTA: 'nombre' y 'nombreComercial' solo aceptan letras por la regex actual
        await driver.findElement(By.name('nombre')).sendKeys('EMPRESA SAC');
        await driver.findElement(By.name('nombreComercial')).sendKeys('MI EMPRESA');
        await driver.findElement(By.name('direccion')).sendKeys('AV PRINCIPAL 123');
        
        // Hacer clic en Siguiente (botón tipo button)
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // --- PASO 2: Seguridad ---
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.sleep(500); 
        
        const testEmail = `mype_${Date.now()}@gmail.com`;
        await inputEmail.sendKeys(testEmail);
        
        await driver.findElement(By.name('password')).sendKeys('Empresa2024*');
        await driver.findElement(By.name('confirmPassword')).sendKeys('Empresa2024*');
        
        // Hacer clic en Siguiente
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // --- PASO 3: Detalles del Negocio ---
        let selectRubro;
        try {
            selectRubro = await driver.wait(until.elementLocated(By.name('rubro')), 8000);
            await driver.sleep(500);
        } catch (error) {
            const errorImg = await driver.takeScreenshot();
            fs.writeFileSync('error-paso-rubro.png', errorImg, 'base64');
            console.log("📸 Hubo un error al avanzar al paso 3. Revisar 'error-paso-rubro.png'");
            throw error;
        }
        
        // El select tiene opciones como "Comercio", "Servicios", "Tecnología", etc.
        // Elegimos una opción enviando texto
        await selectRubro.sendKeys('Comercio');
        
        // Generamos un número de celular aleatorio válido en Perú (empieza con 9 y tiene 9 dígitos)
        const randomPhone = '9' + Math.floor(10000000 + Math.random() * 90000000);
        await driver.findElement(By.name('telefono')).sendKeys(randomPhone);
        
        // --- TÉRMINOS Y CONDICIONES ---
        try {
            const terminosLink = await driver.findElement(By.xpath("//*[contains(text(), 'Términos y Condiciones')]"));
            await driver.executeScript("arguments[0].click();", terminosLink);
            await driver.sleep(1000);
            
            const modalScrollArea = await driver.findElement(By.xpath("//*[contains(text(), 'Estos Términos y Condiciones')]/.."));
            await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", modalScrollArea);
            
            await driver.sleep(1000);
            
            const btnAceptarTerminos = await driver.findElement(By.xpath("//button[contains(text(), 'Aceptar términos')]"));
            await driver.executeScript("arguments[0].click();", btnAceptarTerminos);
            await driver.sleep(1000);
        } catch (e) {
            console.log("No se pudo interactuar con el modal de términos o ya fue aceptado.", e.message);
        }

        // Hacer clic en Registrar (Submit final)
        btnSiguiente = await driver.findElement(By.css('button[type="submit"]'));
        await driver.executeScript("arguments[0].click();", btnSiguiente);
        
        // --- COMPROBACIÓN FINAL ---
        await driver.sleep(4000);
        
        // Revisar si hay algún error visible en la pantalla
        const errores = await driver.findElements(By.css('.err, [style*="color: rgb(239, 68, 68)"], [style*="color: #EF4444"]'));
        for (let el of errores) {
            const textoError = await el.getText();
            if (textoError) console.log("⚠️ Error en pantalla:", textoError);
        }
        
        const image = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-registro-mype.png', image, 'base64');
        console.log("📸 Captura del registro guardada como 'evidencia-registro-mype.png'");
        
        const currentUrl = await driver.getCurrentUrl();
        console.log("URL Final:", currentUrl);
        expect(currentUrl).to.not.include('/register/mype');
    });
});
