import { BasePage } from 'pages/base.page'
import { TextInput, FormButton } from 'components/form'
import { loginExampleUrl } from 'modules/login/data'
import { LoginData } from 'modules/login/model'
import { cookiesPath } from 'modules/login/cookies'
import { writeFileSync } from 'fs'


export class LoginPage extends BasePage {

    constructor() {
        super()
        this.page = {
            name: 'Login Example Page',
            url: loginExampleUrl,
            title: 'Sign in to your account'
        }
    }

    private readonly userEmailText = new TextInput('input[type=email][name=loginExample]')
    private readonly userPasswordText = new TextInput('input[type=password][name=passwordExample]')
    private readonly signInSubmitButton = new FormButton('input[type=submit][name=submitLoginExample]')


    public async loadComponents(): Promise<void> {
        await Promise.all([
            this.userEmailText.exists(),
            this.userPasswordText.exists(),
            this.signInSubmitButton.exists()
        ])
    }


    public async fillUserEmail(loginData: LoginData): Promise<void> {
        await this.userEmailText.fillValue(loginData.userEmail, 20)
    }

    public async fillUserPassword(loginData: LoginData): Promise<void> {
        await this.userPasswordText.fillValue(loginData.userPassword, 20)
    }


    public async clickSignInButton(): Promise<void> {
        await this.signInSubmitButton.click()
    }


    public async saveCookies(): Promise<void> {
        const cookies = await context.cookies()
        const cookieJson = JSON.stringify(cookies)
        writeFileSync(cookiesPath, cookieJson)
    }

}
