import { FormElement } from 'components/form/form.element'
import { valueProperty } from 'components/data'


export class SelectInput extends FormElement {


    public async selectOption(optionName: string, optionId?: string, stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        const element = await this.getElement()
        const selectedOption = await element.selectOption(optionName)
        expect(selectedOption[0].toLowerCase()).toContain(optionName.toLowerCase())
        await this.checkState(stateAfter)
        const propertyValue = await this.getElementProperty<string>([valueProperty])
        expect(propertyValue.toLowerCase()).toContain(optionId ? optionId.toLowerCase() : optionName.toLowerCase())
    }

}
