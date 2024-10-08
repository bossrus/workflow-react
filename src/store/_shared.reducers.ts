import { ActionReducerMapBuilder, Draft, PayloadAction } from '@reduxjs/toolkit';
import { createOne, deleteOne, load, loadById, patchOne } from '@/store/_shared.thunks.ts';
import { IError } from '@/interfaces/auth.interface.ts';

type TWithId<T> = T & { _id: string };
export const createExtraReducers = <T>(storeName: string) => (builder: ActionReducerMapBuilder<{
	data: { [key: string]: T },
	error: IError | undefined | null
}>) => {
	{
		builder
			.addMatcher(
				(action) => {
					return action.type === load.fulfilled.type && action.store === storeName;
				},
				(state, action: PayloadAction<{ [key: string]: T }>) => {
					Object.assign(state.data, action.payload);
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === load.rejected.type && action.payload.store === storeName;
				}, (state, action: PayloadAction<IError | undefined | null>) => {
					if (action.payload) {
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
					}
				})
			.addMatcher(
				(action) => {
					return action.type === deleteOne.fulfilled.type && action.store === storeName;
				},
				(state, action: PayloadAction<string>) => {
					delete state.data[action.payload];
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === deleteOne.rejected.type && action.payload.store === storeName;
				}, (state, action: PayloadAction<IError | undefined | null>) => {
					if (action.payload) {
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
					}
				})
			.addMatcher(
				(action) => {
					return action.type === loadById.fulfilled.type && action.store === storeName;
				},
				(state, action: PayloadAction<TWithId<T>>) => {
					state.data[action.payload._id!] = action.payload as Draft<T>;
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === loadById.rejected.type && action.payload.store === storeName;
				},
				(state, action: PayloadAction<IError | undefined | null>) => {
					if (action.payload) {
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
					}
				})
			.addMatcher(
				(action) => {
					return action.type === createOne.fulfilled.type && action.store === storeName;
				},

				(state, action: PayloadAction<TWithId<T>>) => {
					state.data[action.payload._id!] = action.payload as Draft<T>;
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === createOne.rejected.type && action.payload.store === storeName;
				},
				(state, action: PayloadAction<IError | undefined | null>) => {
					if (action.payload)
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
				})
			.addMatcher(
				(action) => {
					return action.type === patchOne.fulfilled.type && action.store === storeName;
				},
				(state, action: PayloadAction<TWithId<T>>) => {
					state.data[action.payload._id!] = {
						...state.data[action.payload._id!],
						...action.payload,
					} as Draft<TWithId<T>>;
					state.error = undefined;
				})
			.addMatcher(
				(action) => {
					return action.type === patchOne.rejected.type && action.payload?.store === storeName;
				},
				(state, action: PayloadAction<IError | undefined | null>) => {
					if (action.payload)
						state.error = {
							status: action.payload.status,
							message: action.payload.message,
						};
				});
	}
};