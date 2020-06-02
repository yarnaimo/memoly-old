import { Server } from 'http'
import { Result } from 'lifts'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import { ky as _ky } from '../../../lib/http'
import { t } from '../../../lib/type'
import { useRoute } from '../../@interfaces/api/use-route'
import { apiError } from '../../@utils/error'

const port = 3007
const url = `http://localhost:${port}`

const route = useRoute(
    { name: t.String, height: t.Number },
    { isUmi: t.Boolean },
)

const handler = route(async (data, req, res) => {
    if (data.name === '403') {
        return Result.err(apiError(403, 'Forbidden'))
    }
    if (data.name === '500') {
        throw new Error()
    }
    return Result.ok({ isUmi: data.name === 'umi' })
})

let server: Server

beforeAll(() => {
    server = new Server((req, res) =>
        apiResolver(req, res, {}, handler, {} as any),
    ).listen(port)
})

afterAll(() => {
    server.close()
})

const ky = _ky.extend({ throwHttpErrors: false })

const expectedResponse = (statusCode: number, message: string) => ({
    statusCode,
    message,
})

test('error - 405', async () => {
    const res = await ky.get(url, {})

    expect(res.status).toBe(405)
    expect(await res.json()).toEqual(
        expectedResponse(405, 'リクエストメソッドが許可されていません'),
    )
})

test('error - 400', async () => {
    const res = await ky.post(url, { json: { name: 'umi', height: '155' } })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual(
        expectedResponse(400, 'リクエストの形式が無効です'),
    )
})

test('error - 500', async () => {
    const res = await ky.post(url, { json: { name: '500', height: 155 } })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual(
        expectedResponse(500, 'エラーが発生しました'),
    )
})

test('error - handler - 403', async () => {
    const res = await ky.post(url, { json: { name: '403', height: 155 } })

    expect(res.status).toBe(403)
    expect(await res.json()).toEqual(expectedResponse(403, 'Forbidden'))
})

test('ok - umi', async () => {
    const res = await ky.post(url, { json: { name: 'umi', height: 155 } })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ isUmi: true })
})

test('ok - not umi', async () => {
    const res = await ky.post(url, { json: { name: 'shiho', height: 161 } })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ isUmi: false })
})
