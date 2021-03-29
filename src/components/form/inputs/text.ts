import { FormElement } from 'components/form/form.element'
import { valueProperty } from 'components/data'


export class TextInput extends FormElement {


    public async fillValue(
        textValue: string, delay?: number, stateAfter?: { invalid?: true | 'ignore', hidden?: true, disabled?: true }
    ): Promise<void> {
        const element = await this.getElement()
        if (delay) {
            await element.type(textValue, { delay: delay })
        } else {
            await element.fill(textValue)
        }
        await this.checkState(stateAfter)
        const propertyValue = await this.getElementProperty<string>([valueProperty])
        expect(propertyValue.toLowerCase()).toContain(textValue.toLowerCase())
    }


    public async checkExistingText(textParams: string[]): Promise<void> {
        const propertyValue = await this.getElementProperty<string>([valueProperty])
        expect(textParams.every(text => propertyValue.toLowerCase().includes(text))).toBeTruthy()
    }


    public async deleteText(): Promise<void> {
        const element = await page.waitForSelector(this.selector, { state: 'visible' })
        await element.selectText()
        await page.keyboard.press('Backspace', { delay: 100 })
    }

}
