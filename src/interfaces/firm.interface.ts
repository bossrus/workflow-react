import { IError } from '@/interfaces/auth.interface.ts';

export interface IFirm {
	_id?: string;
	title: string;
	titleSlug?: string;
	basicPriority: number;
	version?: number;
	isDeleted?: number;
}

export interface IFirmsObject {
	[_id: string]: IFirm;
}

export interface IFirmStore {
	data: IFirmsObject;
	error: IError | undefined;
}

export type IFirmUpdate = Partial<IFirm>
