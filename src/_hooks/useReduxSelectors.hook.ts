import { IError } from '@/interfaces/auth.interface.ts';
import { useSelector } from 'react-redux';
import {
	departments,
	firms, flashes, invites,
	modifications,
	TAppState,
	typesOfWork,
	users,
	workflows,
} from '@/store/_store.ts';
import { IUser, IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { selectMe, selectMeError } from '@/store/me.slice.ts';
import { IDepartment, IDepartmentsObject } from '@/interfaces/department.interface.ts';
import { ICurrentStates } from '@/interfaces/currentStates.interface.ts';
import { selectCurrentStates } from '@/store/_currentStates.slice.ts';
import { ITypeOfWork, ITypesOfWorkObject } from '@/interfaces/worktype.interface.ts';
import { IModification, IModificationsObject } from '@/interfaces/modification.interface.ts';
import { IFirm, IFirmsObject } from '@/interfaces/firm.interface.ts';
import { IWorkflow, IWorkflowsObject } from '@/interfaces/workflow.interface.ts';
import { selectOnlineUsers, selectOnlineUsersError } from '@/store/usersOnline.slice.ts';
import { IFlashMessagesObject } from '@/interfaces/flashMessage.interface.ts';
import { IInviteToJoinObject } from '@/interfaces/inviteToJoin.interface.ts';

export const useReduxSelectors = () => {

	const me = useSelector<TAppState, IUserUpdate>((state) => selectMe(state));
	const meError = useSelector<TAppState, IError | null | undefined>((state) => selectMeError(state));

	const states = useSelector<TAppState, ICurrentStates>((state) => selectCurrentStates(state));

	const departmentsObject = useSelector<TAppState, IDepartmentsObject>((state) => departments.selectors.selectAllObject(state));
	const departmentsArray = useSelector<TAppState, IDepartment[]>((state) => departments.selectors.selectAllArray(state));
	const departmentsError = useSelector<TAppState, IError | null | undefined>((state) => departments.selectors.selectError(state));


	const firmsObject = useSelector<TAppState, IFirmsObject>((state) => firms.selectors.selectAllObject(state));
	const firmsArray = useSelector<TAppState, IFirm[]>((state) => firms.selectors.selectAllArray(state));
	const firmsError = useSelector<TAppState, IError | null | undefined>((state) => firms.selectors.selectError(state));

	const modificationsObject = useSelector<TAppState, IModificationsObject>((state) => modifications.selectors.selectAllObject(state));
	const modificationsArray = useSelector<TAppState, IModification[]>((state) => modifications.selectors.selectAllArray(state));
	const modificationsError = useSelector<TAppState, IError | null | undefined>((state) => modifications.selectors.selectError(state));

	const usersObject = useSelector<TAppState, IUserObject>((state) => users.selectors.selectAllObject(state));
	const usersArray = useSelector<TAppState, IUser[]>((state) => users.selectors.selectAllArray(state));
	const usersError = useSelector<TAppState, IError | null | undefined>((state) => users.selectors.selectError(state));

	const onlineUsers = useSelector<TAppState, string[]>((state) => selectOnlineUsers(state));
	const onlineUsersError = useSelector<TAppState, IError | null | undefined>((state) => selectOnlineUsersError(state));


	const typesOfWorkObject = useSelector<TAppState, ITypesOfWorkObject>((state) => typesOfWork.selectors.selectAllObject(state));
	const typesOfWorkArray = useSelector<TAppState, ITypeOfWork[]>((state) => typesOfWork.selectors.selectAllArray(state));
	const typesOfWorkError = useSelector<TAppState, IError | null | undefined>((state) => typesOfWork.selectors.selectError(state));

	const workflowsObject = useSelector<TAppState, IWorkflowsObject>((state) => workflows.selectors.selectAllObject(state));
	const workflowsArray = useSelector<TAppState, IWorkflow[]>((state) => workflows.selectors.selectAllArray(state));
	const workflowsError = useSelector<TAppState, IError | null | undefined>((state) => workflows.selectors.selectError(state));

	const flashMessages = useSelector<TAppState, IFlashMessagesObject>((state) => flashes.selectors.selectAllArray(state));
	const flashMessagesError = useSelector<TAppState, IError | null | undefined>((state) => flashes.selectors.selectError(state));

	const inviteToJoin = useSelector<TAppState, IInviteToJoinObject>((state) => invites.selectors.selectAllArray(state));
	const inviteToJoinError = useSelector<TAppState, IError | null | undefined>((state) => invites.selectors.selectError(state));


	return {
		me,
		meError,

		states,

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


		typesOfWorkObject,
		typesOfWorkArray,
		typesOfWorkError,

		workflowsObject,
		workflowsArray,
		workflowsError,

		flashMessages,
		flashMessagesError,

		inviteToJoin,
		inviteToJoinError,
	};
};