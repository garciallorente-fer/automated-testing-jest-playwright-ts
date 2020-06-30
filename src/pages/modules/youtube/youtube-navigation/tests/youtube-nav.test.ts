import { YoutubeNavigation } from 'pages/modules'
import { exampleCredentials } from 'data'

let exampleYoutubeNavigation: YoutubeNavigation = new YoutubeNavigation(exampleCredentials)

const youtubeNavigationData = {
    youtubeSearchText: 'youtubeSearchText',
    youtubeSearchTextTwo: 'youtubeSearchTextTwo'
}

describe(`${exampleYoutubeNavigation.featureData.featureName}`, () => {

    it('Logs in Youtube', async () => {
        await exampleYoutubeNavigation.loginToYoutubeNavigation()
        await exampleYoutubeNavigation.loadYoutubeSearch()
        // await exampleYoutubeNavigation.jestPlaywrightDebug()
        // await exampleYoutubeNavigation.waitSeconds(1)
        await exampleYoutubeNavigation.checkPageTitle()
        // await exampleYoutubeNavigation.takeScreenshot('YoutubeTestManualScreenshot')
    })

    it('Searchs in Youtube', async () => {
        await exampleYoutubeNavigation.fillYoutubeSearchForm(youtubeNavigationData.youtubeSearchText)

    })

})
