import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useMemo } from 'react';
import { IWorkflow, IWorkflowsObject } from '@/interfaces/workflow.interface.ts';

const useWorksSelectors = () => {

	const {
		firmsObject,
		workflowsAll,
		me,
	} = useReduxSelectors();

	const changeUrgency = (wrk: IWorkflow) => {
		const workflow = { ...wrk };
		workflow.urgency = workflow.urgency
			+ (firmsObject[workflow.firm].basicPriority ? firmsObject[workflow.firm].basicPriority : 0)
			+ (workflow.isPublished ? Math.round((Date.now() - workflow.isPublished) / 1000) : 0);
		return workflow;
	};


	const workflowsObject = useMemo(() => {
		if (!workflowsAll || !firmsObject) return {};
		if (Object.keys(workflowsAll).length === 0 || Object.keys(firmsObject).length === 0) return {};
		return Object.entries(workflowsAll).reduce((acc, [key, workflowFromObj]) => {
			acc[key] = changeUrgency(workflowFromObj);
			return acc;
		}, {} as IWorkflowsObject);
	}, [workflowsAll, firmsObject]);

	const workflowsPublishedObject = useMemo(() => {
		if (!workflowsAll) return {};
		return Object.entries(workflowsAll).reduce((acc, [key, workflowFromObj]) => {
			if (workflowFromObj.isPublished) {
				acc[key] = changeUrgency(workflowFromObj);
			}
			return acc;
		}, {} as IWorkflowsObject);
	}, [workflowsAll]);

	const workflowsNotPublishedObject = useMemo(() => {
		if (!workflowsAll) return {};
		return Object.entries(workflowsAll).reduce((acc, [key, workflowFromObj]) => {
			if (!workflowFromObj.isPublished) {
				acc[key] = changeUrgency(workflowFromObj);
			}
			return acc;
		}, {} as IWorkflowsObject);
	}, [workflowsAll]);

	const workflowsNotPublishedArray = useMemo(() => {
		if (!workflowsAll || !me) return [];
		return Object.entries(workflowsAll)
			.reduce((acc, [_, workflowFromObj]) => {
				if (!workflowFromObj.isPublished) {
					acc.push(changeUrgency(workflowFromObj));
				}
				return acc;
			}, [] as IWorkflow[])
			.sort((a, b) => b.urgency - a.urgency);
	}, [workflowsAll, me.currentDepartment]);

	const workflowsPublishedArray = useMemo(() => {
		if (!workflowsAll || !me) return [];
		return Object.entries(workflowsAll)
			.reduce((acc, [_, workflowFromObj]) => {
				if (workflowFromObj.isPublished) {
					acc.push(changeUrgency(workflowFromObj));
				}
				return acc;
			}, [] as IWorkflow[])
			.sort((a, b) => b.urgency - a.urgency);
	}, [workflowsAll, me.currentDepartment]);

	const workflowsInMyDepartment = useMemo(() => {
		if (!workflowsAll || !me) return [];
		return Object.entries(workflowsAll)
			.reduce((acc, [_, workflowFromObj]) => {
				if (workflowFromObj.isPublished && workflowFromObj.currentDepartment === me.currentDepartment &&
					(!workflowFromObj.executors || workflowFromObj.executors.length === 0)) {
					acc.push(changeUrgency(workflowFromObj));
				}
				return acc;
			}, [] as IWorkflow[])
			.sort((a, b) => b.urgency - a.urgency);
	}, [workflowsAll, me.currentDepartment]);

	const workflowsInMyProcess = useMemo(() => {
		if (!workflowsAll) return [];
		return Object.entries(workflowsAll)
			.reduce((acc, [_, workflowFromObj]) => {
				if (workflowFromObj.isPublished && workflowFromObj.executors?.includes(me._id!)) {
					acc.push(changeUrgency(workflowFromObj));
				}
				return acc;
			}, [] as IWorkflow[])
			.sort((a, b) => b.urgency - a.urgency);
	}, [workflowsAll]);


	return {
		workflowsObject,
		workflowsPublishedObject,
		workflowsPublishedArray,

		workflowsNotPublishedObject,
		workflowsNotPublishedArray,

		workflowsInMyDepartment,
		workflowsInMyProcess,
	};
};

export default useWorksSelectors;