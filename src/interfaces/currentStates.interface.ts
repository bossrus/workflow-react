import { IOrder } from '@/interfaces/databases.interface.ts';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';

interface ICurrentStatesLocal {
	error: string;
	data: string;
	currentDepartment: string;
	currentTypeOfWork: string;
	currentWorkflowInWork: string;
	currentFirm: string;
	currentWindow: string;
	currentModification: string;
	currentUser: string;
	statState: {
		firm: string,
		useFirm: boolean,
		modification: string,
		useModification: boolean,
		showChecked: boolean,
		showUnchecked: boolean,
		useDate: boolean,
		dateFrom: string,
		dateTo: string,
		canUpdateTable: boolean,
		sortByField: keyof IWorkflow,
		sortDirection: IOrder,
	};
	flashMessage: string;
}

export type ICurrentStates = Partial<ICurrentStatesLocal>;