// src/store/modifications.slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IModification, IModificationStore, IModificationUpdate} from "@/interfaces/modification.interface.ts";
import {createExtraReducers} from "@/store/_shared.reducers.ts";
import {
    createAllItemsArraySelector,
    createItemByIdSelector,
    createItemVersionByIdSelector,
    selectAllItemsObject
} from "@/store/_shared.selectors.ts";
import {TAppState} from "@/store/_store.ts";

const initialState: IModificationStore = {
    data: {},
    error: undefined,
}

export const modificationsSlice = createSlice({
    name: '@@modifications',
    initialState,
    reducers: {
        deleteModification: (state, action: PayloadAction<string>) => {
            delete state.data[action.payload];
        },
        modifyModification: (state, action: PayloadAction<IModificationUpdate>) => {
            state.data[action.payload._id!] = {
                ...state.data[action.payload._id!],
                ...action.payload
            };
        }
    },
    extraReducers: createExtraReducers<IModification>('modifications')
});

export const {deleteModification, modifyModification} = modificationsSlice.actions;
export const modificationsReducer = modificationsSlice.reducer;

export const selectAllModificationsArray = createAllItemsArraySelector<IModification>('modifications');
export const selectAllModificationsObject = (state: TAppState) => selectAllItemsObject(state, 'modifications');
export const selectModificationById = createItemByIdSelector<IModification>('modifications');
export const selectModificationVersionById = createItemVersionByIdSelector<IModification>('modifications');