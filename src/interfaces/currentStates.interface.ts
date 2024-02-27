export interface ICurrentStatesLocal {
	error: string;
	data: string;
	currentDepartment: string;
	currentType: string;
	currentWorkflowInWork: string;
	currentFirm: string;
	currentWindow: string;
}

export type ICurrentStates = Partial<ICurrentStatesLocal>;