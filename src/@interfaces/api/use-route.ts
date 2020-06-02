import { Do, IResult } from 'lifts'
import microCors from 'micro-cors'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { t } from '../../../lib/type'
import { serverConfig } from '../../.config/server-config'
import { appAdmin } from '../../@infrastructure/firebase/_app-admin'
import { apiError } from '../../@utils/error'

const cors = microCors({ allowMethods: ['POST'] })

type RouteHandler<I extends RecordBase, O extends RecordBase> = (
    requestData: RecordStaticType<I>,
    req: NextApiRequest,
    res: NextApiResponse,
) => Promise<IResult<RecordStaticType<O>, ApiError>>

type RecordBase = { [_: string]: t.Runtype<unknown> }

type RecordStaticType<O extends RecordBase> = {
    readonly [K in keyof O]: t.Static<O[K]>
}

const wrap = <I extends RecordBase, O extends RecordBase>(
    requestRecord: t.Record<I, false>,
    responseRecord: t.Record<O, false>,
    handler: RouteHandler<I, O>,
    preprocess?: (requestData: RecordStaticType<I>) => RecordStaticType<I>,
): NextApiHandler => async (req, res) => {
    const sendOk = (body: object) => res.status(200).json(body)

    const sendError = ({ statusCode, message }: ApiError) => {
        return res.status(statusCode).json({ statusCode, message })
    }

    try {
        if (req.method !== 'POST') {
            return sendError(
                apiError(405, 'リクエストメソッドが許可されていません'),
            )
        }

        const idToken = await Do(() => {
            const token = req.headers.authorization?.slice('Bearer '.length)
            if (!token) {
                return
            }
            return appAdmin.auth().verifyIdToken(token)
        })

        if (!idToken || idToken.uid !== serverConfig.auth.adminId) {
            return sendError(apiError(403, 'アクセスが許可されていません'))
        }

        const validated = requestRecord.validate(
            preprocess ? preprocess(req.body) : req.body,
        )

        if (!validated.success) {
            return sendError(apiError(400, 'リクエストの形式が無効です'))
        }

        const handlerResponse = await handler(validated.value, req, res)

        if (handlerResponse.isOk) {
            const { value: responseData } = handlerResponse
            return sendOk(responseData)
        } else {
            const { error } = handlerResponse
            console.error(error)
            return sendError(error)
        }
    } catch (error) {
        console.error(error)
        return sendError(apiError(500, 'エラーが発生しました'))
    }
}

export const useRoute = <I extends RecordBase, O extends RecordBase>(
    requestType: I,
    responseType: O,
) => {
    const requestRecord = t.Record(requestType)
    const responseRecord = t.Record(responseType)

    const f = (
        handler: RouteHandler<I, O>,
        preprocess?: (requestData: RecordStaticType<I>) => RecordStaticType<I>,
    ) => {
        const wrappedHandler = wrap(
            requestRecord,
            responseRecord,
            handler,
            preprocess,
        )

        return cors(wrappedHandler as any)
    }

    return f as typeof f & { __handler__: RouteHandler<I, O> }
}
