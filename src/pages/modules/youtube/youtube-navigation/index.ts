import { Authentication } from 'pages/shared'
import { RoutingData, UserCredentials } from 'data'
import { TextInput } from 'components/modules/inputs'
import { AvailableState, FiltersXHR } from 'models'

export default class YoutubeNavigation extends Authentication {
    private youtubeSearchTextInput: TextInput = new TextInput('')

    constructor(theCredentials: UserCredentials) {
        super()
        this.userCredentials = theCredentials
    }

    featureData = {
        featureName: 'YoutubeNavigation',
        featureURL: RoutingData.youtubeUrl,
        pageTitle: 'YouTube'
    }

    public async loginToYoutubeNavigation(): Promise<void> {
        await this.loginTo(this.featureData.featureURL)
        expect(FiltersXHR.date).toBe(1)
    }

    public async loadYoutubeSearch(): Promise<void> {
        // this.youtubeSearchTextInput.loadedTextInput()
        expect(AvailableState.enabled).toBe(true)
    }

    public async fillYoutubeSearchForm(fillText: string): Promise<void> {
        // this.youtubeSearchTextInput.fillValueElementTextInput(fillText)
    }
}
