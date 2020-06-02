import { parseMetadataWithCheerio } from '../../@utils/page-metadata'

const pageUrl = (n: number) => `https://example.com/page-${n}`
const title = (n: number) => `title-${n}`
const url = (n: number) => `https://example.com/${n}`
const description = (n: number) => `description-${n}`
const imageUrl = (n: number) => `https://example.com/image-${n}`

describe('parseMetadataWithCheerio', () => {
    test('1', () => {
        const result = parseMetadataWithCheerio(
            url(3),
            `
            <head>
                <meta name="twitter:title" content=${title(1)}>
                <meta name="twitter:url" content=${url(1)}>
                <meta name="twitter:description" content=${description(1)}>
                <meta name="twitter:image" content=${imageUrl(1)}>

                <meta property="og:title" content=${title(2)}>
                <meta property="og:url" content=${url(2)}>
                <meta property="og:description" content=${description(2)}>
                <meta property="og:image" content=${imageUrl(2)}>

                <title>${title(3)}</title>
                <meta name="description" content=${description(3)}>
            </head>
        `,
        )
        expect(result.valueOrError).toEqual({
            title: title(1),
            url: url(1),
            description: description(1),
            imageUrl: imageUrl(1),
        })
    })

    test('2', () => {
        const result = parseMetadataWithCheerio(
            url(3),
            `
            <head>
                <meta property="og:title" content=${title(2)}>
                <meta property="og:url" content=${url(2)}>
                <meta property="og:description" content=${description(2)}>
                <meta property="og:image" content=${imageUrl(2)}>

                <title>${title(3)}</title>
                <meta name="description" content=${description(3)}>
            </head>
        `,
        )
        expect(result.valueOrError).toEqual({
            title: title(2),
            url: url(2),
            description: description(2),
            imageUrl: imageUrl(2),
        })
    })

    test('3', () => {
        const result = parseMetadataWithCheerio(
            url(3),
            `
            <head>
                <title>${title(3)}</title>
                <meta name="description" content=${description(3)}>
            </head>
        `,
        )
        expect(result.valueOrError).toEqual({
            title: title(3),
            url: url(3),
            description: description(3),
            imageUrl: null,
        })
    })
})
