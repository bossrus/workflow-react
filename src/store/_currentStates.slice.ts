// src/store/_currentStates.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICurrentStates } from '@/interfaces/currentStates.interface.ts';
import { TAppState } from '@/store/_store.ts';

const initialState: ICurrentStates = {};

export const currentStatesSlice = createSlice({
	name: '@@states',
	initialState,
	reducers: {
		setState: (state, action: PayloadAction<Partial<ICurrentStates>>) => {
			const entries = Object.entries(action.payload) as [keyof ICurrentStates, ICurrentStates[keyof ICurrentStates]][];
			entries.forEach(([key, value]) => {
				state[key] = value as any;
			});
		},
	},
});

export const { setState } = currentStatesSlice.actions;
export const currentStatesReducer = currentStatesSlice.reducer;

export const selectCurrentStates = (state: TAppState) => state.currentStates;
