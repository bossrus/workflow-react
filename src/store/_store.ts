//src/store/_store.ts
import { configureStore } from '@reduxjs/toolkit';
import { departmentsReducer } from '@/store/departments.slice.ts';
import { firmsReducer } from '@/store/firms.slice.ts';
import { usersReducer } from '@/store/users.slice.ts';
import { meReducer } from '@/store/me.slice.ts';
import { usersOnlineReducer } from '@/store/usersOnline.slice.ts';
import { typesOfWorksReducer } from '@/store/typesOfWork.slice.ts';
import { modificationsReducer } from '@/store/modifications.slice.ts';
import { currentStatesReducer } from '@/store/_currentStates.slice.ts';
import { workflowsReducer } from '@/store/workflows.slice.ts';


export const myStore = configureStore({
	reducer: {
		departments: departmentsReducer,
		firms: firmsReducer,
		modifications: modificationsReducer,
		users: usersReducer,
		usersOnline: usersOnlineReducer,
		me: meReducer,
		typesOfWork: typesOfWorksReducer,
		currentStates: currentStatesReducer,
		workflows: workflowsReducer,
	},
});

export type TAppState = ReturnType<typeof myStore.getState>;

export type TAppDispatch = typeof myStore.dispatch;
