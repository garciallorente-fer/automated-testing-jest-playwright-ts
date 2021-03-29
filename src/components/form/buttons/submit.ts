import { FormElement } from 'components/form/form.element'


export class SubmitButton extends FormElement {


    public async exists(state?: { hidden?: true, disabled?: true }, wrapperState?: { hiddenWrapper: true }): Promise<void> {
        this.parentSelector && await this.wrapperExists(wrapperState)
        await this.checkState({ invalid: 'ignore', hidden: state?.hidden, disabled: state?.disabled })
    }


    public async click(): Promise<void> {
        const element = await this.getElement()
        await element.click({ delay: 20 })
    }

}
