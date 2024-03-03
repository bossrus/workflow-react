// src/store/typeOfWorks.slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { ITypeOfWork, ITypesOfWorkObject, ITypeOfWorkStore } from '@/interfaces/worktype.interface.ts';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import {
	createAllItemsArraySelector,
	createItemByIdSelector,
	createItemVersionByIdSelector,
	selectAllItemsObject,
} from '@/store/_shared.selectors.ts';
import { TAppState } from '@/store/_store.ts';

const initialState: ITypeOfWorkStore = {
	data: {},
	error: undefined,
};

export const typesOfWorkSlice = createSlice({
	name: '@@typeOfWorks',
	initialState,
	reducers: {
		clearTypesOfWorkError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: createExtraReducers<ITypeOfWork>('typesOfWork'),
});
export const { clearTypesOfWorkError } = typesOfWorkSlice.actions;
export const typesOfWorksReducer = typesOfWorkSlice.reducer;

export const selectAllTypesOfWorkArray = createAllItemsArraySelector<ITypeOfWork>('typesOfWork');
export const selectAllTypesOfWorkObject = (state: TAppState): ITypesOfWorkObject => selectAllItemsObject(state, 'typesOfWork') as ITypesOfWorkObject;

export const selectTypesOfWorkError = (state: TAppState) => state.typesOfWork.error;
export const selectTypesOfWorkById = createItemByIdSelector<ITypeOfWork>('typesOfWork');
export const selectTypesOfWorkVersionById = createItemVersionByIdSelector<ITypeOfWork>('typesOfWork');