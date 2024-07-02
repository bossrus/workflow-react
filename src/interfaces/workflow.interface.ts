import { IError } from '@/interfaces/auth.interface.ts';

export interface IWorkflow {
	_id?: string;
	mainId?: string;
	title: string;
	titleSlug: string;
	countPages: number;
	countPictures: number;
	type: string;
	firm: string;
	modification: string;
	currentDepartment: string;
	whoAddThisWorkflow: string;
	isPublished?: number;
	executors?: string[];
	setToStat: boolean;
	description: string;
	urgency: number;
	isCheckedOnStat?: number;
	isDone?: number;
	version?: number;
	isDeleted?: number;
}

export interface IWorkflowsObject {
	[_id: string]: IWorkflow;
}


export type IWorkflowsKeys = keyof IWorkflow;

export type IWorkflowUpdate = Partial<IWorkflow>

export interface IWorkflowSlice {
	workflow: IWorkflowUpdate;
	myId: string;
}

export interface ITakeWorkflowThunk {
	ids: string[];
}
