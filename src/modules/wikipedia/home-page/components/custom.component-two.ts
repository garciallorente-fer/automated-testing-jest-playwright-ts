import { FormElement, Button } from 'components'
import { valueProperty } from 'components/data'


export class CustomComponentHomePage extends FormElement {

    private readonly toggleButton = new Button('.className-toggle', { parentSelector: this.parentSelector, idSelector: this.selector })
    private readonly optionButton = new Button('.className-result', { parentSelector: this.parentSelector, idSelector: this.selector })


    public async checkState(state?: { invalid?: true | 'ignore', hidden?: true, disabled?: true }): Promise<void> {
        state?.invalid !== 'ignore' && await this.checkInvalidState(state?.invalid)
        await this.toggleButton.exists({ ...state })
    }


    public async clickOption(optionName: string, optionId: string, stateAfter?: { hidden?: true, disabled?: true }): Promise<void> {
        await this.toggleButton.click()
        await this.optionButton.click([optionName])
        await this.checkState(stateAfter)
        const propertyValue = await this.getElementProperty<string>([valueProperty])
        expect(propertyValue.toLowerCase()).toContain(optionId.toLowerCase())
    }

}
