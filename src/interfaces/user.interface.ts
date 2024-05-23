import { IError } from '@/interfaces/auth.interface.ts';

export interface IUser {
	_id: string;
	login: string;
	loginSlug?: string;
	name: string;
	email?: string;
	emailConfirmed?: boolean;
	currentDepartment?: string;
	currentWorkflowInWork?: string;
	departments: string[];
	isSendLetterAboutNewWorks: boolean;
	canStartStopWorks: boolean;
	canSeeStatistics: boolean;
	isAdmin: boolean;
	canMakeModification: boolean;
	isDeleted?: number;
	isSoundOn: boolean;
	currentPage: string;
	version?: number;
	loginToken?: string;
	password: string;
	canWriteToSupport: boolean;
}

export interface IUserObject {
	[_id: string]: IUser;
}

export interface IUserStore {
	data: IUserObject;
	error: IError | undefined | null;
}

export interface IUsersOnlineStore {
	data: string[];
	error: IError | undefined;
}

export type IUserUpdate = Partial<IUser>

export type IUserKeys = keyof IUser;

