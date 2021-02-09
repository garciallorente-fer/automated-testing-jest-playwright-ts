import { Element } from 'components/element'


export class Button extends Element {


    public async click(byInnerHtmls?: string[]): Promise<void> {
        const element = byInnerHtmls
            ? await this.getElementByInnerHtml(byInnerHtmls)
            : await this.getElement()
        await element.click({ delay: 20 })
    }

}
