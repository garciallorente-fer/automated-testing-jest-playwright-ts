import { ElementHandle } from 'playwright-core'


export class Div {

    protected readonly divSelector: string

    constructor(divSelector: string) {
        this.divSelector = divSelector
    }


    protected async getDiv(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.divSelector, { state: 'attached' })
    }


    public async exists(): Promise<void> {
        await expect(page).toHaveSelector(this.divSelector)
    }


    public async notExists(): Promise<void> {
        await expect(page).not.toHaveSelector(this.divSelector, { timeout: 250 })
    }

}
