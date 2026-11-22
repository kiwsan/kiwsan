import { expect, test } from './fixtures';

test.describe('Office marker scale', () => {
  test('draws one tower per small company, two for medium, and three for large or enterprise', async ({
    homePage,
  }) => {
    await homePage.scrollToSection('#experience');

    const rows = homePage.page.locator('.tl-row');
    const towers = (index: number) => rows.nth(index).locator('.tower');

    await expect(towers(0)).toHaveCount(3); // MC Group, AI Manager
    await expect(towers(1)).toHaveCount(3); // MC Group, Technical Lead
    await expect(towers(2)).toHaveCount(3); // Ayudhya Capital
    await expect(towers(3)).toHaveCount(2); // ADI Asia
    await expect(towers(4)).toHaveCount(1); // Ayodia
    await expect(towers(5)).toHaveCount(1); // P.N.L.
  });
});
