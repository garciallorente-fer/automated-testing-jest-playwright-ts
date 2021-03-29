import { FormElement, TextInput, Button } from 'components'
import { valueProperty } from 'components/data'


export class CustomComponentExample extends FormElement {

    private readonly textInput = new TextInput('.textInput-class', this.parentSelector)
    private readonly optionButton = new Button('.resultButton-class', this.parentSelector)


    public async checkState(state?: { invalid?: true | 'ignore', hidden?: true, disabled?: true }): Promise<void> {
        state?.invalid !== 'ignore' && await this.checkInvalidState(state?.invalid)
        await this.textInput.checkState({ invalid: 'ignore', hidden: state?.hidden, disabled: state?.disabled })
    }


    public async fillValue(value: string): Promise<void> {
        await this.textInput.fillValue(value)
    }


    public async clickOption(values: string[], stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        await this.optionButton.click(values)
        await this.checkState(stateAfter)
    }


    public async checkValue(value: string): Promise<void> {
        const propertyValue = (await this.getElementProperty<string>([valueProperty])).toLowerCase()
        expect(propertyValue.toLowerCase()).toContain(value.toLowerCase())
    }


    public async deleteText(): Promise<void> {
        await this.textInput.deleteText()
    }

}
