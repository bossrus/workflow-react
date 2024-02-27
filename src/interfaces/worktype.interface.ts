import {IError} from "@/interfaces/auth.interface.ts";

export interface ITypeOfWork {
    _id?: string;
    title: string;
    titleSlug: string;
    version?: number;
    isDeleted?: number;
}

export interface ITypeOfWorkObject {
    [_id: string]: ITypeOfWork;
}

export interface ITypeOfWorkStore {
    data: ITypeOfWorkObject;
    error: IError | undefined;
}

export type ITypeOfWorkUpdate = Partial<ITypeOfWork>
