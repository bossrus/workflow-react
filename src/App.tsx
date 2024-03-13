import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authLoad, load, patchOne } from '@/store/_shared.thunks.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { Alert, Box, Snackbar } from '@mui/material';
import routes from '@/routes/route.ts';
import { Link, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { getAuth } from '@/_security/auth.ts';
import { IAuthInterface } from '@/interfaces/auth.interface.ts';
import { useWebSocket } from '@/components/app/websocket/websocket.hook.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import AppHeaderComponent from '@/components/app/appHeader.component.tsx';
import { clearMe } from '@/store/me.slice.ts';
import { useErrors } from '@/_hooks/errors.hook.ts';

function App() {

	const navigate = useNavigate();

	const location = useLocation().pathname;
	console.log('location = ', location); // путь текущего маршрута

	const [auth, setAuth] = useState<IAuthInterface | null>(null);


	const {
		departmentsObject: departments,
		me,
		meError,
		usersObject: users,
		onlineUsers,
	} = useReduxSelectors();

	const { anyError } = useErrors();

	const [meEmailError, setMeEmailError] = useState('');

	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {
		if (location != '/login')
			(async () => {
				const localAuth = await getAuth();
				console.log('авторизация = ', localAuth);

				setAuth(localAuth);
				if (!localAuth)
					navigate('/login');
				else {
					console.log('\tполучили какую-то авторизацию. моя длина = ', Object.keys(me).length);
					if (Object.keys(me).length === 0) {
						console.log('\tвключаем получение по танку');
						dispatch(authLoad());
					}
				}

			})();
		if (location == '/settings/error') {
			setMeEmailError('Неверная ссылка подтверждения почты.<br/>Нажмите кнопку "Выслать повторное письмо со ссылкой" и перейдите по ссылке из нового письма');
			setTimeout(() => {
				navigate('/settings');
			}, 5000);
		} else {
			setMeEmailError('');
		}
	}, [location]);

	useEffect(() => {
		console.log('ошибка в получении меня', meError);
		if (location != '/login')
			if (meError)
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
			dispatch(load({ url: 'users' }));
			dispatch(load({ url: 'typesOfWork' }));
			dispatch(load({ url: 'workflows' }));
		}
	}, [dispatch, me]);

	const { isConnected, socket } = useWebSocket({ auth, me, users });

	const connectToWebsocket = () => {
		console.log('мы коннект к вебсокету');
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
				(<>
					{Object.keys(me).length > 0 &&
						<Box display="flex" flexDirection="column" height="100%">
							<Snackbar
								anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
								open={anyError !== '' || meEmailError !== ''}
								sx={{ verticalAlign: 'center' }}
							>
								<Alert
									severity="warning"
									variant="filled"
									sx={{
										fontSize: '13px',
										width: '100%',
										alignContent: 'center',
										verticalAlign: 'center',
									}}
								>
									{anyError}
									{meEmailError.split('<br/>').map((item, i) => <p key={i}>{item}</p>)}
								</Alert>
							</Snackbar>
							<AppHeaderComponent
								changeMyDepartment={changeMyDepartment}
								changeSounds={changeSounds}
								logout={logout}
								users={users}
								departments={departments}
								me={me}
								isConnected={isConnected}
								connectToWebsocket={connectToWebsocket}
								onlineUsers={onlineUsers}
							/>
							<Box flexGrow={1}>
								{routePage}
							</Box>
							<Box mt={'20px'}>
								{location != '/login' &&
									(<>
										\ <Link to={'/settings'}>Настройки</Link> \
										\ <Link to={'/main/create'}> Создать новый заказ</Link> \
										\ <Link to={'/main/my-department'}> Элемент в моём отделе </Link> \

										\ Статистика
										\</>)
								}
							</Box>
						</Box>}
				</>)
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
