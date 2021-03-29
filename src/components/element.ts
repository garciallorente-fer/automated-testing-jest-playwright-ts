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

    protected readonly timeoutWaitForExpect = 30000


    protected async getElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.selector, { state: 'attached' })
    }

    protected async getElements(): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
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
        throw new Error(`Custom Error! None of these innerHtmls: ${innerHtmls} >> matched these elementInnerHtml: ${elementInnerHtmls}`)
    }

    protected async getParentElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.parentSelector, { state: 'attached' })
    }


    public async exists(state?: { hidden?: true, disabled?: true, notExists?: boolean }): Promise<void> {
        if (state?.notExists) {
            await expect(page).not.toHaveSelector(this.selector, { timeout: 500 })
        } else {
            await this.checkHiddenState(state?.hidden)
            await this.checkDisabledState(state?.disabled)
        }
    }

    protected async checkHiddenState(hidden?: true): Promise<void> {
        const element = await this.getElement()
        try {
            if (hidden) {
                await waitForExpect(async () => {
                    expect(await element.isHidden()).toBeTruthy()
                }, this.timeoutWaitForExpect)
            } else {
                await waitForExpect(async () => {
                    expect(await element.isVisible()).toBeTruthy()
                }, this.timeoutWaitForExpect)
            }
        } catch (error) {
            error.message = error.message + ' > ' + this.selector
            throw error
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
                        expect(await this.getElementProperty<boolean>([classNameProperty])).toContain(disabledProperty)
                    }, this.timeoutWaitForExpect)
                    return
                }
                await waitForExpect(async () => {
                    expect(await element.isDisabled() || !await element.isEditable()).toBeTruthy()
                }, this.timeoutWaitForExpect)
                return
            }
            await waitForExpect(async () => {
                expect(await element.isEnabled()).toBeTruthy()
            }, this.timeoutWaitForExpect)
            await waitForExpect(async () => {
                expect(await this.getElementProperty<boolean>([classNameProperty])).not.toContain(disabledProperty)
            }, this.timeoutWaitForExpect)
        } catch (error) {
            error.message = error.message + ' > ' + this.selector
            throw error
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
        return await element.waitForSelector(innerElementSelector)
    }

    public async getInnerElements(innerElementsSelector: string): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
        const element = await this.getElement()
        return await element.$$(innerElementsSelector)
    }


    public async checkExistingText(textParams: string[]): Promise<void> {
        const element = await this.getElement()
        for (const text of textParams) {
            await element.waitForSelector(text.includes('"') ? `text=/${text}/s` : `text=${text}`)
        }
    }


    public async notExists(): Promise<void> {
        await expect(page).not.toHaveSelector(this.selector, { timeout: 500 })
    }


    public async innerNotExists(innerElementsSelector: string): Promise<void> {
        const element = await this.getElement()
        await expect(element).not.toHaveSelector(innerElementsSelector, { timeout: 500 })
    }


    public async checkActive(isActive: boolean): Promise<void> {
        isActive ?
            await waitForExpect(async () => {
                expect((await this.getElementProperty<string>([classNameProperty])).includes('active')).toBeTruthy()
            }, this.timeoutWaitForExpect)
            :
            await waitForExpect(async () => {
                expect((await this.getElementProperty<string>([classNameProperty])).includes('active')).toBeFalsy()
            }, this.timeoutWaitForExpect)
    }


    public async scrollTo(): Promise<void> {
        const element = await this.getElement()
        await element.scrollIntoViewIfNeeded()
    }


}
