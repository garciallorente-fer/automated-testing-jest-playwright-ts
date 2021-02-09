import { Response, Request, Route } from 'playwright-core'


export type API = {
    readonly url: string
    readonly searchParams?: string[]
    readonly status?: number
}

export abstract class ApiInterception {


    static async waitForResponseObject<T>(api: API): Promise<T> {
        try {
            const response = await page.waitForResponse(
                (response: Response) =>
                    ApiInterception.urlIncludes(response.url(), api.url, api.searchParams)
                    && (api.status === response.status() || response.ok())
            )
            return await response.json() as T
        } catch (error) {
            error.message = error.message + ', ' + `${api.url}, ${api.searchParams}, ${api.status}`
            throw error
        }
    }


    static async waitForRequestObject<T>(api: API): Promise<Readonly<T>> {
        try {
            const request = await page.waitForRequest(
                (request: Request) =>
                    ApiInterception.urlIncludes(request.url(), api.url, api.searchParams)
                    && request.failure() === null
            )
            return request.postDataJSON() as T
        } catch (error) {
            error.message = error.message + ', ' + `${api.url}, ${api.searchParams}, ${api.status}`
            throw error
        }
    }


    static async mock(api: API, mockFilePath: string): Promise<(url: URL) => boolean> {
        const apiUrl = (url: URL) => ApiInterception.urlIncludes(url.toString(), api.url, api.searchParams)
        const mockRoute = (route: Route) => route.fulfill({ status: api.status ? api.status : 200, path: mockFilePath })
        await page.route(apiUrl, mockRoute)
        return apiUrl
    }

    static async unmock(apiUrl: (url: URL) => boolean): Promise<void> {
        await page.unroute(apiUrl)
    }


    private static urlIncludes(responseUrl: string, apiUrl: string, params?: string[]): boolean {
        responseUrl = responseUrl.toLowerCase()
        return (
            responseUrl.includes(apiUrl.toLowerCase())
            && (params ? params.every(param => responseUrl.includes(encodeURIComponent(param).toLowerCase())) : true)
        )
    }

}
