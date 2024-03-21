import { IError } from '@/interfaces/auth.interface.ts';

export interface IInviteToJoin {
	_id?: string;
	from: string;
	to: string;
	workflow: string;
	isDeleted?: number;
}

export interface IInviteToJoinObject {
	[_id: string]: IInviteToJoin;
}

export interface IFlashStore {
	data: IInviteToJoinObject;
	error: IError | undefined;
}