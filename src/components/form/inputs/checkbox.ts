import { FormElement } from 'components/form/form.element'
import { checkedProperty } from 'components/data'


export class CheckboxInput extends FormElement {


    public async checkOption(radioValues?: string[], stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        const element = radioValues
            ? await this.getElementByValue(radioValues)
            : await this.getElement()
        await element.check()
        await this.checkState(stateAfter)
        expect(await this.getElementProperty<boolean>([checkedProperty])).toBeTruthy()
    }

}
