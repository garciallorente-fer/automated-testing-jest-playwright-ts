import { Response, Request, Route } from 'playwright-core'


export type API = {
    readonly url: string
    readonly status: number
    readonly searchParams?: string[]
    readonly avoidParams?: string[]
}

export abstract class ApiInterception {

    private static readonly timeoutApi = 95000


    static async waitForResponseObject<T>(api: API, timeout?: number): Promise<T> {
        const response = await this.waitForResponse(api, timeout)
        return await response.json() as T
    }

    static async waitForRequestObject<T>(api: API, requestMethod?: string, timeout?: number): Promise<T> {
        const request = await this.waitForRequest(api, requestMethod, timeout)
        return await request.postDataJSON() as T
    }

    static async waitForResponseRequestObject<T>(api: API, requestMethod?: string, timeout?: number): Promise<T> {
        const request = await this.waitForRequest(api, requestMethod, timeout)
        const responseRequest = await request.response()
        return await responseRequest.json() as T
    }

    static async waitForRequestAndResponseObject<requestT, responseT>(
        api: API, requestMethod?: string, timeout?: number
    ): Promise<[requestT, responseT]> {
        const request = await this.waitForRequest(api, requestMethod, timeout)
        const responseRequest = await request.response()
        return [await request.postDataJSON() as requestT, await responseRequest.json() as responseT]
    }


    static async waitForResponseString(api: API, timeout?: number): Promise<string> {
        const response = await this.waitForResponse(api, timeout)
        return await response.text()
    }

    static async waitForRequestString(api: API, requestMethod?: string, timeout?: number): Promise<string> {
        const request = await this.waitForRequest(api, requestMethod, timeout)
        return request.postData()
    }

    static async waitForResponseRequestString(api: API, requestMethod?: string, timeout?: number): Promise<string> {
        const request = await this.waitForRequest(api, requestMethod, timeout)
        const responseRequest = await request.response()
        return await responseRequest.text()
    }


    static async waitForResponse(api: API, timeout?: number): Promise<Response> {
        const allResponses = []
        try {
            return await page.waitForResponse(
                (response: Response) => {
                    if (ApiInterception.urlIncludes(response.url(), api.url, api.searchParams)
                        && ApiInterception.urlNotIncludes(response.url(), api.avoidParams)
                        && api.status === response.status() // || response.ok()
                    ) {
                        return true
                    }
                    if (ApiInterception.urlIncludes(response.url(), api.url)) {
                        allResponses.push(response.url() + ' Status:' + response.status())
                    }
                }, { timeout: timeout ? timeout : this.timeoutApi }
            )
        } catch (error) {
            throw new Error(
                `Failed RESPONSE> "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nResponses list:\n${allResponses.join('\n')}`
            )
        }
    }


    static async waitForRequest(api: API, requestMethod?: string, timeout?: number): Promise<Request> {
        const allRequests = []
        try {
            return await page.waitForRequest(
                (request: Request) => {
                    if (ApiInterception.urlIncludes(request.url(), api.url, api.searchParams)
                        && ApiInterception.urlNotIncludes(request.url(), api.avoidParams)
                        && request.failure() === null
                    ) {
                        if (requestMethod) {
                            if (request.method() === requestMethod) return true
                        } else {
                            return true
                        }
                    }
                    if (ApiInterception.urlIncludes(request.url(), api.url)) {
                        allRequests.push(request.url() + ' Status:' + request.failure())
                    }
                }, { timeout: timeout ? timeout : this.timeoutApi }
            )
        } catch (error) {
            throw new Error(
                `Failed REQUEST> "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}"
                \nRequests list:\n${allRequests.join('\n')}`
            )
        }
    }


    static async mock(api: API, mockFilePath: string): Promise<(url: URL) => boolean> {
        const apiUrl = (url: URL) => ApiInterception.urlIncludes(url.toString(), api.url, api.searchParams)
        const mockRoute = (route: Route) => route.fulfill({ status: api.status, path: mockFilePath })
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
