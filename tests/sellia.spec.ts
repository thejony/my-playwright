import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://staging.sellia.ai/');
  await login(page);
  await goToSettings(page);
});

const login = async (page: Page) => {
  const emailTextInput = page.getByTestId('emailTextInput');
  const passwordTextInput = page.getByTestId('passwordTextInput');

  await emailTextInput.fill("superconfiguration@getnada.com");
  await passwordTextInput.fill("");
  await passwordTextInput.fill("Automation@Pass#159357");
  
  await page.getByTestId('loginButton').click();
  await page.waitForTimeout(3000); // why?

  await expect(page.getByRole('heading', { name: 'Conversaciones' })).toBeVisible();
};

const goToSettings = async (page: Page) => {
  await expect(page.getByTestId('campaignsLink')).toBeVisible();
  await page.getByTestId('campaignsLink').click();

  // Expect settings/enigine icon
  await expect(
      page.locator("[data-test-id='templateButton'] span[class='material-design-icon cog-icon']").first()
  ).toBeVisible();
  await page.locator("[data-test-id='templateButton'] span[class='material-design-icon cog-icon']").first().click();
}

test('Custom Fields', async ({ page }) => {
  await page.getByTestId('campaignLabelButton').click();

  // Add new custom field
  await page.getByTestId('assignButton').click();
  await page.getByRole('textbox').fill('TEST');
  await page.getByTestId('button_confirm').click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();

  // Edit custom field
  await page.getByTestId('edit').click();
  await page.getByRole('textbox').fill('TEST1');
  await page.getByTestId('button_confirm').click();
  await expect(page.getByRole('cell', { name: 'TEST1' })).toBeVisible();

  // Delete custom field
  await page.getByTestId('delete').click();
  await page.getByTestId('modal-confirm').click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: 'TEST1' })).not.toBeVisible();

  // await page.waitForTimeout(2000);
});

test('Automatic Messages', async ({ page }) => {

  await page.getByTestId('campaignAutMessgButton').click();
  await page.waitForTimeout(2000);

  // Fill all texts
  await page.getByTestId('BienvenidaMessageText').fill('Test Bienvenido');
  await page.getByTestId('FueradeservicioMessageText').fill('Test Fuera de Servicio');
  await page.getByTestId('SinagentesconectadosMessageText').fill('Test Sin Agentes Conectados');
  await page.getByTestId('CierredesesiónautomáticoMessageText').fill('Test Cierre de Sesion Automatico');
  await page.getByTestId('MensajerecordatorioMessageText').fill('Test Mensaje de Recordatorio');


  // Toggle check buttons
  for (let i = 0; i < 5; i ++) {
    await page.locator('label').filter({ hasText: 'Activo' }).nth(i).uncheck();
    await page.locator('label').filter({ hasText: 'Inactivo' }).first().check();
  }

  // Set send interval
  await page.getByRole('spinbutton').fill("1000");
  await page.getByRole('spinbutton').fill("1");
  await page.getByRole('spinbutton').fill("10");

  // Save changes
  await page.getByTestId('save_button_message').click();

  await expect(page.getByText('BienvenidaConfiguration')).toBeVisible();

  // Clean up
  await page.getByRole('spinbutton').fill("10");
  await page.getByTestId('BienvenidaMessageText').fill('');
  await page.getByTestId('FueradeservicioMessageText').fill('');
  await page.getByTestId('SinagentesconectadosMessageText').fill('');
  await page.getByTestId('CierredesesiónautomáticoMessageText').fill('');
  await page.getByTestId('MensajerecordatorioMessageText').fill('');
  await page.getByTestId('save_button_message').click();

  // await page.waitForTimeout(2000);
});