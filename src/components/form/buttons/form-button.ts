import { FormElement } from 'components/form/form.element'


export class FormButton extends FormElement {


    public async click(byInnerHtmls?: string[]): Promise<void> {
        const element = byInnerHtmls
            ? await this.getElementByInnerHtml(byInnerHtmls)
            : await this.getElement()
        await element.click({ delay: 20 })
    }

}
