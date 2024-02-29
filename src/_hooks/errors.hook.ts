import { useEffect, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IError } from '@/interfaces/auth.interface.ts';
import { clearDepartmentsError } from '@/store/departments.slice.ts';
import { clearUsersError } from '@/store/users.slice.ts';
import { clearTypesOfWorkError } from '@/store/typesOfWork.slice.ts';
import { clearModificationsError } from '@/store/modifications.slice.ts';
import { clearFirmsError } from '@/store/firms.slice.ts';
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
	} = useReduxSelectors();

	const errors = [departmentsError, usersError, onlineUsersError, typesOfWorkError, modificationsError,
		firmsError];

	const dispatch = useDispatch<TAppDispatch>();
	const navigate = useNavigate();

	let hasForbiddenError = false;

	useEffect(() => {
		const messages = errors.filter(Boolean).map(error => {
			console.log('проверяем статус ошибки:', (error as IError).status);
			if ((error as IError).status === 403) {
				console.log('найдена ошибка 403');
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
			console.log('перехожу?');
			navigate('/login');
		}

	}, [departmentsError, usersError, onlineUsersError, typesOfWorkError, modificationsError,
		firmsError]);
	return { anyError };
};

export const clearErrors = (dispatch: TAppDispatch) => {
	console.log('запускаем очистку ошибок');
	dispatch(clearDepartmentsError());
	dispatch(clearUsersError());
	dispatch(clearTypesOfWorkError());
	dispatch(clearModificationsError());
	dispatch(clearFirmsError());
	console.log('очистили');
};