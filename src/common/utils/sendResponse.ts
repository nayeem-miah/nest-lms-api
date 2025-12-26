import { Response } from 'express';

interface IMeta {
    page?: number;
    limit?: number;
    total?: number;
}

interface IApiResponse<T> {
    statusCode?: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: IMeta;
}

export const sendResponse = <T>(
    res: Response,
    payload: IApiResponse<T>,
) => {
    res.status(payload.statusCode ?? 200).json({
        success: payload.success,
        message: payload.message,
        data: payload.data ?? null,
        meta: payload.meta ?? null,
    });
};
