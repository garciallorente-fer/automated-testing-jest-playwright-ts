import { readFileSync } from 'fs'
import { cookiesPath } from 'modules/login/cookies'
import waitForExpect from 'wait-for-expect'


export class BasePage {

    public page: {
        readonly name: string
        url: string
        readonly title: string
    }


    public async navigateTo(): Promise<void> {
        await page.goto(this.page.url, { timeout: 40000 })
    }


    public async check(): Promise<void> {
        await waitForExpect(async () => {
            expect((await page.title()).toLowerCase()).toContain(this.page.title.toLowerCase())
        }, 40000)
        await waitForExpect(() => {
            expect(page.url().toLowerCase()).toContain(this.page.url.toLowerCase())
        }, 40000)
    }


    public async takeScreenshot(testName: string): Promise<void> {
        await page.screenshot({ path: `screenshots/${browserName}_${testName}.png` })
    }


    public async addCookies(): Promise<void> {
        const cookies = readFileSync(cookiesPath, 'utf8')
        const deserializedCookies = JSON.parse(cookies)
        await context.addCookies(deserializedCookies)
    }

}
