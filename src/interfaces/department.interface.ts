import {IError} from "@/interfaces/auth.interface.ts";

export interface IDepartment {
    _id: string;
    title: string;
    titleSlug: string;
    numberInWorkflow: string;
    isUsedInWorkflow: boolean;
    version?: number;
    isDeleted?: number;
}

export interface IDepartmentObject {
    [_id: string]: IDepartment;
}

export interface IDepartmentStore {
    data: IDepartmentObject;
    error: IError | undefined;
}

export type IDepartmentUpdate = Partial<IDepartment>