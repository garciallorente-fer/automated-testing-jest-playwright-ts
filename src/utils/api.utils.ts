import { Response, Request, Route } from 'playwright-core'


export type API = {
    readonly url: string
    readonly searchParams?: string[]
    readonly status?: number
    readonly avoidParams?: string[]
}

export abstract class ApiInterception {

    private static readonly timeoutApi = 85000


    static async waitForResponseObject<T>(api: API, timeout?: number): Promise<T> {
        try {
            const response = await page.waitForResponse(
                (response: Response) =>
                    ApiInterception.urlIncludes(response.url(), api.url, api.searchParams)
                    && ApiInterception.urlNotIncludes(response.url(), api.avoidParams)
                    && (api.status === response.status() || response.ok())
                , { timeout: timeout ? timeout : this.timeoutApi }
            )
            return await response.json() as T
        } catch (error) {
            error.message = error.message + ' > ' + `${api.url}, ${api.searchParams}, ${api.status}`
            throw error
        }
    }


    static async waitForRequestObject<T>(api: API, timeout?: number): Promise<Readonly<T>> {
        try {
            const request = await page.waitForRequest(
                (request: Request) =>
                    ApiInterception.urlIncludes(request.url(), api.url, api.searchParams)
                    && ApiInterception.urlNotIncludes(request.url(), api.avoidParams)
                    && request.failure() === null
                , { timeout: timeout ? timeout : this.timeoutApi }
            )
            return request.postDataJSON() as T
        } catch (error) {
            error.message = error.message + ' > ' + `${api.url}, ${api.searchParams}, ${api.status}`
            throw error
        }
    }


    static async waitForResponseRequestObject<T>(api: API, timeout?: number): Promise<Readonly<T>> {
        try {
            const request = await page.waitForRequest(
                (request: Request) =>
                    ApiInterception.urlIncludes(request.url(), api.url, api.searchParams)
                    && ApiInterception.urlNotIncludes(request.url(), api.avoidParams)
                    && request.failure() === null
                , { timeout: timeout ? timeout : this.timeoutApi }
            )
            const responseRequest = await request.response()
            return await responseRequest.json() as T
        } catch (error) {
            error.message = error.message + ' > ' + `${api.url}, ${api.searchParams}, ${api.status}`
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


    private static urlIncludes(url: string, apiUrl: string, params?: string[]): boolean {
        url = url.toLowerCase()
        return (
            url.includes(apiUrl.toLowerCase())
            && (params ? params.every(param => url.includes(encodeURI(param).toLowerCase())) : true)
        )
    }

    private static urlNotIncludes(url: string, avoidParams?: string[]): boolean {
        url = url.toLowerCase()
        return (
            avoidParams ? avoidParams.every(avoidParam => !url.includes(encodeURI(avoidParam).toLowerCase())) : true
        )
    }

}
