import { LoginPage } from 'modules/login/pages/login'
// import { loginCredentials } from 'data/credentials.data'


describe('Login Test Example', () => {

    const loginPage = new LoginPage()

    test(`Navigate to ${loginPage.page.name}`, async () => {
        // await loginPage.navigateTo()
        // await loginPage.check()
        // await loginPage.loadComponents()
    })
    test(`Enter User Credentials and SignIn ${loginPage.page.name}`, async () => {
        // await loginPage.fillUserEmail(loginCredentials)
        // await loginPage.fillUserPassword(loginCredentials)
    })
    test(`Sign In ${loginPage.page.name}`, async () => {
        // await loginPage.clickSignInButton()
        // await loginPage.saveCookies()
    })

})
