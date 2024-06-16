import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosCreate from '@/_api/axiosCreate.ts';
import { ITakeWorkflowThunk, IWorkflowSlice } from '@/interfaces/workflow.interface.ts';
import { TAppState, workflows } from '@/store/_store.ts';


export const closeWorkflowThunk = createAsyncThunk(
	'workflows/closeWorkflowThunk',
	async ({ workflow }: IWorkflowSlice, { dispatch, getState }) => {

		const { data: workflowsObject } = (getState() as TAppState).workflows;
		const me = Object.values((getState() as TAppState).me.data)[0];
		const executors = workflowsObject[workflow._id as string].executors;
		if (executors && executors.includes(me._id)) {
			const newExecutors: string[] = executors.filter((executor: string) => executor !== me._id);

			dispatch(workflows.actions.updateElement({
				_id: workflow._id,
				executors: newExecutors,
				currentDepartment: workflow.currentDepartment,
			}));

			axiosCreate.patch(`/workflows/close/${workflow._id}`, { newDepartment: workflow.currentDepartment }).then();
		}

	},
);

export const takeWorkflowThunk = createAsyncThunk(
	'workflows/takeWorkflowThunk',
	async ({ ids }: ITakeWorkflowThunk, { dispatch, getState }) => {

		const { data: workflowsObject } = (getState() as TAppState).workflows;

		const { _id: myId = '' } = (getState() as TAppState).me.data?.[Object.keys((getState() as TAppState).me.data ?? {})[0]] ?? {};

		ids.forEach((id: string) => {
			const workflow = workflowsObject[id];

			if (workflow) {
				let executors: string[];

				if (!workflow.executors) {
					executors = [myId];
				} else if (Array.isArray(workflow.executors) && !workflow.executors.includes(myId)) {
					executors = [...workflow.executors, myId];
				} else {
					executors = workflow.executors;
				}
				dispatch(workflows.actions.updateElement({
					_id: id,
					executors,
				}));
			}
		});
		axiosCreate.patch('/workflows/take', { ids }).then();
	},
);

export const publishWorkflowThunk = createAsyncThunk(
	'workflows/takeWorkflowThunk',
	async ({ ids }: ITakeWorkflowThunk, { dispatch, getState }) => {

		const { data: workflowsObject } = (getState() as TAppState).workflows;

		ids.forEach((id: string) => {
			const workflow = workflowsObject[id];

			if (workflow) {
				dispatch(workflows.actions.updateElement({
					_id: id,
					isPublished: Date.now(),
				}));
			}
		});

		axiosCreate.patch('/workflows/publish', { ids }).then();
	},
);