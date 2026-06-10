import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';

describe('Flujo MYPE: Publicación de Proyecto', function() {
    let driver;
    this.timeout(45000); // Dar suficiente tiempo para registro + creación de proyecto

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Debe registrar una MYPE y publicar un proyecto nuevo', async function() {
        // --- 1. REGISTRO RÁPIDO DE MYPE ---
        await driver.get('http://localhost:5173/register/mype');
        
        // Paso 1
        const inputRuc = await driver.wait(until.elementLocated(By.name('ruc')), 5000);
        const randomRuc = '20' + Math.floor(100000000 + Math.random() * 900000000);
        await inputRuc.sendKeys(randomRuc);
        await driver.sleep(500);
        await driver.findElement(By.name('nombre')).sendKeys('EMPRESA CREADORA SAC');
        await driver.findElement(By.name('nombreComercial')).sendKeys('CREADORES');
        await driver.findElement(By.name('direccion')).sendKeys('AV LOS INCAS 123');
        
        let btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // Paso 2
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        await driver.sleep(500); 
        const testEmail = `mype_creadora_${Date.now()}@gmail.com`;
        await inputEmail.sendKeys(testEmail);
        await driver.findElement(By.name('password')).sendKeys('Empresa2024*');
        await driver.findElement(By.name('confirmPassword')).sendKeys('Empresa2024*');
        
        btnSiguiente = await driver.findElement(By.xpath("//button[contains(., 'Continuar')]"));
        await btnSiguiente.click();
        
        // Paso 3
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

        // Enviar
        let btnRegistrar = await driver.findElement(By.css('button[type="submit"]'));
        await driver.executeScript("arguments[0].click();", btnRegistrar);
        
        // Esperamos llegar al dashboard
        await driver.wait(until.urlContains('/dashboard/mype'), 10000);
        console.log("✅ Registro exitoso, ingresando al dashboard...");
        
        
        // --- 2. CREACIÓN DE PROYECTO ---
        // Navegar a la pantalla de crear proyecto
        await driver.get('http://localhost:5173/dashboard/mype/crear');
        await driver.sleep(2000); // Esperar carga de la vista y animaciones
        
        // Seleccionamos la primera opción del árbol (Mostrar mi negocio en internet...)
        const btnOpcion1 = await driver.wait(until.elementLocated(By.css('.wizard-btn')), 5000);
        await driver.executeScript("arguments[0].click();", btnOpcion1);
        await driver.sleep(1000);
        
        // Seleccionamos la primera opción de la segunda pregunta (No tengo presencia en internet...)
        const btnOpcion2 = await driver.wait(until.elementLocated(By.css('.wizard-btn')), 5000);
        await driver.executeScript("arguments[0].click();", btnOpcion2);
        await driver.sleep(1500);
        
        // Ahora deberíamos estar en la pantalla final de sugerencia, llenamos la descripción
        const textareaDesc = await driver.wait(until.elementLocated(By.css('textarea.saas-textarea')), 5000);
        await textareaDesc.sendKeys('Necesito una página web urgente para mi negocio de venta de ropa.');
        await driver.sleep(500);
        
        // Hacer clic en "Publicar proyecto"
        // Como el botón podría estar deshabilitado si faltan insumos obligatorios en la BD, hacemos click solo si se puede.
        // Pero idealmente debería poderse, forzamos con click o enviamos el submit normal.
        const btnPublicar = await driver.findElement(By.xpath("//button[contains(., 'Publicar proyecto')]"));
        
        // Tomamos captura antes de publicar para depurar si hay errores de insumos
        const imgPrePublicacion = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-pre-publicar-proyecto.png', imgPrePublicacion, 'base64');
        
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnPublicar);
        await driver.executeScript("arguments[0].click();", btnPublicar);
        
        // --- COMPROBACIÓN FINAL ---
        await driver.sleep(4000); // Esperar redirección
        
        const errores = await driver.findElements(By.css('.err, [style*="color: rgb(239, 68, 68)"], [style*="color: #EF4444"]'));
        for (let el of errores) {
            const textoError = await el.getText();
            if (textoError) console.log("⚠️ Error en pantalla al publicar:", textoError);
        }
        
        const currentUrl = await driver.getCurrentUrl();
        console.log("URL Final:", currentUrl);
        
        const image = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-proyecto-creado.png', image, 'base64');
        console.log("📸 Captura del proyecto creado guardada como 'evidencia-proyecto-creado.png'");
        
        // Asumimos que si fue exitoso, salió de /dashboard/mype/crear
        expect(currentUrl).to.not.include('/dashboard/mype/crear');
    });
});
