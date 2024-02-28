import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authLoad, load, patchOne } from '@/store/_api.slice.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { Alert, Box, Snackbar } from '@mui/material';
import routes from '@/routes/route.ts';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { getAuth } from '@/_security/auth.ts';
import { IAuthInterface, IError } from '@/interfaces/auth.interface.ts';
import { useWebSocket } from '@/components/app/websocket.hook.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import AppHeaderComponent from '@/components/app/appHeader.component.tsx';
import { clearMe } from '@/store/me.slice.ts';
import { clearDepartmentsError } from '@/store/departments.slice.ts';
import { clearUsersError } from '@/store/users.slice.ts';
import { clearTypesOfWorkError } from '@/store/typesOfWork.slice.ts';

function App() {

	const navigate = useNavigate();

	const location = useLocation().pathname;
	console.log('location = ', location); // путь текущего маршрута

	const [auth, setAuth] = useState<IAuthInterface | null>(null);


	const [anyError, setAnyError] = useState<string>('');
	const { me, meError, departmentsObject, users, onlineUsers } = useReduxSelectors();

	const {
		departmentsError,
		usersError,
		onlineUsersError,
		typesOfWorkError,
	} = useReduxSelectors();

	const errors = [departmentsError, usersError, onlineUsersError, typesOfWorkError];

	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {
		const messages = errors.filter(Boolean).map(error => (error as IError).message);
		if (messages.length > 0) {
			setTimeout(() => {
				console.log('запускаем очистку ошибок');
				dispatch(clearDepartmentsError());
				dispatch(clearUsersError());
				dispatch(clearTypesOfWorkError());
				console.log('очистили');
			}, 5000);
		}
		setAnyError(messages.join('\n'));
	}, [departmentsError, usersError, onlineUsersError, typesOfWorkError]);


	useEffect(() => {
		if (location != '/login')
			(async () => {
				const localAuth = await getAuth();
				setAuth(localAuth);
				if (!localAuth)
					navigate('/login');
				else {
					if (Object.keys(me).length === 0) {
						dispatch(authLoad());
					}
				}

			})();
	}, [location]);

	useEffect(() => {
		if (location != '/login')
			if (meError && meError.status == 403)
				navigate('/login');
	}, [location, meError]);

	const logout = () => {
		dispatch(clearMe());
		navigate('/login');
	};


	const routePage = useRoutes(routes);

	useEffect(() => {
		if (Object.keys(me).length > 0) {
			dispatch(load({ url: 'departments' }));
			dispatch(load({ url: 'firms' }));
			dispatch(load({ url: 'modifications' }));
			dispatch(load({ url: 'users' }));
			dispatch(load({ url: 'typesOfWork' }));
		}
	}, [dispatch, me]);

	const { isConnected, socket } = useWebSocket(auth, me, users);

	const connectToWebsocket = () => {
		console.log('мы коннект');
		if (socket)
			(socket as Socket).connect();
	};


	const changeSounds = (isSoundProps: boolean) => {
		dispatch(patchOne({
			url: 'users/me',
			data: {
				_id: me._id,
				isSoundOn: isSoundProps,
			},
		}));
	};

	const changeMyDepartment = (newVal: string | null) => {
		if (newVal && me.currentDepartment != newVal)
			dispatch(patchOne({
				url: 'users/me',
				data: {
					_id: me._id,
					currentDepartment: newVal,
				},
			}));
	};

	return (
		<>
			{location != '/login' ?
				(
					<Box display="flex" flexDirection="column" height="100%">
						<Snackbar
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
							open={anyError !== ''}
							sx={{ verticalAlign: 'center' }}
						>
							<Alert
								severity="warning"
								variant="filled"
								sx={{ width: '100%', alignContent: 'center', verticalAlign: 'center' }}
							>
								{anyError}
							</Alert>
						</Snackbar>
						<AppHeaderComponent
							changeMyDepartment={changeMyDepartment}
							changeSounds={changeSounds}
							logout={logout}
							users={users}
							departments={departmentsObject}
							me={me}
							isConnected={isConnected}
							connectToWebsocket={connectToWebsocket}
							onlineUsers={onlineUsers}
						/>
						<Box flexGrow={1}>
							{routePage}
						</Box>
						<Box bgcolor="lightcoral" mt={'20px'}>
							{location != '/login' &&
								(<>\ Панель управления \ \ Создать новый заказ \ \ Статистика \</>)}
						</Box>
					</Box>
				)
				: (
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						style={{ height: '100%' }}
						flexGrow={1}
					>
						{routePage}
					</Box>
				)}
		</>
	);
}

export default App;
