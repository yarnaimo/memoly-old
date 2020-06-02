import cheerio from 'cheerio'
import { Result } from 'lifts'
import { URL } from 'url'
import { got } from '../../lib/http'
import { is } from '../../lib/type'
import { getPlayerProvider } from '../@models/Atom/Bookmark'
import { chromeUserAgent } from './http'

// const fetchByUnfurl = async (url: string) => {
//     const {
//         title,
//         description,
//         twitter_card,
//         open_graph,
//         keywords,
//     } = await unfurl(url)

//     return {
//         keywords,
//         metadata: { title, description },
//         twitterCard: (twitter_card as any) as typeof twitter_card[0],
//         openGraph: (open_graph as any) as typeof open_graph[0],
//     }
// }

// export const fetchPageMetadata = withTrimmedString(async (url: string) => {
//     try {
//         const {
//             keywords,
//             metadata,
//             twitterCard,
//             openGraph,
//         } = await fetchByUnfurl(url)

//         const selectBest = <T extends boolean>(
//             ...values: (string | undefined)[]
//         ) => {
//             type R = T extends true ? string : string | null
//             return (values.find(is.truthy) ?? null) as R
//         }

//         const data = {
//             url,
//             siteUrl: new URL(url).hostname,
//             keywords,
//             title: selectBest<true>(
//                 twitterCard?.title,
//                 openGraph?.title,
//                 metadata.title,
//             ),
//             description: selectBest<true>(
//                 twitterCard?.description,
//                 openGraph?.description,
//                 metadata.description,
//             ),
//             imageUrl: selectBest(
//                 R.first(twitterCard?.images ?? [])?.url,
//                 R.first(openGraph?.images ?? [])?.url,
//             ),
//         }

//         return Result.ok(data)
//     } catch (error) {
//         return Result.err(error)
//     }
// })

const fetchHtml = async (url: string) => {
    return Result.wrap(() =>
        got
            .get(url, {
                headers: {
                    accept: 'text/html, application/xhtml+xml',
                    'user-agent': chromeUserAgent,
                },
            })
            .text(),
    )
}

export const parseMetadataWithCheerio = (pageUrl: string, html: string) =>
    Result.wrap(() => {
        const $ = cheerio.load(html)

        const selectBest = <T extends boolean>(
            ...values: (string | undefined)[]
        ) => {
            type R = T extends true ? string : string | null
            return (values.find(is.truthy) ?? null) as R
        }

        const title = selectBest<true>(
            $('meta[name="twitter:title"]').attr('content'),
            $('meta[property="og:title"]').attr('content'),
            $('title').text(),
        )

        const url = selectBest<true>(
            $('meta[name="twitter:url"]').attr('content'),
            $('meta[property="og:url"]').attr('content'),
            pageUrl,
        )

        const description = selectBest(
            $('meta[name="twitter:description"]').attr('content'),
            $('meta[property="og:description"]').attr('content'),
            $('meta[name="description"]').attr('content'),
        )

        const imageUrl = selectBest(
            $('meta[name="twitter:image"]').attr('content'),
            $('meta[property="og:image"]').attr('content'),
        )

        const host = new URL(pageUrl).hostname
        const playerProvider = getPlayerProvider(url)

        return { title, url, host, description, imageUrl, playerProvider }
    })

export const fetchPageMetadata = async (pageUrl: string) => {
    const fetched = await fetchHtml(pageUrl)
    if (!fetched.isOk) {
        return fetched
    }
    const { value: html } = fetched

    const parsed = parseMetadataWithCheerio(pageUrl, html)
    if (!parsed.isOk) {
        return parsed
    }

    return parsed
}
