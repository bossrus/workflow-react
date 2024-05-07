import { Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authLoad, load, patchOne } from '@/store/_shared.thunks.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { Alert, Box, Snackbar } from '@mui/material';
import routes from '@/routes/route.ts';
import { Link, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { getAuth } from '@/_security/auth.ts';
import { useWebSocket } from '@/components/app/websocket/websocket.hook.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import AppHeaderComponent from '@/components/app/appHeader.component.tsx';
import { clearMe } from '@/store/me.slice.ts';
import { useErrors } from '@/_hooks/errors.hook.ts';
import InvitesAppComponent from '@/components/app/invites.app.component.tsx';
import { setState } from '@/store/_currentStates.slice.ts';
import SecurityFlashAppComponent from '@/components/app/flashes.app.component.tsx';
import useWorksSelectorsHook from '@/_hooks/useWorksSelectors.hook.ts';

function App() {

	const navigate = useNavigate();

	const location = useLocation().pathname;
	// console.log('location = ', location); // путь текущего маршрута

	const [oldMeLength, setOldMeLength] = useState(0);


	const {
		departmentsObject: departments,
		me,
		meError,
		usersObject: users,
		onlineUsers,
		inviteToJoin,
		states,
	} = useReduxSelectors();

	const {
		workflowsInMyDepartment,
	} = useWorksSelectorsHook();

	const { anyError } = useErrors();

	const [meEmailError, setMeEmailError] = useState('');

	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {
		if (location != '/login') {
			const auth = getAuth();
			if (!auth)
				navigate('/login');
			else {
				// console.log('\tполучили какую-то авторизацию. моя длина = ', Object.keys(me).length);
				if (Object.keys(me).length === 0) {
					// console.log('\tвключаем получение по танку');
					dispatch(authLoad());
				}
			}

		}
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
		// console.log('ошибка в получении меня', meError);
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
		console.log('сменился me. oldMeLength = ', oldMeLength, 'me:', me);
		if (Object.keys(me).length > 0 && oldMeLength === 0) {
			setOldMeLength(Object.keys(me).length);
			dispatch(load({ url: 'departments' }));
			dispatch(load({ url: 'firms' }));
			dispatch(load({ url: 'modifications' }));
			dispatch(load({ url: 'users' }));
			dispatch(load({ url: 'users' }));
			dispatch(load({ url: 'typesOfWork' }));
			dispatch(load({ url: 'workflows' }));
			dispatch(load({ url: 'invites' }));
			dispatch(load({ url: 'flashes' }));
		}
	}, [dispatch, me]);

	const { isConnected, socket } = useWebSocket({ oldMeLength, me, users });

	const connectToWebsocket = () => {
		// console.log('мы коннект к вебсокету');
		if (socket)
			(socket as Socket).connect();
	};

	const testSocket = () => {
		console.log('использована кнопка разъединения сокета', socket?.connected);
		if (socket?.connected) socket.disconnect();
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

	const socketRef = useRef(socket);
	useEffect(() => {
		socketRef.current = socket;
	}, [socket]);

	const workflowsInMyDepartmentCountRef = useRef(workflowsInMyDepartment.length);
	useEffect(() => {
		workflowsInMyDepartmentCountRef.current = workflowsInMyDepartment.length;
	}, [workflowsInMyDepartment]);

	const checkSocketAndQueueStatus = () => {
		console.log('функция вызвана');

		//если нет коннекта — то коннектим
		if (socketRef.current) {
			if (!socketRef.current.connected) {
				socketRef.current.connect();
			}
		}

		//если есть работа, то звучим
		console.log('работ в отделе = ', workflowsInMyDepartmentCountRef.current);
		if (me && workflowsInMyDepartmentCountRef.current > 0 && !me.currentWorkflowInWork) {
			console.log('workflowsInMyDepartment.length = ', workflowsInMyDepartmentCountRef.current, 'но звук я запускаю!');
			const audio = new Audio('/sounds/works_in.mp3');
			audio.play()
				.catch(() => {
					dispatch(setState({
						flashMessage: 'dontPlaySound',
					}));
				});
		}
		setTimeout(() => checkSocketAndQueueStatus(), 1 * 10 * 1000);
	};

	useEffect(() => {
		checkSocketAndQueueStatus();
	}, []);

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
										\ <Link to={'/main/'}> main </Link> \
										\ <Link to={'/stat/'}> Статистика </Link> \
										\ <span onClick={() => testSocket()}> Отключить сокет </span> \
									</>)
								}
							</Box>
							{
								Object.keys(inviteToJoin).length > 0 &&
								<InvitesAppComponent />
							}
							{
								states.flashMessage == 'dontPlaySound' &&
								<SecurityFlashAppComponent />
							}
						</Box>
					}
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
