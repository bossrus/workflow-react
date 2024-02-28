// src/store/_currentStates.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICurrentStates, ICurrentStatesLocal } from '@/interfaces/currentStates.interface.ts';
import { TAppState } from '@/store/_store.ts';

const initialState: ICurrentStates = {};

export const currentStatesSlice = createSlice({
	name: '@@states',
	initialState,
	reducers: {
		setState: (state, action: PayloadAction<ICurrentStates>) => {
			const key = Object.keys(action.payload)[0] as keyof ICurrentStatesLocal;
			state[key] = action.payload[key];
		},
	},
});

export const { setState } = currentStatesSlice.actions;
export const currentStatesReducer = currentStatesSlice.reducer;

export const selectCurrentStates = (state: TAppState) => state.currentStates;
export const selectCurrentStatesError = (state: TAppState) => state.currentStates.error;