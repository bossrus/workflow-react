import { IError } from '@/interfaces/auth.interface.ts';
import { useSelector } from 'react-redux';
import { TAppState } from '@/store/_store.ts';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { selectMe, selectMeError } from '@/store/me.slice.ts';
import { IDepartment, IDepartmentObject } from '@/interfaces/department.interface.ts';
import { selectAllDepartmentsArray, selectAllDepartmentsObject } from '@/store/departments.slice.ts';
import { selectAllUsersObject } from '@/store/users.slice.ts';
import { selectOnlineUsers } from '@/store/usersOnline.slice.ts';
import { ICurrentStates } from '@/interfaces/currentStates.interface.ts';
import { selectCurrentStates } from '@/store/_currentStates.slice.ts';

export const useReduxSelectors = () => {

	const me = useSelector<TAppState, IUserUpdate>((state) => selectMe(state));
	const meError = useSelector<TAppState, IError | null | undefined>((state) => selectMeError(state));
	const departmentsObject = useSelector<TAppState, IDepartmentObject>((state) => selectAllDepartmentsObject(state));
	const departmentsArray = useSelector<TAppState, IDepartment[]>((state) => selectAllDepartmentsArray(state));
	const users = useSelector<TAppState, IUserObject>((state) => selectAllUsersObject(state));
	const onlineUsers = useSelector<TAppState, string[]>((state) => selectOnlineUsers(state));
	const states = useSelector<TAppState, ICurrentStates>((state) => selectCurrentStates(state));


	return { me, meError, departmentsObject, users, onlineUsers, states, departmentsArray };
};