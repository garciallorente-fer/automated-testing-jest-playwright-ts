const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default

class ScreenshotsEnvironment extends PlaywrightEnvironment {

    async handleTestEvent(event, state) {
        // Hack to set testTimeout for jestPlaywright debugging
        if (event.name === 'add_test' &&
            event.fn &&
            event.fn.toString().includes('jestPlaywright.debug()')) {
            // Set timeout to 4 days
            state.testTimeout = 4 * 24 * 60 * 60 * 1000
        }
        if (event.name === 'test_done' && event.test.errors.length > 0) {
            const parentName = event.test.parent.name.replace(/\W/g, '-')
            const specName = event.test.name.replace(/\W/g, '-')

            await this.global.page.screenshot({
                path: `screenshots/failures/${this.global.browserName}_${parentName}_${specName}.png`,
            })
        }
    }

}

module.exports = ScreenshotsEnvironment
