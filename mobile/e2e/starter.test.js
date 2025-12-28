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

  it('should navigate to Settings and back', async () => {
    await element(by.text('Skip for now (Demo)')).tap();
    await element(by.text('Settings')).tap();
    await expect(element(by.text('Settings'))).toBeVisible();
    await element(by.text('Back')).tap();
    await expect(element(by.text('TTS App'))).toBeVisible();
  });

  it('should be able to type text and speak', async () => {
    await element(by.text('Skip for now (Demo)')).tap();
    const input = element(by.placeholder('Enter text to speak...'));
    await input.clearText();
    await input.typeText('Hello Detox');
    await element(by.text('Speak')).tap();
    // In E2E we usually check if the app doesn't crash or shows a loading state
    await expect(element(by.text('Hello Detox'))).toBeVisible();
  });

  it('should navigate to Audio Library', async () => {
    await element(by.text('Skip for now (Demo)')).tap();
    await element(by.text('Audio Library')).tap();
    await expect(element(by.text('Audio Library'))).toBeVisible();
  });
});
