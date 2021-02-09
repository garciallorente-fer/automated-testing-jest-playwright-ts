import { BasePage } from 'pages/base.page'
import { Button } from 'components'
import { englishWikipediaUrl } from 'data/routing.data'


export class EnglishSectionWikiPage extends BasePage {

    constructor() {
        super()
        this.page = {
            name: 'English Section Wikipedia',
            url: englishWikipediaUrl + 'wiki/Main_Page',
            title: 'Wikipedia, the free encyclopedia'
        }
    }

    private readonly logoLink = new Button('a[class="mw-wiki-logo"]')


    public async loadComponents(): Promise<void> {
        await Promise.all([
            this.logoLink.exists()
        ])
    }

}
