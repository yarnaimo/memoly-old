import { ApiError } from 'next/dist/next-server/server/api-utils'

export const apiError = (statusCode: number, message: string) =>
    new ApiError(statusCode, message)
