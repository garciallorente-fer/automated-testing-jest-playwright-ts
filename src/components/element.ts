import { ElementHandle, JSHandle } from 'playwright-core'
import { disabledProperty, classNameProperty } from 'components/data'
import waitForExpect from 'wait-for-expect'

export class Element {

    protected readonly selector: string
    protected readonly parentSelector: string
    protected readonly idSelector: string
    protected readonly parentEngineSelector: string

    constructor(selector: string, parent?: { parentSelector: string, idSelector?: string }) {
        this.selector = selector
        this.parentSelector = parent?.parentSelector
        this.idSelector = parent?.idSelector
        this.parentEngineSelector = parent ?
            `*css=${parent.parentSelector} >> ${parent.idSelector ? parent.idSelector : selector}`
            : undefined
    }


    protected async getElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        if (this.parentEngineSelector) {
            const parentElement = await page.waitForSelector(this.parentEngineSelector, { state: 'attached' })
            return await parentElement.waitForSelector(this.selector, { state: 'attached' })
        }
        return await page.waitForSelector(this.selector, { state: 'attached' })
    }

    protected async getParentElement(): Promise<ElementHandle<SVGElement | HTMLElement>> {
        return await page.waitForSelector(this.parentEngineSelector, { state: 'attached' })
    }


    protected async getElementByInnerHtml(innerHtmls: string[]): Promise<ElementHandle<SVGElement | HTMLElement>> {
        let elements: ElementHandle<SVGElement | HTMLElement>[]
        if (this.parentEngineSelector) {
            const parentElement = await page.waitForSelector(this.parentEngineSelector, { state: 'attached' })
            await expect(parentElement).toHaveSelector(this.selector, { state: 'attached' })
            elements = await parentElement.$$(this.selector)
        } else {
            await expect(page).toHaveSelector(this.selector, { state: 'attached' })
            elements = await page.$$(this.selector)
        }
        for (const element of elements) {
            const elementInnerHtml = (await element.innerHTML()).toLowerCase()
            if (innerHtmls.every(innerHtml => elementInnerHtml.includes(innerHtml.toLowerCase()))) {
                return element
            }
        }
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
                }, 30000)
            } else {
                await waitForExpect(async () => {
                    expect(await element.isVisible()).toBeTruthy()
                }, 30000)
            }
        } catch (error) {
            error.message =
                error.message + ', ' + `${this.selector}, ${this.parentEngineSelector ? this.parentEngineSelector : null}`
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
                    }, 30000)
                    return
                }
                await waitForExpect(async () => {
                    expect(await element.isDisabled() || !await element.isEditable()).toBeTruthy()
                }, 30000)
                return
            }
            await waitForExpect(async () => {
                expect(await element.isEnabled() && await element.isEditable()).toBeTruthy()
            }, 30000)
            await waitForExpect(async () => {
                expect(await this.getElementProperty<boolean>([classNameProperty])).not.toContain(disabledProperty)
            }, 30000)
        } catch (error) {
            error.message =
                error.message + ', ' + `${this.selector}, ${this.parentEngineSelector ? this.parentEngineSelector : null}`
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


    public async getInnerText(): Promise<string> {
        const element = await this.getElement()
        return await element.innerText()
    }


    public async checkExistingText(text: string): Promise<void> {
        const element = await this.getElement()
        await element.waitForSelector(`text=${text}`)
    }


    public async notExists(): Promise<void> {
        await expect(page).not.toHaveSelector(this.selector, { timeout: 250 })
    }

}
