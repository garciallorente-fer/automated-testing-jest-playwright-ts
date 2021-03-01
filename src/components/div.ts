import { ElementHandle } from 'playwright-core'


export class Dialog {

    protected readonly dialogSelector: string

    constructor(dialogSelector: string) {
        this.dialogSelector = dialogSelector
    }


    protected async getDiv(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.dialogSelector, { state: 'attached' })
    }


    public async exists(): Promise<void> {
        await expect(page).toHaveSelector(this.dialogSelector)
    }


    public async notExists(): Promise<void> {
        await expect(page).not.toHaveSelector(this.dialogSelector, { timeout: 500 })
    }

}
