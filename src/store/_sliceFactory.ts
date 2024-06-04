//src/store/_sliceFactory.ts
import {
	selectAllItemsArray,
	selectAllItemsObject,
	selectErrors,
} from '@/store/_shared.selectors.ts';
import { IError } from '@/interfaces/auth.interface.ts';
import { createSlice, PayloadAction, Reducer, Slice } from '@reduxjs/toolkit';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import { TAppState } from '@/store/_store.ts';

interface IEntityStore<T> {
	data: Record<string, T>;
	error: IError | undefined;
}

function createInitialState<T>(): IEntityStore<T> {
	return {
		data: {},
		error: undefined,
	};
}

interface IHasId {
	_id: string;
}

export function createEntitySlice<T extends IHasId>(entityNameString: string): {
	slice: Slice,
	actions: any,
	reducer: Reducer,
	selectors: {
		selectAllArray: any,
		selectAllObject: any,
		selectError: any,
	},
} {
	const initialState = createInitialState<T>();

	const entityName = entityNameString as keyof TAppState;

	const sliceName = `@@${entityName}`;
	const slice = createSlice({
		name: sliceName,
		initialState,
		reducers: {
			updateElement: (state, action: PayloadAction<T>) => {
				const id: string = action.payload._id as string;
				state.data[id] = {
					...state.data[id],
					...action.payload,
				};
				console.log('action in auto reducer =', action.payload);
			},
			clearErrors: (state) => {
				state.error = undefined;
			},
			deleteElement: (state, action: PayloadAction<string>) => {
				delete state.data[action.payload];
			},
			clearAll: () => {
				return initialState;
			},
			setError: (state, action: PayloadAction<IError>) => {
				state.error = action.payload;
			},
		},
		extraReducers: createExtraReducers<T>(entityName),
	});

	type MyActions = typeof slice.actions;

	const actions = slice.actions as MyActions;
	const reducer = slice.reducer;

	const selectAllArray = selectAllItemsArray<T>(entityName);
	const selectAllObject = (state: TAppState) => selectAllItemsObject(state, entityName);
	const selectError = (state: TAppState) => selectErrors(state, entityName);


	return {
		slice,
		actions,
		reducer,
		selectors: {
			selectAllArray,
			selectAllObject,
			selectError,
		},
	};
}
