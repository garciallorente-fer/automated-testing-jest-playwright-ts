import { FormElement } from 'components/form/form.element'
import { valueProperty } from 'components/data'


export class SelectInput extends FormElement {


    public async selectOption(
        option: { value?: string, label?: string, index?: number }, stateAfter?: { hidden?: true, disabled?: true }
    ): Promise<void> {
        const element = await this.getElement()
        const selectedOption = await element.selectOption({ value: option.value, label: option.label, index: option.index })
        await this.checkState(stateAfter)
        const propertyValue = await this.getElementProperty<string>([valueProperty])
        if(option.value){
            expect(selectedOption[0].toLowerCase()).toContain(option.value.toLowerCase())
            expect(propertyValue.toLowerCase()).toContain(option.value.toLowerCase())
        }
    }

}
