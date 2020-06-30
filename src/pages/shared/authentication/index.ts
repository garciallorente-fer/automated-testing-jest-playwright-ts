import BasePage from '../base'
import { UserCredentials } from 'data'

export default class Authentication extends BasePage {
    protected userCredentials: UserCredentials

    protected async loginTo(path: string): Promise<void> {
        await this.navigateToPage(path)
        // await this.loadLoginPage(path)
        // await this.fillLoginForm()
        // await this.submitLoginForm()
        await this.waitForLoginRedirect(path)
    }

    private async loadLoginPage(): Promise<void> {
        // await page.waitForSelector('')
    }

    private async fillLoginForm(): Promise<void> {
        console.log(this.userCredentials.username)
        console.log(this.userCredentials.password)
        // await this.waitSeconds(1)
    }

    private async submitLoginForm(): Promise<void> {
        // await this.waitSeconds(1)
    }

    private async waitForLoginRedirect(path: string, timeout: number = 10): Promise<boolean> {
        const pageURL: string = page.url()
        if (!pageURL.includes(path) && timeout > 1) {
          await this.waitSeconds(2000)
          return await this.waitForLoginRedirect(path, timeout--)
        }
        else { return pageURL.includes(path) }
      }

}
