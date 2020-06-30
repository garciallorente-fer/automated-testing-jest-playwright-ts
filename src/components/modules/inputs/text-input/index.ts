import { ElementHandle } from 'playwright-core'
import { BaseComponent } from 'components/shared'
import { ComponentData } from 'data'

export default class TextInput extends BaseComponent {
    private componentData: ComponentData

    constructor(textInputTestId: string) {
        super()
        this.componentData = {
            testId: `${textInputTestId}`,
            testClass: '',
            type: ''
        }
    }

    private selectorTextInput(): string {
        return `${this.componentData.testId} ${this.componentData.testClass}`
    }
    private elementTextInput(): Promise<ElementHandle<HTMLOrSVGElement>> {
        return page.$(this.selectorTextInput())
    }
    private existsElementTextInput(): Promise<boolean> {
        return this.elementExists(this.selectorTextInput())
    }


    public async loadedTextInput(): Promise<void> {
        await page.waitForSelector(this.selectorTextInput())
        expect(await this.existsElementTextInput()).toBeTruthy()
        await this.confirmTypeElementTextInput()
    }

    private async confirmTypeElementTextInput(): Promise<void> {
        const elementTextInput: ElementHandle<HTMLOrSVGElement> = await this.elementTextInput()
        const typeElementTextInput: string = (await (await elementTextInput.getProperty('type')).jsonValue()).toString()
        expect(typeElementTextInput).toEqual(this.componentData.type)
    }


    public async fillValueElementTextInput(valueText: string): Promise<void> {
        await this.loadedTextInput()
        const elementTextInput: ElementHandle<HTMLOrSVGElement> = await this.elementTextInput()
        await elementTextInput.type(valueText, {delay: 1})
        await this.confirmValidValueElementTextInput(valueText)
    }

    private async confirmValidValueElementTextInput(valueText: string): Promise<void> {
        await this.loadedTextInput()
        const elementTextInput = await this.elementTextInput()
        const valueElementTextInput: string = (await (await elementTextInput.getProperty('value')).jsonValue()).toString()
        expect(valueElementTextInput).toEqual(valueText)
    }


    public async getValueElementTextInput(): Promise<string> {
        await this.loadedTextInput()
        const elementTextInput: ElementHandle<HTMLOrSVGElement> = await this.elementTextInput()
        const valueElementTextInput: string = (await (await elementTextInput.getProperty('value')).jsonValue()).toString()
        return valueElementTextInput
    }

}

