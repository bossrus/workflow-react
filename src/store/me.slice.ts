// src/store/mes.slice.ts
import { createSelector, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TAppState } from './_store.ts';
import { IUserObject, IUserStore, IUserUpdate } from '@/interfaces/user.interface.ts';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import { authLoad, createOne } from '@/store/_shared.thunks.ts';
import { IError } from '@/interfaces/auth.interface.ts';
import { clearAuth } from '@/_security/auth.ts';

const initialState: IUserStore = {
	data: {},
	error: null,
};

export const mesSlice = createSlice({
	name: '@@mes',
	initialState,
	reducers: {
		changeMeEmail: (state, action: PayloadAction<{ id: string, email: string }>) => {
			const { id, email } = action.payload;
			if (action.payload.email)
				state.data[id].email = email;
		},
		clearMeError: (state) => {
			state.error = undefined;
		},
		clearMe: (state) => {
			(async () => {
				await clearAuth();
			})();
			state.data = {};
		},
	},
	extraReducers: (builder) => {
		createExtraReducers<IUserUpdate>('users/me')(builder);
		builder
			.addMatcher(
				(action) => {
					return action.type === authLoad.fulfilled.type && action.store === 'users/auth';
				},
				(state, action: PayloadAction<IUserObject>) => {
					state.data = action.payload as Draft<IUserObject>;
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === authLoad.rejected.type && action.payload.store === 'users/auth';
				},
				(state, action: PayloadAction<IError | undefined>) => {
					if (action.payload) {
						state.data = {};
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
					}
				})
			.addMatcher(
				(action) => {
					return action.type === createOne.fulfilled.type && action.store === 'users/login';
				},
				(state, action: PayloadAction<IUserObject>) => {
					state.data = action.payload as Draft<IUserObject>;
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === createOne.rejected.type && action.payload.store === 'users/login';
				},
				(state, action: PayloadAction<IError | undefined>) => {
					if (action.payload) {
						state.data = {};
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
					}
				});
	},
});

export const meReducer = mesSlice.reducer;

export const { clearMeError, clearMe, changeMeEmail } = mesSlice.actions;
export const selectMe = createSelector(
	(state: TAppState) => state.me.data,
	(me) => {
		if (me && Object.keys(me).length > 0) {
			const key = Object.keys(me)[0];
			return me[key];
		} else return {};
	});
export const selectMeError = (state: TAppState) => state.me.error;


