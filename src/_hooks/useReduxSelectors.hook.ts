import { IError } from '@/interfaces/auth.interface.ts';
import { useSelector } from 'react-redux';
import { TAppState } from '@/store/_store.ts';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { selectMe, selectMeError } from '@/store/me.slice.ts';
import { IDepartment, IDepartmentObject } from '@/interfaces/department.interface.ts';
import {
	selectAllDepartmentsArray,
	selectAllDepartmentsObject,
	selectDepartmentsError,
} from '@/store/departments.slice.ts';
import { selectAllUsersObject, selectUsersError } from '@/store/users.slice.ts';
import { selectOnlineUsers, selectOnlineUsersError } from '@/store/usersOnline.slice.ts';
import { ICurrentStates } from '@/interfaces/currentStates.interface.ts';
import { selectCurrentStates } from '@/store/_currentStates.slice.ts';
import { ITypeOfWork, ITypeOfWorkObject } from '@/interfaces/worktype.interface.ts';
import {
	selectAllTypesOfWorkArray,
	selectAllTypesOfWorkObject,
	selectTypesOfWorkError,
} from '@/store/typesOfWork.slice.ts';

export const useReduxSelectors = () => {

	const me = useSelector<TAppState, IUserUpdate>((state) => selectMe(state));
	const meError = useSelector<TAppState, IError | null | undefined>((state) => selectMeError(state));

	const departmentsObject = useSelector<TAppState, IDepartmentObject>((state) => selectAllDepartmentsObject(state));
	const departmentsArray = useSelector<TAppState, IDepartment[]>((state) => selectAllDepartmentsArray(state));
	const departmentsError = useSelector<TAppState, IError | null | undefined>((state) => selectDepartmentsError(state));

	const users = useSelector<TAppState, IUserObject>((state) => selectAllUsersObject(state));
	const usersError = useSelector<TAppState, IError | null | undefined>((state) => selectUsersError(state));

	const onlineUsers = useSelector<TAppState, string[]>((state) => selectOnlineUsers(state));
	const onlineUsersError = useSelector<TAppState, IError | null | undefined>((state) => selectOnlineUsersError(state));

	const states = useSelector<TAppState, ICurrentStates>((state) => selectCurrentStates(state));

	const typesOfWorkObject = useSelector<TAppState, ITypeOfWorkObject>((state) => selectAllTypesOfWorkObject(state));
	const typesOfWorkArray = useSelector<TAppState, ITypeOfWork[]>((state) => selectAllTypesOfWorkArray(state));
	const typesOfWorkError = useSelector<TAppState, IError | null | undefined>((state) => selectTypesOfWorkError(state));


	return {
		me,
		meError,

		departmentsObject,
		departmentsArray,
		departmentsError,

		users,
		usersError,

		onlineUsers,
		onlineUsersError,

		states,

		typesOfWorkObject,
		typesOfWorkArray,
		typesOfWorkError,
	};
};