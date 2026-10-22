//hissms 
import { test, expect } from '@playwright/test';
import { authenticator } from 'otplib';
import process from 'process';

async function getTotp(): Promise<string> {
  const remaining = authenticator.timeRemaining();
  if (remaining < 3) {
    await new Promise(r => setTimeout(r, (remaining + 1) * 1000));
  }
  //below TOTP secret will be used from .env file
  //Step2: in playwright.config.ts this snip is used to import .env secret key to generate 6 digit totp
  // import dotenv from 'dotenv';  dotenv.config();
 // process.env.TOTP_SECRET reads the secret key from your .env file (loaded by dotenv).
 //  It’s the setup key GitHub gave you, a Base32 string like H3AHP7....
//! (non-null assertion) is TypeScript only. process.env.X has the type string | undefined, 
// because the variable might not exist. The ! tells the compiler “trust me, it’s set.” 
// It doesn’t check anything at runtime, so if TOTP_SECRET is missing, you get an error from 
// otplib instead.
//authenticator.generate(secret) is the otplib function that does the work. It returns the
//  current 6-digit code as a string.
//return hands that code back to whoever called getTotp(), so your test can type it into the OTP field.
  return authenticator.generate(process.env.TOTP_SECRET!);
}

test('GitHub login with TOTP', async ({ page }) => {
//step1 is:  .env file created and below url. logins will be used from .env file
  await page.goto(`${process.env.BASE_URL}/login`);
  await page.fill('#login_field', process.env.APP_USERNAME!);
  await page.fill('#password', process.env.PASSWORD!);
  await page.click('input[name="commit"]');

  await page.fill('#app_totp', await getTotp());

  await expect(page).not.toHaveURL(/login|two-factor/);
  await expect(page.locator('//span[text()="Dashboard"]')).toBeVisible();

});