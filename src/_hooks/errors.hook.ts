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

	useEffect(() => {
		const messages = errors.filter(Boolean).map(error => (error as IError).message);
		if (messages.length > 0) {
			setTimeout(() => {
				console.log('запускаем очистку ошибок');
				dispatch(clearDepartmentsError());
				dispatch(clearUsersError());
				dispatch(clearTypesOfWorkError());
				dispatch(clearModificationsError());
				dispatch(clearFirmsError());
				console.log('очистили');
			}, 5000);
		}
		setAnyError(messages.join('\n'));
	}, [departmentsError, usersError, onlineUsersError, typesOfWorkError, modificationsError,
		firmsError]);
	return { anyError };
};