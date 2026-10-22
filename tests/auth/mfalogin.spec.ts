import { test, expect } from '../../fixtures/test-fixtures';
import { env } from '../../config/env';

test.describe('Verify the MFA login functionality', () => {

  test('@smoke login with username, password and TOTP', async ({page,loginPage,mfaPage,dashboardPage}) => {

    await loginPage.open(); 
    //url wil load//.env  →  config/env.ts  →  playwright.config.ts  →  page.goto('/login')
    //dotenv.config() copies everything in .env into process.env. env.baseUrl then reads BASE_URL from there. 
    // If the variable is missing, it falls back to https://github.com.
    //why dont we write as loginPage.open(env.BASEURL)? Username and password are test data. One test might log in as a normal user, another as a locked account, 
    // another as an admin. Since the value changes from test to test, login(env.username, env.password) takes it as a parameter.
    // The base URL is an environment setting. It’s the same for every test in a run

    // below env.username and env.password are getters from config/env.ts code that read the APP_USERNAME and PASSWORD 
    // variables from the .env file.
    await loginPage.login(env.username, env.password);

    //How env.totpSecret reads TOTP_SECRET
    //The two names differ on purpose. TOTP_SECRET is the variable name in the file, and totpSecret is a property 
    // name in your code. config/env.ts links them:
    // ts  export const env = {
   //get totpSecret() { return required('TOTP_SECRET'); },};
   //2. The value moves through them Using a fake key:

//.env:            TOTP_SECRET=ABCD1234EXAMPLE
          //              ↓  dotenv loads it
//process.env:     process.env.TOTP_SECRET = "ABCD1234EXAMPLE"
        //                ↓  config/env.ts reads it
//env object:      env.totpSecret = "ABCD1234EXAMPLE"
      //                  ↓  the spec passes it in
//spec:            mfaPage.submitTotp(env.totpSecret)
    //                    ↓
//MfaPage:         getTotp(secret)      ← secret = "ABCD1234EXAMPLE"
  //                      ↓
//utils/totp.ts:   authenticator.generate(secret)

    await mfaPage.submitTotp(env.totpSecret);

    await expect(page).not.toHaveURL(/login|two-factor/);
    await expect(dashboardPage.dashboardLabel).toBeVisible();
  });

});