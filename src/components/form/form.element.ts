import { ElementHandle } from 'playwright-core'
import { Element } from 'components/element'
import { valueProperty, validityProperty, validProperty, invalidProperty, classNameProperty } from 'components/data'
import waitForExpect from 'wait-for-expect'


export abstract class FormElement extends Element {

    protected readonly wrapperInfo: { title: string, text: string, errorMessage: string }

    constructor(
        selector: string, parent?: { parentSelector: string, idSelector?: string },
        wrapperInfo?: { title?: string, text?: string, errorMessage?: string }
    ) {
        super(selector, parent)
        this.wrapperInfo = { title: wrapperInfo?.title, text: wrapperInfo?.text, errorMessage: wrapperInfo?.errorMessage }
    }


    protected async getElementByValue(values: string[]): Promise<ElementHandle<SVGElement | HTMLElement>> {
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
            const propertyValue: string = (await (await element.getProperty(valueProperty)).jsonValue()).toString().toLowerCase()
            if (propertyValue.includes(values[0].toLowerCase()) && (!values[1] || propertyValue.includes(values[1].toLowerCase()))) {
                return element
            }
        }
    }


    public async exists(
        state?: { invalid?: true | 'ignore', hidden?: true, disabled?: true }, wrapperState?: { hiddenWrapper: true }
    ): Promise<void> {
        this.parentEngineSelector && await this.wrapperExists(wrapperState)
        await this.checkState(state)
    }

    protected async wrapperExists(wrapperState?: { hiddenWrapper: true }): Promise<void> {
        const parentElement = await this.getParentElement()
        await parentElement.waitForElementState(wrapperState?.hiddenWrapper ? 'hidden' : 'stable', { timeout: 30000 })
        this.wrapperInfo?.title && await parentElement.waitForSelector(
            `text=${this.wrapperInfo?.title}`, { state: wrapperState?.hiddenWrapper ? 'attached' : 'visible' }
        )
        this.wrapperInfo?.text && await parentElement.waitForSelector(
            `text=${this.wrapperInfo?.text}`, { state: wrapperState?.hiddenWrapper ? 'attached' : 'visible' }
        )
    }


    public async checkState(state?: { invalid?: true | 'ignore', hidden?: true, disabled?: true }): Promise<void> {
        state?.invalid !== 'ignore' && await this.checkInvalidState(state?.invalid)
        await this.checkHiddenState(state?.hidden)
        await this.checkDisabledState(state?.disabled)
    }

    protected async checkInvalidState(invalid?: true | 'notcheck'): Promise<void> {
        const propertyValid = await this.getElementProperty<string>([validityProperty, validProperty])
        if (!propertyValid) {
            expect(invalid).toBeTruthy()
            return
        }
        try {
            invalid
                ? await waitForExpect(async () => {
                    expect(await this.getElementProperty<boolean>([classNameProperty])).toContain(invalidProperty)
                }, 30000)
                : await waitForExpect(async () => {
                    expect(await this.getElementProperty<boolean>([classNameProperty])).not.toContain(invalidProperty)
                }, 30000)
        } catch (error) {
            error.message = error.message + ', ' + `${this.selector}, ${this.parentEngineSelector ? this.parentEngineSelector : null}`
            throw error
        }
    }


    public async checkValidationError(disabled?: true): Promise<void> {
        await this.checkState({ invalid: true, disabled: disabled })
        const sectionElement = await this.getParentElement()
        this.wrapperInfo?.errorMessage && await sectionElement.waitForSelector(`text=${this.wrapperInfo?.errorMessage}`)
    }

}
