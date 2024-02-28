// src/store/firms.slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { IFirm, IFirmStore } from '@/interfaces/firm.interface.ts';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import {
	createAllItemsArraySelector,
	createItemByIdSelector,
	createItemVersionByIdSelector,
	selectAllItemsObject,
} from '@/store/_shared.selectors.ts';
import { TAppState } from '@/store/_store.ts';

const initialState: IFirmStore = {
	data: {},
	error: undefined,
};

export const firmsSlice = createSlice({
	name: '@@firms',
	initialState,
	reducers: {
		clearFirmsError: (state, _action) => {
			state.error = undefined;
		},
	},
	extraReducers: createExtraReducers<IFirm>('firms'),
});

export const { clearFirmsError } = firmsSlice.actions;
export const firmsReducer = firmsSlice.reducer;

export const selectAllFirmsArray = createAllItemsArraySelector<IFirm>('firms');
export const selectAllFirmsObject = (state: TAppState) => selectAllItemsObject(state, 'firms');
export const selectFirmById = createItemByIdSelector<IFirm>('firms');
export const selectFirmVersionById = createItemVersionByIdSelector<IFirm>('firms');