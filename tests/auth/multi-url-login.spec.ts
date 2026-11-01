import { test, expect } from '../../fixtures/test-fixtures';
// 1 test with multiple data/urls by creating an array of objects, each containing the necessary information for a specific account. The test iterates over this array and performs the login test for each account.
const accounts = [
  {
    name: 'Site A',
    urlEnv: 'SITE_A_URL',
    usernameEnv: 'SITE_A_USERNAME',
    passwordEnv: 'SITE_A_PASSWORD',
  },
  {
    name: 'Site B',
    urlEnv: 'SITE_B_URL',
    usernameEnv: 'SITE_B_USERNAME',
    passwordEnv: 'SITE_B_PASSWORD',
  },
] as const;

//above are array data and now create a function to read the environment variables and throw an error if any required variable is missing. This ensures that the test will fail early if the necessary credentials are not provided.
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// apply for loop to iterate over the accounts array and create a test for each account. The test navigates to the login page, fills in the username and password fields with the corresponding environment variables, and clicks the login button. After logging in, it checks that the URL does not contain "login" or "signin", indicating a successful login.
for (const account of accounts) {
  // here ${account.name} is used to dynamically insert the account name into the test title, making it clear which account is being tested. The loginPage fixture is used to encapsulate the login logic, promoting code reuse and maintainability.
  test(`logs in to ${account.name}`, async ({ page, loginPage }) => {
    await page.goto(requiredEnv(account.urlEnv));
    await loginPage.login(
      requiredEnv(account.usernameEnv),
      requiredEnv(account.passwordEnv),
    );

    await expect(page).not.toHaveURL(/login|signin/i);
  });
}
