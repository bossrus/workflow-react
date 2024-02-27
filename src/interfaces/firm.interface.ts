import {IError} from "@/interfaces/auth.interface.ts";

export interface IFirm {
    _id?: string;
    title: string;
    titleSlug?: string;
    basicPriority?: number;
    version?: number;
    isDeleted?: number;
}

export interface IFirmObject {
    [_id: string]: IFirm;
}

export interface IFirmStore {
    data: IFirmObject;
    error: IError | undefined;
}

export type IFirmUpdate = Partial<IFirm>
