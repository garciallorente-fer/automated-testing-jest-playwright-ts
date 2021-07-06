import { ElementHandle, JSHandle } from 'playwright-core'
import { disabledProperty, classNameProperty, valueProperty } from 'components/data'
import waitForExpect from 'wait-for-expect'


export class Element {

    protected readonly selector: string
    protected readonly parentSelector: string

    constructor(selector: string, parentSelector?: string) {
        this.selector = parentSelector ? `${parentSelector} ${selector}` : selector
        this.parentSelector = parentSelector ? `${parentSelector}:has(${selector})` : undefined
    }

    protected readonly timeoutElement = 60000


    protected async getElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.selector, { state: 'attached', timeout: this.timeoutElement })
    }

    protected async getElements(): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
        await page.waitForSelector(this.selector, { state: 'attached', timeout: this.timeoutElement })
        return await page.$$(this.selector)
    }

    protected async getElementByInnerHtml(innerHtmls: string[]): Promise<ElementHandle<SVGElement | HTMLElement>> {
        const elementInnerHtmls: string[] = []
        const elements = await this.getElements()
        for (const element of elements) {
            const elementInnerHtml = await element.innerHTML()
            elementInnerHtmls.push(elementInnerHtml)
            if (innerHtmls.every(innerHtml => elementInnerHtml.toLowerCase().includes(innerHtml.toLowerCase()))) {
                return element
            }
        }
        throw new Error(`None of these innerHtmls: ${innerHtmls} >> were found in these elementInnerHtmls: ${elementInnerHtmls}`)
    }

    protected async getParentElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.parentSelector, { state: 'attached', timeout: this.timeoutElement })
    }


    public async exists(state?: { hidden?: true, disabled?: true }): Promise<void> {
        await this.checkHiddenState(state?.hidden)
        await this.checkDisabledState(state?.disabled)
    }

    protected async checkHiddenState(hidden?: true): Promise<void> {
        const element = await this.getElement()
        try {
            if (hidden) {
                await waitForExpect(async () => {
                    expect(await element.isHidden()).toBeTruthy()
                }, this.timeoutElement)
            } else {
                await waitForExpect(async () => {
                    expect(await element.isVisible()).toBeTruthy()
                }, this.timeoutElement)
            }
        } catch (error) {
            error.message = 'Hidden=' + hidden + ' > ' + error.message + ' > ' + this.selector
            throw new Error(error.message)
        }
    }

    protected async checkDisabledState(disabled?: true): Promise<void> {
        const element = await this.getElement()
        const isEnabled = await element.isEnabled()
        const isEditable = await element.isEditable()
        try {
            if (disabled) {
                if (isEnabled && isEditable) {
                    await waitForExpect(async () => {
                        expect(await this.getElementProperty<string>([classNameProperty])).toContain(disabledProperty)
                    }, this.timeoutElement)
                    return
                }
                await waitForExpect(async () => {
                    expect(await element.isDisabled() || !await element.isEditable()).toBeTruthy()
                }, this.timeoutElement)
                return
            }
            await waitForExpect(async () => {
                expect(await element.isEnabled()).toBeTruthy()
            }, this.timeoutElement)
            await waitForExpect(async () => {
                expect(await this.getElementProperty<string>([classNameProperty])).not.toContain(disabledProperty)
            }, this.timeoutElement)
        } catch (error) {
            error.message = 'Disabled=' + disabled + ' > ' + error.message + ' > ' + this.selector
            throw new Error(error.message)
        }
    }


    public async getElementProperty<T>(properties: string[]): Promise<T> {
        let propertyHandle = await this.getElement() as JSHandle
        for (const property of properties) {
            propertyHandle = await propertyHandle.getProperty(property)
        }
        const propertyValue: T = await propertyHandle.jsonValue()
        return propertyValue
    }


    public async getValue(): Promise<string> {
        return await this.getElementProperty<string>([valueProperty])
    }


    public async getInnerText(): Promise<string> {
        const element = await this.getElement()
        return await element.innerText()
    }


    public async getInnerElement(innerElementSelector: string): Promise<ElementHandle<SVGElement | HTMLElement>> {
        const element = await this.getElement()
        return await element.$(innerElementSelector)
    }

    public async getInnerElements(innerElementsSelector: string): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
        const element = await this.getElement()
        return await element.$$(innerElementsSelector)
    }


    public async checkExistingText(textParams: string[]): Promise<void> {
        const element = await this.getElement()
        for (const text of textParams) {
            await element.waitForSelector(
                text.includes('"') ? `text=/${text}/s` : `text=${text}`, { timeout: this.timeoutElement })
        }
    }


    public async notExists(): Promise<void> {
        await page.waitForSelector(this.selector, { state: 'detached', timeout: this.timeoutElement })
    }


    public async innerElementNotExists(innerElementsSelector: string): Promise<void> {
        const element = await this.getElement()
        await element.waitForSelector(innerElementsSelector, { state: 'detached', timeout: this.timeoutElement })
    }


    public async checkActive(isActive: boolean): Promise<void> {
        try {
            isActive ?
                await waitForExpect(async () => {
                    expect(await this.getElementProperty<string>([classNameProperty])).toContain('active')
                }, this.timeoutElement)
                :
                await waitForExpect(async () => {
                    expect(await this.getElementProperty<string>([classNameProperty])).not.toContain('active')
                }, this.timeoutElement)
        } catch (error) {
            error.message = 'Active=' + isActive + ' > ' + error.message + ' > ' + this.selector
            throw new Error(error.message)
        }
    }

}
