// src/store/departments.slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IDepartment, IDepartmentObject, IDepartmentStore} from "@/interfaces/department.interface.ts";
import {createExtraReducers} from "@/store/_shared.reducers.ts";
import {
    createAllItemsArraySelector,
    createItemByIdSelector,
    createItemVersionByIdSelector,
    selectAllItemsObject
} from "@/store/_shared.selectors.ts";
import {TAppState} from "@/store/_store.ts";

const initialState: IDepartmentStore = {
    data: {},
    error: undefined,
}

export const departmentsSlice = createSlice({
    name: '@@departments',
    initialState,
    reducers: {
        deleteDepartment: (state, action: PayloadAction<string>) => {
            delete state.data[action.payload];
        },
    },
    extraReducers: createExtraReducers<IDepartment>('departments')
});

export const {deleteDepartment} = departmentsSlice.actions;
export const departmentsReducer = departmentsSlice.reducer;

export const selectAllDepartmentsArray = createAllItemsArraySelector<IDepartment>('departments');
export const selectAllDepartmentsObject = (state: TAppState): IDepartmentObject => selectAllItemsObject(state, 'departments') as IDepartmentObject;

export const selectDepartmentById = createItemByIdSelector<IDepartment>('departments');
export const selectDepartmentVersionById = createItemVersionByIdSelector<IDepartment>('departments');