//src/store/_sliceFactory.ts
import { createAction, createSlice, PayloadAction, Reducer, Slice } from '@reduxjs/toolkit';
import { TAppState } from '@/store/_store.ts';
import { IError } from '@/interfaces/auth.interface.ts';
import { createExtraReducers } from '@/store/_shared.reducers.ts';
import { selectAllItemsArray, selectAllItemsObject, selectErrors } from '@/store/_shared.selectors.ts';
import { Draft } from 'immer'; // Добавьте этот импорт

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

	const updateElement = createAction<T>(`${sliceName}/updateElement`);
	const clearErrors = createAction(`${sliceName}/clearErrors`);
	const deleteElement = createAction<string>(`${sliceName}/deleteElement`);
	const clearAll = createAction(`${sliceName}/clearAll`);
	const setError = createAction<IError>(`${sliceName}/setError`);

	const slice = createSlice({
		name: sliceName,
		initialState,
		reducers: {
			updateElement: (state: Draft<IEntityStore<T>>, action: PayloadAction<T>) => {
				const id: string = action.payload._id as string;
				state.data[id] = {
					...state.data[id],
					...action.payload,
				};
			},
			clearErrors: (state: Draft<IEntityStore<T>>) => {
				state.error = undefined;
			},
			deleteElement: (state: Draft<IEntityStore<T>>, action: PayloadAction<string>) => {
				delete state.data[action.payload];
			},
			clearAll: () => {
				return initialState;
			},
			setError: (state: Draft<IEntityStore<T>>, action: PayloadAction<IError>) => {
				state.error = action.payload;
			},
		},
		extraReducers: createExtraReducers<T>(entityName),
	});

	const actions = {
		updateElement,
		clearErrors,
		deleteElement,
		clearAll,
		setError,
	};

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