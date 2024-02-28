import { IError } from '@/interfaces/auth.interface.ts';
import { useSelector } from 'react-redux';
import { TAppState } from '@/store/_store.ts';
import { IUser, IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { selectMe, selectMeError } from '@/store/me.slice.ts';
import { IDepartment, IDepartmentsObject } from '@/interfaces/department.interface.ts';
import {
	selectAllDepartmentsArray,
	selectAllDepartmentsObject,
	selectDepartmentsError,
} from '@/store/departments.slice.ts';
import { selectAllUsersArray, selectAllUsersObject, selectUsersError } from '@/store/users.slice.ts';
import { selectOnlineUsers, selectOnlineUsersError } from '@/store/usersOnline.slice.ts';
import { ICurrentStates } from '@/interfaces/currentStates.interface.ts';
import { selectCurrentStates } from '@/store/_currentStates.slice.ts';
import { ITypeOfWork, ITypeOfWorkObject } from '@/interfaces/worktype.interface.ts';
import {
	selectAllTypesOfWorkArray,
	selectAllTypesOfWorkObject,
	selectTypesOfWorkError,
} from '@/store/typesOfWork.slice.ts';
import { IModification, IModificationsObject } from '@/interfaces/modification.interface.ts';
import {
	selectAllModificationsArray,
	selectAllModificationsObject,
	selectModificationsError,
} from '@/store/modifications.slice.ts';
import { IFirm, IFirmsObject } from '@/interfaces/firm.interface.ts';
import { selectAllFirmsArray, selectAllFirmsObject, selectFirmsError } from '@/store/firms.slice.ts';

export const useReduxSelectors = () => {

	const me = useSelector<TAppState, IUserUpdate>((state) => selectMe(state));
	const meError = useSelector<TAppState, IError | null | undefined>((state) => selectMeError(state));

	const departmentsObject = useSelector<TAppState, IDepartmentsObject>((state) => selectAllDepartmentsObject(state));
	const departmentsArray = useSelector<TAppState, IDepartment[]>((state) => selectAllDepartmentsArray(state));
	const departmentsError = useSelector<TAppState, IError | null | undefined>((state) => selectDepartmentsError(state));

	const firmsObject = useSelector<TAppState, IFirmsObject>((state) => selectAllFirmsObject(state));
	const firmsArray = useSelector<TAppState, IFirm[]>((state) => selectAllFirmsArray(state));
	const firmsError = useSelector<TAppState, IError | null | undefined>((state) => selectFirmsError(state));

	const modificationsObject = useSelector<TAppState, IModificationsObject>((state) => selectAllModificationsObject(state)) as IModificationsObject;
	const modificationsArray = useSelector<TAppState, IModification[]>((state) => selectAllModificationsArray(state));
	const modificationsError = useSelector<TAppState, IError | null | undefined>((state) => selectModificationsError(state));

	const usersObject = useSelector<TAppState, IUserObject>((state) => selectAllUsersObject(state));
	const usersArray = useSelector<TAppState, IUser[]>((state) => selectAllUsersArray(state));
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

		modificationsObject,
		modificationsArray,
		modificationsError,

		firmsObject,
		firmsArray,
		firmsError,

		usersArray,
		usersObject,
		usersError,

		onlineUsers,
		onlineUsersError,

		states,

		typesOfWorkObject,
		typesOfWorkArray,
		typesOfWorkError,
	};
};