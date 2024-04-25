import { IWorkflow, IWorkflowsObject } from '@/interfaces/workflow.interface.ts';
import { IFirmsObject } from '@/interfaces/firm.interface.ts';
import { IUserUpdate } from '@/interfaces/user.interface.ts';

const changeUrgency = (wrk: IWorkflow, firmsObject: IFirmsObject) => {
	if (!firmsObject || Object.keys(firmsObject).length === 0) return wrk;
	const workflow = { ...wrk };
	workflow.urgency = workflow.urgency
		+ (firmsObject[workflow.firm].basicPriority ? firmsObject[workflow.firm].basicPriority : 0)
		+ (workflow.isPublished ? Math.round((Date.now() - workflow.isPublished) / 1000) : 0);
	return workflow;
};


export const getWorkflowsObject = (workflowsAll: IWorkflowsObject, firmsObject: IFirmsObject) => {
	if (!workflowsAll || !firmsObject) return {};
	if (Object.keys(workflowsAll).length === 0 || Object.keys(firmsObject).length === 0) return {};
	return Object.entries(workflowsAll).reduce((acc, [key, workflowFromObj]) => {
		acc[key] = changeUrgency(workflowFromObj, firmsObject);
		return acc;
	}, {} as IWorkflowsObject);
};

export const getWorkflowsNotPublished = (workflowsAll: IWorkflowsObject, firmsObject: IFirmsObject, me: IUserUpdate): IWorkflow[] => {
	if (!workflowsAll || !me) return [];
	return Object.entries(workflowsAll)
		.reduce((acc, [_, workflowFromObj]) => {
			if (!workflowFromObj.isPublished) {
				acc.push(changeUrgency(workflowFromObj, firmsObject));
			}
			return acc;
		}, [] as IWorkflow[])
		.sort((a, b) => b.urgency - a.urgency);
};

export const getWorkflowsPublished = (workflowsAll: IWorkflowsObject, firmsObject: IFirmsObject, me: IUserUpdate) => {
	if (!workflowsAll || !me) return [];
	return Object.entries(workflowsAll)
		.reduce((acc, [_, workflowFromObj]) => {
			if (workflowFromObj.isPublished) {
				acc.push(changeUrgency(workflowFromObj, firmsObject));
			}
			return acc;
		}, [] as IWorkflow[])
		.sort((a, b) => b.urgency - a.urgency);
};

export const getWorkflowsInMyDepartment = (workflowsAll: IWorkflowsObject, firmsObject: IFirmsObject, me: IUserUpdate) => {
	if (!workflowsAll || !me) return [];
	return Object.entries(workflowsAll)
		.reduce((acc, [_, workflowFromObj]) => {
			if (workflowFromObj.isPublished && workflowFromObj.currentDepartment === me.currentDepartment &&
				(!workflowFromObj.executors || workflowFromObj.executors.length === 0)) {
				acc.push(changeUrgency(workflowFromObj, firmsObject));
			}
			return acc;
		}, [] as IWorkflow[])
		.sort((a, b) => b.urgency - a.urgency);
};

export const getWorkflowsInMyProcess = (workflowsAll: IWorkflowsObject, firmsObject: IFirmsObject, me: IUserUpdate) => {
	if (!workflowsAll) return [];
	return Object.entries(workflowsAll)
		.reduce((acc, [_, workflowFromObj]) => {
			if (workflowFromObj.isPublished && workflowFromObj.executors?.includes(me._id!)) {
				acc.push(changeUrgency(workflowFromObj, firmsObject));
			}
			return acc;
		}, [] as IWorkflow[])
		.sort((a, b) => b.urgency - a.urgency);
};
