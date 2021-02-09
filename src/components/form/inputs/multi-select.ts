import { FormElement } from 'components/form/form.element'


export class MultiSelectInput extends FormElement {


    public async selectOptions(optionNames?: string[], stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        const element = await this.getElement()
        const selectedOptions = await element.selectOption(optionNames)
        expect(selectedOptions.every(selectedOption => optionNames.includes(selectedOption))).toBeTruthy()
        await this.checkState(stateAfter)
    }

}
