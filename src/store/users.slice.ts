// src/store/users.slice.ts
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TAppState } from './_store.ts';
import { IUser, IUserObject, IUserStore } from '@/interfaces/user.interface.ts';
import { load, loadById, createOne } from './_api.slice.ts';
import { IError } from '@/interfaces/auth.interface.ts';

const initialState: IUserStore = {
	data: {},
	error: undefined,
};

export const usersSlice = createSlice({
	name: '@@users',
	initialState,
	reducers: {
		clearUsersError: (state) => {
			state.error = undefined;
		},
		removeUser: (state, action: PayloadAction<string>) => {
			delete state.data[action.payload];
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				(action) => {
					return action.type === load.fulfilled.type && action.store === 'users';
				},
				(state, action: PayloadAction<IUserObject>) => {
					Object.assign(state.data, action.payload);
				})
			.addMatcher(
				(action) => {
					return action.type === load.rejected.type && action.payload.store === 'users';
				}, (state, action: PayloadAction<IError | undefined>) => {
					if (action.payload) {
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
					}
				})
			.addMatcher(
				(action) => {
					return action.type === loadById.fulfilled.type && action.store === 'users';
				},
				(state, action: PayloadAction<IUser>) => {
					state.data[action.payload._id!] = action.payload;
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === loadById.rejected.type && action.payload.store === 'users';
				},
				(state, action: PayloadAction<IError | undefined>) => {
					if (action.payload)
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
				})
			.addMatcher(
				(action) => {
					return action.type === createOne.fulfilled.type && action.store === 'users';
				},

				(state, action: PayloadAction<IUser>) => {
					state.data[action.payload._id!] = action.payload;
				})
			.addMatcher(
				(action) => {
					return action.type === createOne.rejected.type && action.payload.store === 'users';
				},
				(state, action: PayloadAction<IError | undefined>) => {
					if (action.payload)
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
				});
	},
});

export const { clearUsersError, removeUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;

export const selectAllUsersArray = createSelector(
	(state: TAppState) => state.users.data,
	(users) => {
		return Object.values(users) as IUser[];
	},
);

export const selectAllUsersObject =
	(state: TAppState) => state.users.data;

export const selectUsersError = (state: TAppState) => state.users.error;

export const selectUserById = createSelector(
	(state: TAppState, _id: string) => state.users.data,
	(_state: TAppState, id: string) => id,
	(users, id) => {
		if (!users || Object.values(users).length === 0)
			return;
		return users[id];
	},
);

export const selectUserVersionById = createSelector(
	(state: TAppState, _id: string) => state.users.data,
	(_state: TAppState, id: string) => id,
	(users, id) => {
		if (!users || Object.values(users).length === 0)
			return;
		return users[id].version;
	},
);
