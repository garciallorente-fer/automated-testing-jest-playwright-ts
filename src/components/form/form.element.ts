import { ElementHandle } from 'playwright-core'
import { Element } from 'components/element'
import { valueProperty, validityProperty, validProperty, invalidProperty, classNameProperty } from 'components/data'
import waitForExpect from 'wait-for-expect'


export class FormElement extends Element {

    protected readonly wrapperInfo: { title: string, text: string, errorMessage: string }

    constructor(
        selector: string, parentSelector?: string, wrapperInfo?: { title?: string, text?: string, errorMessage?: string }
    ) {
        super(selector, parentSelector)
        this.wrapperInfo = { title: wrapperInfo?.title, text: wrapperInfo?.text, errorMessage: wrapperInfo?.errorMessage }
    }


    protected async getElementByValue(values: string[]): Promise<ElementHandle<SVGElement | HTMLElement>> {
        const elements = await this.getElements()
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
        this.parentSelector && await this.wrapperExists(wrapperState)
        await this.checkState(state)
    }


    protected async wrapperExists(wrapperState?: { hiddenWrapper: true }): Promise<void> {
        const parentElement = await this.getParentElement()
        try {
            await parentElement.waitForElementState(wrapperState?.hiddenWrapper ? 'hidden' : 'stable', { timeout: this.timeoutElement })
            this.wrapperInfo?.title && await page.waitForSelector(
                `${this.parentSelector}:has-text("${this.wrapperInfo.title}")`,
                { state: wrapperState?.hiddenWrapper ? 'attached' : 'visible', timeout: this.timeoutElement }
            )
            this.wrapperInfo?.text && await page.waitForSelector(
                `${this.parentSelector}:has-text("${this.wrapperInfo.text}")`,
                { state: wrapperState?.hiddenWrapper ? 'attached' : 'visible', timeout: this.timeoutElement }
            )
        } catch (error) {
            error.message = 'HiddenWrapper=' + wrapperState?.hiddenWrapper + ' > ' + error.message + ' > ' + this.selector
            throw new Error(error.message)
        }
    }


    public async checkState(state?: { invalid?: true | 'ignore', hidden?: true, disabled?: true }): Promise<void> {
        state?.invalid !== 'ignore' && await this.checkInvalidState(state?.invalid)
        await this.checkHiddenState(state?.hidden)
        await this.checkDisabledState(state?.disabled)
    }

    protected async checkInvalidState(invalid?: true | 'notcheck'): Promise<void> {
        const propertyValid = await this.getElementProperty<string>([validityProperty, validProperty])
        try {
            if (!propertyValid) {
                expect(invalid).toBeTruthy()
                return
            }
            if (invalid) {
                await waitForExpect(async () => {
                    expect(await this.getElementProperty<string>([classNameProperty])).toContain(invalidProperty)
                }, this.timeoutElement)
            } else {
                await waitForExpect(async () => {
                    expect(await this.getElementProperty<string>([classNameProperty])).not.toContain(invalidProperty)
                }, this.timeoutElement)
            }
        } catch (error) {
            error.message = 'Invalid=' + invalid + ' > ' + error.message + ' > ' + this.selector
            throw new Error(error.message)
        }
    }


    public async checkValidationError(disabled?: true): Promise<void> {
        await this.checkState({ invalid: true, disabled: disabled })
        if (this.wrapperInfo?.errorMessage) {
            await page.waitForSelector(
                `${this.parentSelector}:has-text("${this.wrapperInfo.errorMessage}")`, { timeout: this.timeoutElement }
            )
        }
    }

}
