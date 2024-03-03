// src/store/_shared.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { TAppState } from './_store.ts';
import { IError } from '@/interfaces/auth.interface.ts';


interface IEntityStore<T> {
	data: Record<string, T>;
	error: IError | undefined;
}

export const selectErrors = (state: TAppState, storeField: keyof TAppState) => (state[storeField] as IEntityStore<any>).error;

export const selectAllItemsArray = <T>(storeField: keyof TAppState) => {
	return createSelector(
		(state: TAppState) => (state[storeField] as IEntityStore<any>).data,
		(items) => {
			if (Array.isArray(items)) {
				return items as T[];
			} else if (typeof items === 'object' && items !== null) {
				return Object.values(items) as T[];
			}
			return [];
		},
	);
};

// @ts-ignore
export const selectAllItemsObject = (state: TAppState, storeField: keyof TAppState) => (state[storeField] as IEntityStore<any>).data;

export const selectItemById = <T>(storeField: keyof TAppState) => {
	return createSelector(
		(state: TAppState, _id: string) => (state[storeField] as IEntityStore<any>).data,
		(_state: TAppState, id: string) => id,
		(items, id) => {
			if (!items || Object.values(items).length === 0 || Array.isArray(items) || typeof items !== 'object' || 'name' in items)
				return;
			return (items as { [key: string]: T })[id];
		},
	);
};

type TWithVersion<T> = T & { version?: number };

export const selectItemVersionById = <T>(storeField: keyof TAppState) => {
	return createSelector(
		(state: TAppState, _id: string) => (state[storeField] as IEntityStore<any>).data,
		(_state: TAppState, id: string) => id,
		(items, id) => {
			if (!items || Object.values(items).length === 0 || Array.isArray(items) || typeof items !== 'object' || 'name' in items)
				return;
			return ((items as unknown) as { [key: string]: TWithVersion<T> })[id].version;

		},
	);
};
