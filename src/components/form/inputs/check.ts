import { ElementHandle } from 'playwright-core'
import { FormElement } from 'components/form/form.element'
import { checkedProperty } from 'components/data'


export class CheckInput extends FormElement {

    protected checkValues: string[]


    protected setCheckValues(checkValues?: string[]): void {
        this.checkValues = checkValues
    }


    protected async getElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        if (this.checkValues) {
            return await this.getElementByValue(this.checkValues)
        } else {
            return await page.waitForSelector(this.selector, { state: 'attached', timeout: this.timeoutElement })
        }
    }


    public async checkOption(checkValues?: string[], stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        this.setCheckValues(checkValues)
        const element = await this.getElement()
        await element.check()
        await this.checkState(stateAfter)
        expect(await this.getElementProperty<boolean>([checkedProperty])).toBeTruthy()
    }


    public async uncheckOption(checkValues?: string[], stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        this.setCheckValues(checkValues)
        const element = await this.getElement()
        await element.uncheck()
        await this.checkState(stateAfter)
        expect(await this.getElementProperty<boolean>([checkedProperty])).toBeFalsy()
    }

}
