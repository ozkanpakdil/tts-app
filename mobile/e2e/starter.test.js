describe('Starter', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.text('Welcome to TTS App'))).toBeVisible();
  });

  it('should show home screen after skip login', async () => {
    await element(by.text('Skip for now (Demo)')).tap();
    await expect(element(by.text('TTS App'))).toBeVisible();
  });
});
