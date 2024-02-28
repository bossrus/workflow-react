// src/store/modifications.slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { IModification, IModificationStore } from '@/interfaces/modification.interface.ts';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import {
	createAllItemsArraySelector,
	createItemByIdSelector,
	createItemVersionByIdSelector,
	selectAllItemsObject,
} from '@/store/_shared.selectors.ts';
import { TAppState } from '@/store/_store.ts';

const initialState: IModificationStore = {
	data: {},
	error: undefined,
};

export const modificationsSlice = createSlice({
	name: '@@modifications',
	initialState,
	reducers: {
		clearModificationsError: (state, _action) => {
			state.error = undefined;
		},
	},
	extraReducers: createExtraReducers<IModification>('modifications'),
});

export const { clearModificationsError } = modificationsSlice.actions;
export const modificationsReducer = modificationsSlice.reducer;

export const selectAllModificationsArray = createAllItemsArraySelector<IModification>('modifications');
export const selectAllModificationsObject = (state: TAppState) => selectAllItemsObject(state, 'modifications');
export const selectModificationById = createItemByIdSelector<IModification>('modifications');
export const selectModificationVersionById = createItemVersionByIdSelector<IModification>('modifications');