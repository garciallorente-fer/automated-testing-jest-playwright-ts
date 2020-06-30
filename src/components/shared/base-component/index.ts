// import { ElementHandle } from 'playwright-core'

export default class BaseComponent {

    protected async elementExists(selector: string): Promise<boolean> {
        const element = await page.$(selector)
        return element !== null
      }

}
