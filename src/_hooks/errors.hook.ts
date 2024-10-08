import { useEffect, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useDispatch } from 'react-redux';
import { departments, firms, modifications, TAppDispatch, typesOfWork, users, workflows } from '@/store/_store.ts';
import { IError } from '@/interfaces/auth.interface.ts';
import { useNavigate } from 'react-router-dom';
import { clearMe } from '@/store/me.slice.ts';

export const useErrors = () => {
	const [anyError, setAnyError] = useState<string>('');

	const {
		departmentsError,
		usersError,
		onlineUsersError,
		typesOfWorkError,
		modificationsError,
		firmsError,
		workflowsError,
	} = useReduxSelectors();

	const errors = [departmentsError, usersError, onlineUsersError, typesOfWorkError, modificationsError,
		firmsError, workflowsError];

	const dispatch = useDispatch<TAppDispatch>();
	const navigate = useNavigate();

	let hasForbiddenError = false;

	useEffect(() => {
		const messages = errors.filter(Boolean).map(error => {
			if ((error as IError).status === 403) {
				hasForbiddenError = true;
				dispatch(clearMe());
			}
			return (error as IError).message;
		});
		if (messages.length > 0) {
			setTimeout(() => {
				clearErrors(dispatch);
			}, 5000);
		}


		setAnyError(messages.join('\n'));

		if (hasForbiddenError) {
			navigate('/login');
		}

	}, [departmentsError, usersError, onlineUsersError, typesOfWorkError, modificationsError,
		firmsError, workflowsError]);
	return { anyError };
};

export const clearErrors = (dispatch: TAppDispatch) => {
	dispatch(departments.actions.clearErrors());
	dispatch(users.actions.clearErrors());
	dispatch(typesOfWork.actions.clearErrors());
	dispatch(modifications.actions.clearErrors());
	dispatch(firms.actions.clearErrors());
	dispatch(workflows.actions.clearErrors());
};