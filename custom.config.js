// eslint-disable-next-line @typescript-eslint/no-var-requires
const JestPlaywrightPresetEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default

class CustomEnvironment extends JestPlaywrightPresetEnvironment {

    failedTest = false

    async handleTestEvent(event, state) {
        super.handleTestEvent(event, state)

        if (event.name === 'test_done' && event.test.errors.length > 0) {
            const parentName = event.test.parent.name.replace(/\W/g, '-')
            const specName = event.test.name.replace(/\W/g, '-')

            await this.global.page.screenshot({
                path: `reports/screenshots/${this.global.browserName}_${parentName}__${specName}.png`
            })
        }

        if (event.name === 'hook_failure' || event.name === 'test_fn_failure') {
            this.failedTest = true
        } else if (this.failedTest && event.name === 'test_start') {
            event.test.mode = 'skip'
        }
    }

}

module.exports = CustomEnvironment
