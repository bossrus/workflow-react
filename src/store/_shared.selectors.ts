// src/store/_shared.selectors.ts

import {createSelector} from '@reduxjs/toolkit';
import {TAppState} from './_store.ts';

export const createErrorSelector = (storeField: keyof TAppState) => {
    return createSelector(
        (state: TAppState) => state[storeField].error,
        (item) => item,
    );
};

export const createAllItemsArraySelector = <T>(storeField: keyof TAppState) => {
    return createSelector(
        (state: TAppState) => state[storeField].data,
        (items) => {
            return Object.values(items) as T[];
        },
    );
};

export const selectAllItemsObject = (state: TAppState, storeField: keyof TAppState) => state[storeField].data;

export const createItemByIdSelector = <T>(storeField: keyof TAppState) => {
    return createSelector(
        (state: TAppState, _id: string) => state[storeField].data,
        (_state: TAppState, id: string) => id,
        (items, id) => {
            if (!items || Object.values(items).length === 0 || Array.isArray(items) || typeof items !== 'object' || 'name' in items)
                return;
            return (items as { [key: string]: T })[id];
        },
    );
};

type TWithVersion<T> = T & { version?: number };

export const createItemVersionByIdSelector = <T>(storeField: keyof TAppState) => {
    return createSelector(
        (state: TAppState, _id: string) => state[storeField].data,
        (_state: TAppState, id: string) => id,
        (items, id) => {
            if (!items || Object.values(items).length === 0 || Array.isArray(items) || typeof items !== 'object' || 'name' in items)
                return;
            return ((items as unknown) as { [key: string]: TWithVersion<T> })[id].version;

        },
    );
};
