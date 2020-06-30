import { GoogleNavigation } from 'pages/modules'
import { exampleCredentials } from 'data'

let exampleGoogleNavigation: GoogleNavigation = new GoogleNavigation(exampleCredentials)

const googleNavigationData = {
    googleSearchText: 'googleSearchText',
    googleSearchTextTwo: 'googleSearchTextTwo'
}

describe(`${exampleGoogleNavigation.featureData.featureName}`, () => {

    it('Logs in Google', async () => {
        await exampleGoogleNavigation.loginToGoogleNavigation()
        await exampleGoogleNavigation.loadGoogleSearch()
        // await exampleGoogleNavigation.jestPlaywrightDebug()
        // await exampleGoogleNavigation.waitSeconds(1)
        await exampleGoogleNavigation.checkPageTitle()
        // await exampleGoogleNavigation.takeScreenshot('GoogleTestManualScreenshot')
    })

    it('Searchs in Google', async () => {
        await exampleGoogleNavigation.fillGoogleSearchForm(googleNavigationData.googleSearchText)

    })

})
