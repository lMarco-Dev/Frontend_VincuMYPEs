import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs';

describe('Admin Flow', function() {
    let driver;

    // Aumentamos el timeout general de Mocha por si la página o backend tardan en responder
    this.timeout(20000); 

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Debe iniciar sesión como Admin correctamente', async function() {
        // 1. Navegar a la página de login
        await driver.get('http://localhost:5173/login');
        
        // Esperar a que el input de email esté en pantalla
        const inputEmail = await driver.wait(until.elementLocated(By.name('email')), 5000);
        const inputPassword = await driver.findElement(By.name('password'));
        
        // 2. Ingresar credenciales
        await inputEmail.sendKeys('Segundoquirozchavez112@gmail.com');
        await inputPassword.sendKeys('%Sndmin/.2026$!');
        
        // 3. Hacer clic en el botón de submit (iniciar sesión)
        const btnSubmit = await driver.findElement(By.css('button[type="submit"]'));
        await btnSubmit.click();
        
        // 4. Esperar a que la navegación ocurra (por ejemplo, buscar un elemento que solo existe en el dashboard de admin)
        // O simplemente esperar a que la URL cambie a /admin/dashboard
        await driver.wait(until.urlContains('/admin'), 10000);
        
        // 5. Tomar una captura de pantalla del Dashboard de Administrador
        const image = await driver.takeScreenshot();
        fs.writeFileSync('evidencia-admin-login.png', image, 'base64');
        console.log("📸 Captura del Dashboard Admin guardada como 'evidencia-admin-login.png'");
        
        // 6. Validaciones
        const urlActual = await driver.getCurrentUrl();
        expect(urlActual).to.include('/admin');
    });
});
