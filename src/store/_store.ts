// src/store/_store.ts
import { configureStore } from '@reduxjs/toolkit';
import { createEntitySlice } from '@/store/_sliceFactory.ts';
import { meReducer } from '@/store/me.slice.ts';
import { currentStatesReducer } from '@/store/_currentStates.slice.ts';
import { usersOnlineReducer } from '@/store/usersOnline.slice.ts';


//уточнять названия в //src/interfaces/api.interface.ts
export const departments = createEntitySlice('departments');
export const firms = createEntitySlice('firms');
export const users = createEntitySlice('users');
export const typesOfWork = createEntitySlice('typesOfWork');
export const modifications = createEntitySlice('modifications');
export const workflows = createEntitySlice('workflows');
export const flashes = createEntitySlice('flashes');
export const invites = createEntitySlice('invites');


export const myStore = configureStore({
	reducer: {
		departments: departments.reducer,
		firms: firms.reducer,
		modifications: modifications.reducer,
		users: users.reducer,
		usersOnline: usersOnlineReducer,
		me: meReducer,
		typesOfWork: typesOfWork.reducer,
		currentStates: currentStatesReducer,
		workflows: workflows.reducer,
		flashes: flashes.reducer,
		invites: invites.reducer,
	},
});

export type TAppState = ReturnType<typeof myStore.getState>;
export type TAppDispatch = typeof myStore.dispatch;
