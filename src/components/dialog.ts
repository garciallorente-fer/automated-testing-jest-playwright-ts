import { ElementHandle } from 'playwright-core'


export class Dialog {

    protected readonly dialogSelector: string

    constructor(dialogSelector: string) {
        this.dialogSelector = dialogSelector
    }

    protected readonly timeoutDialog = 60000


    protected async getDialog(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.dialogSelector, { state: 'attached', timeout: this.timeoutDialog })
    }


    public async exists(): Promise<void> {
        await this.getDialog()
    }


    public async notExists(): Promise<void> {
        await page.waitForSelector(this.dialogSelector, { state: 'detached', timeout: this.timeoutDialog })
    }

}
