// src/store/workflows.slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { IWorkflow, IWorkflowsObject, IWorkflowStore } from '@/interfaces/workflow.interface.ts';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import {
	createAllItemsArraySelector,
	createItemByIdSelector,
	createItemVersionByIdSelector,
	selectAllItemsObject,
} from '@/store/_shared.selectors.ts';
import { TAppState } from '@/store/_store.ts';

const initialState: IWorkflowStore = {
	data: {},
	error: undefined,
};

export const workflowsSlice = createSlice({
	name: '@@workflows',
	initialState,
	reducers: {
		clearWorkflowsError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: createExtraReducers<IWorkflow>('workflows'),
});

export const { clearWorkflowsError } = workflowsSlice.actions;
export const workflowsReducer = workflowsSlice.reducer;

export const selectAllWorkflowsArray = createAllItemsArraySelector<IWorkflow>('workflows');
export const selectAllWorkflowsObject = (state: TAppState): IWorkflowsObject => selectAllItemsObject(state, 'workflows') as IWorkflowsObject;

export const selectWorkflowsError = (state: TAppState) => state.workflows.error;

export const selectWorkflowById = createItemByIdSelector<IWorkflow>('workflows');
export const selectWorkflowVersionById = createItemVersionByIdSelector<IWorkflow>('workflows');