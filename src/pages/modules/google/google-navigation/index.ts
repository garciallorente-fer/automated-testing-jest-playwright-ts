import { Authentication } from 'pages/shared'
import { RoutingData, UserCredentials } from 'data'
import { TextInput } from 'components/modules/inputs'
import { AvailableState, FiltersXHR } from 'models'

export default class GoogleNavigation extends Authentication {
    private googleSearchTextInput: TextInput = new TextInput('')

    constructor(theCredentials: UserCredentials) {
        super()
        this.userCredentials = theCredentials
    }

    featureData = {
        featureName: 'GoogleNavigation',
        featureURL: RoutingData.googleUrl,
        pageTitle: 'Google'
    }

    public async loginToGoogleNavigation(): Promise<void> {
        await this.loginTo(this.featureData.featureURL)
        expect(FiltersXHR.date).toBe(1)
    }

    public async loadGoogleSearch(): Promise<void> {
        // this.youtubeSearchTextInput.loadedTextInput()
        expect(AvailableState.enabled).toBe(true)    }

    public async fillGoogleSearchForm(fillText: string): Promise<void> {
        // this.googleSearchTextInput.fillValueElementTextInput(fillText)
    }
}
