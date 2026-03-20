import { test, expect } from './fixtures';

test.describe('Chat Widget Tests', () => {
  test('should display chat toggle button', async ({ homePage }) => {
    await expect(homePage.chatToggle).toBeVisible();
  });

  test('should open chat window on toggle click', async ({ homePage }) => {
    await homePage.openChat();
    await expect(homePage.chatWindow).toHaveClass(/\bopen\b/);
  });

  test('should display welcome message when opened', async ({ homePage }) => {
    await homePage.openChat();
    const messages = homePage.chatMessages.locator('.chat-msg.bot');
    await expect(messages.first()).toBeVisible();
    await expect(messages.first().locator('.chat-bubble')).toContainText(/Hi there|assistant/i);
  });

  test('should display suggestion chips in welcome', async ({ homePage }) => {
    await homePage.openChat();
    const suggestions = homePage.chatMessages.locator('.chat-suggestion');
    const count = await suggestions.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should send user message and receive bot response', async ({ homePage }) => {
    await homePage.openChat();
    await homePage.sendChatMessage('What are his skills?');

    // User message should appear
    const userMsg = homePage.chatMessages.locator('.chat-msg.user');
    await expect(userMsg.first()).toBeVisible();

    // Bot should respond after typing indicator
    const botMessages = homePage.chatMessages.locator('.chat-msg.bot');
    await expect(botMessages.nth(1)).toBeVisible({ timeout: 5000 });
    await expect(botMessages.nth(1).locator('.chat-bubble')).toContainText(/React|TypeScript|skill/i);
  });

  test('should close chat window via close button', async ({ homePage }) => {
    await homePage.openChat();
    await expect(homePage.chatWindow).toHaveClass(/\bopen\b/);
    await homePage.closeChat();
    await expect(homePage.chatWindow).not.toHaveClass(/\bopen\b/);
  });

  test('should close chat window on Escape key', async ({ homePage }) => {
    await homePage.openChat();
    await expect(homePage.chatWindow).toHaveClass(/\bopen\b/);
    await homePage.page.keyboard.press('Escape');
    await expect(homePage.chatWindow).not.toHaveClass(/\bopen\b/);
  });

  test('should disable input while bot is typing', async ({ homePage }) => {
    await homePage.openChat();
    await homePage.sendChatMessage('Hello');
    // Input should be disabled during bot response
    await expect(homePage.chatInput).toBeDisabled();
    // Wait for bot to finish
    await expect(homePage.chatInput).toBeEnabled({ timeout: 5000 });
  });

  test('should send message on Enter key', async ({ homePage }) => {
    await homePage.openChat();
    await homePage.chatInput.fill('Hello');
    await homePage.chatInput.press('Enter');
    const userMsg = homePage.chatMessages.locator('.chat-msg.user');
    await expect(userMsg.first()).toBeVisible();
  });

  test('should handle suggestion chip click', async ({ homePage }) => {
    await homePage.openChat();
    const firstChip = homePage.chatMessages.locator('.chat-suggestion').first();
    const chipText = await firstChip.textContent();
    await firstChip.click();

    // User message should appear with chip text
    const userMsg = homePage.chatMessages.locator('.chat-msg.user .chat-bubble');
    await expect(userMsg.first()).toContainText(chipText!);
  });
});
