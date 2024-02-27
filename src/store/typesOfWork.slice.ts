// src/store/typeOfWorks.slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ITypeOfWork, ITypeOfWorkStore, ITypeOfWorkUpdate} from "@/interfaces/worktype.interface.ts";
import {createExtraReducers} from "@/store/_shared.reducers.ts";
import {
    createAllItemsArraySelector,
    createItemByIdSelector,
    createItemVersionByIdSelector,
    selectAllItemsObject
} from "@/store/_shared.selectors.ts";
import {TAppState} from "@/store/_store.ts";

const initialState: ITypeOfWorkStore = {
    data: {},
    error: undefined,
}

export const typeOfWorksSlice = createSlice({
    name: '@@typeOfWorks',
    initialState,
    reducers: {
        deleteTypeOfWork: (state, action: PayloadAction<string>) => {
            delete state.data[action.payload];
        },
        modifyTypeOfWork: (state, action: PayloadAction<ITypeOfWorkUpdate>) => {
            state.data[action.payload._id!] = {
                ...state.data[action.payload._id!],
                ...action.payload
            };
        }
    },
    extraReducers: createExtraReducers<ITypeOfWork>('typesOfWork')
});

export const {deleteTypeOfWork, modifyTypeOfWork} = typeOfWorksSlice.actions;
export const typesOfWorksReducer = typeOfWorksSlice.reducer;

export const selectAllTypeOfWorksArray = createAllItemsArraySelector<ITypeOfWork>('typesOfWork');
export const selectAllTypeOfWorksObject = (state: TAppState) => selectAllItemsObject(state, 'typesOfWork');
export const selectTypeOfWorkById = createItemByIdSelector<ITypeOfWork>('typesOfWork');
export const selectTypeOfWorkVersionById = createItemVersionByIdSelector<ITypeOfWork>('typesOfWork');