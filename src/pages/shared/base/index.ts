import { Response } from 'playwright-core'
import { FeatureData } from 'data'

export default class BasePage {
    protected featureData: FeatureData

    protected async navigateToPage(path: string): Promise<void> {
        await page.goto(`${path}`, { waitUntil: "networkidle" })
    }

    public async waitSeconds(x: number): Promise<void> {
        await page.waitForTimeout(x * 1000)
    }

    public async jestPlaywrightDebug(): Promise<void> {
        await jestPlaywright.debug()
    }

    public async checkPageTitle(): Promise<void> {
        expect(await page.title()).toBe(this.featureData.pageTitle)
    }

    public async takeScreenshot(testName: string): Promise<void> {
        await page.screenshot({ path: `screenshots/${testName}_${browserName}.png` })
    }

}
