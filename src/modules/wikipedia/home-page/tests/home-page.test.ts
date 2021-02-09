import { WikipediaPage } from 'modules/wikipedia/home-page/pages/home.page'
import { Example2Data } from 'modules/wikipedia/english-section/model'


const testData: Example2Data = {
    text: 'Search Text'
}


// beforeAll(async () => {
//     await englishSectionWikiPage.addCookies()
// })


describe('Wikipedia Test', () => {

    const wikipediaPage = new WikipediaPage()

    test(`Navigate to ${wikipediaPage.page.name}`, async () => {
        await wikipediaPage.navigateTo()
        await wikipediaPage.check()
        await wikipediaPage.loadComponents()
    })
    test(`Search ${wikipediaPage.page.name}`, async () => {
        await wikipediaPage.searchFor(testData)
    })

})
