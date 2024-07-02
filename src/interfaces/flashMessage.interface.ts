import { IError } from '@/interfaces/auth.interface.ts';

const TypesFlashMessages = ['success', 'error', 'info'] as const;

export type ITypesFlashMessages = (typeof TypesFlashMessages)[number];

export interface IFlashMessages {
	_id?: string;
	type: ITypesFlashMessages;
	to: string;
	message: string;
	isDeleted?: number;
}

export interface IFlashMessagesObject {
	[_id: string]: IFlashMessages;
}

