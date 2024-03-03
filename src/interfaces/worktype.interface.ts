import { IError } from '@/interfaces/auth.interface.ts';

export interface ITypeOfWork {
	_id?: string;
	title: string;
	titleSlug: string;
	version?: number;
	isDeleted?: number;
}

export interface ITypesOfWorkObject {
	[_id: string]: ITypeOfWork;
}

export interface ITypeOfWorkStore {
	data: ITypesOfWorkObject;
	error: IError | undefined;
}

export type ITypeOfWorkUpdate = Partial<ITypeOfWork>
