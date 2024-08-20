// src/store/usersOnline.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TAppState } from './_store.ts';
import { IUsersOnlineStore } from '@/interfaces/user.interface.ts';

const initialState: IUsersOnlineStore = {
	data: [],
	error: undefined,
};

export const usersOnlineSlice = createSlice({
	name: '@@usersOnline',
	initialState,
	reducers: {
		setOnline: (state, action: PayloadAction<string[]>) => {
			state.data = action.payload;
		},
	},
});

export const { setOnline } = usersOnlineSlice.actions;
export const usersOnlineReducer = usersOnlineSlice.reducer;

export const selectOnlineUsers = (state: TAppState) => state.usersOnline.data;
export const selectOnlineUsersError = (state: TAppState) => state.usersOnline.error;