import { BasePage } from 'pages/base.page'
import { Button } from 'components'
import { TextInput, FormButton } from 'components/form'
import { Example2Data } from 'modules/wikipedia/english-section/model'
import { wikipediaUrl } from 'data/routing.data'


export class WikipediaPage extends BasePage {

    constructor() {
        super()
        this.page = {
            name: 'Wikipedia Home Page',
            url: wikipediaUrl,
            title: 'Wikipedia'
        }
    }

    private readonly englishLinkButton = new Button('a[id=js-link-box-en]')
    private readonly searchBarSelectText = new TextInput('input[name="search"]')
    private readonly searchSubmitButton = new FormButton('button[type=submit][class="pure-button pure-button-primary-progressive"]')


    public async loadComponents(): Promise<void> {
        await Promise.all([
            this.englishLinkButton.exists(),
            this.searchBarSelectText.exists(),
            this.searchSubmitButton.exists()
        ])
    }


    public async clickEnglishLink(): Promise<void> {
        await this.englishLinkButton.click()
    }


    public async searchFor(example2Data: Example2Data): Promise<void> {
        await this.searchBarSelectText.fillValue(example2Data.text)
        await this.searchSubmitButton.click()
    }

}
