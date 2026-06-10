import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Frontend Local Tests', function() {
    let driver;

    // Configurar antes de todas las pruebas
    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Cerrar después de todas las pruebas
    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Debe cargar la página principal', async function() {
        // Navegar a tu app local (asegúrate de que esté corriendo en el puerto 5173)
        await driver.get('http://localhost:5173');
        
        // Esperar a que el cuerpo de la página se cargue
        await driver.wait(until.elementLocated(By.css('body')), 5000);
        
        // Obtener el título
        const titulo = await driver.getTitle();
        console.log("Título obtenido:", titulo);
        
        // Comprobar que el título no esté vacío (puedes cambiarlo por el título real de tu app)
        expect(titulo).to.not.be.empty;
    });
});
