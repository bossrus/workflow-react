import {IError} from "@/interfaces/auth.interface.ts";

export interface IModification {
    _id?: string;
    title: string;
    titleSlug: string;
    version?: number;
    isDeleted?: number;
}

export interface IModificationObject {
    [_id: string]: IModification;
}

export interface IModificationStore {
    data: IModificationObject;
    error: IError | undefined;
}

export type IModificationUpdate = Partial<IModification>
