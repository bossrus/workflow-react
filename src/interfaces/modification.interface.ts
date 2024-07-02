import { IError } from '@/interfaces/auth.interface.ts';

export interface IModification {
	_id: string;
	title: string;
	titleSlug: string;
	version: number;
	isDeleted: number;
}

export interface IModificationsObject {
	[_id: string]: IModification;
}

export type IModificationUpdate = Partial<IModification>
