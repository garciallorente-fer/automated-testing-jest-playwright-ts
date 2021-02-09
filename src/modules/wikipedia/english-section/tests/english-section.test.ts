import { WikipediaPage } from 'modules/wikipedia/home-page/pages'
import { EnglishSectionWikiPage } from 'modules/wikipedia/english-section/pages'


// beforeAll(async () => {
//     await englishSectionWikiPage.addCookies()
// })

describe('English Section Test', () => {

    const wikipediaPage = new WikipediaPage()

    test(`Navigate to ${wikipediaPage.page.name}`, async () => {
        await wikipediaPage.navigateTo()
        await wikipediaPage.check()
        await wikipediaPage.loadComponents()
    })

    const englishSectionWikiPage = new EnglishSectionWikiPage()

    test(`Click English link navigating to ${englishSectionWikiPage.page.name}`, async () => {
        await wikipediaPage.clickEnglishLink()
        await englishSectionWikiPage.check()
        await englishSectionWikiPage.loadComponents()
    })

})
