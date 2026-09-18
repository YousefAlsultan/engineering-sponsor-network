import { test, expect } from '@playwright/test';

for (const route of ['/', '/sponsors']) {
  test(`${route} mirrors the page, searches, opens details, and has no horizontal overflow`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(route);
    await expect(page.locator('h1')).toContainText(route === '/' ? 'Find sponsors.' : 'Find sponsors for your STEM team.');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (route === '/sponsors') {
      await page.getByRole('button',{name:'Any project',exact:true}).click();
      await page.getByRole('button',{name:'All sponsorships',exact:true}).click();
      await page.getByRole('button',{name:'All regions',exact:true}).click();
    }
    const search = page.getByRole('textbox',{name:'Search sponsors'});
    await search.fill('maxon');
    await expect(page.locator('article')).toHaveCount(1);
    await page.getByRole('button',{name:'View sponsorship from maxon',exact:true}).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button',{name:'View Official Program',exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Apply for Sponsorship',exact:true})).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await search.fill('zz-no-matching-program');
    await expect(page.getByText('No sponsor matches yet.',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Reset match',exact:true}).click();
    expect(await page.locator('article').count()).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
}
test('directory defaults, support filters, and archive reset', async ({page}) => {
  await page.goto('/sponsors');
  await expect(page.locator('article')).toHaveCount(4);
  await page.getByRole('button',{name:'Any project',exact:true}).click();
  await page.getByRole('button',{name:'Software',exact:true}).click();
  await page.getByRole('button',{name:'All regions',exact:true}).click();
  const count = await page.locator('article').count();
  expect(count).toBeGreaterThan(0); expect(count).toBeLessThan(27);
  await page.getByRole('button',{name:'Advanced filters',exact:true}).click();
  await page.getByRole('button',{name:'Expired',exact:true}).click();
  await expect(page.locator('article')).toHaveCount(0);
  await page.getByRole('button',{name:'Reset match',exact:true}).click();
  await expect(page.locator('article')).toHaveCount(4);
});
test('legacy directory redirects', async ({page}) => {
  await page.goto('/directory');
  await expect(page).toHaveURL(/\/sponsors$/);
});

test('application flow validates the team step before continuing', async ({page}) => {
  await page.goto('/sponsors');
  await page.getByRole('button', {name:'View sponsorship from MISUMI', exact:true}).click();
  await page.getByRole('button', {name:'Apply for Sponsorship', exact:true}).click();
  await expect(page.getByText('Your team', {exact:true})).toBeVisible();
  const continueButton = page.getByRole('button', {name:/Continue/});
  await expect(continueButton).toBeDisabled();
  await page.getByPlaceholder('University name').fill('Example University');
  await page.getByPlaceholder('Team name').fill('Example Racing');
  await page.locator('select').selectOption({label:'Formula SAE'});
  await expect(continueButton).toBeEnabled();
});
