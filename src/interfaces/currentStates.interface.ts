export interface ICurrentStatesLocal {
	error: string;
	data: string;
	currentDepartment: string;
	currentTypeOfWork: string;
	currentWorkflowInWork: string;
	currentFirm: string;
	currentWindow: string;
	currentModification: string;
	currentUser: string;
}

export type ICurrentStates = Partial<ICurrentStatesLocal>;