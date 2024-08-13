import { Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authLoad, load, patchOne } from '@/store/_shared.thunks.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { Alert, Box, Snackbar } from '@mui/material';
import routes from '@/routes/route.ts';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { getAuth } from '@/_security/auth.ts';
import { useWebSocket } from '@/components/app/websocket/websocket.hook.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import AppHeaderComponent from '@/components/app/appHeader.component.tsx';
import { clearMe } from '@/store/me.slice.ts';
import { useErrors } from '@/_hooks/errors.hook.ts';
import InvitesAppComponent from '@/components/app/invites.app.component.tsx';
import { setState } from '@/store/_currentStates.slice.ts';
import SecurityFlashAppComponent from '@/components/app/securityFlash.app.component.tsx';
import useWorksSelectorsHook from '@/_hooks/useWorksSelectors.hook.ts';
import AppFooterComponent from '@/components/app/appFooter/appFooter.component.tsx';
import DeleteFlashAppComponent from '@/components/app/deleteFlash.app.component.tsx';

function App() {

	const navigate = useNavigate();

	const location = useLocation().pathname;

	const [oldMeLength, setOldMeLength] = useState(0);


	const {
		departmentsObject,
		me,
		meError,
		usersObject,
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

	const timers = useRef<{ [key: string]: number }>({});

	const authOrLogin = () => {
		if (location === '/login') return;

		const auth = getAuth();
		if (!auth || meError) {
			logout();
			return;
		}

		if (Object.keys(me).length === 0) {
			dispatch(authLoad());
		}
	};

	useEffect(() => {
		authOrLogin();

		if (location === '/settings/error') {
			setMeEmailError('Неверная ссылка подтверждения почты.<br/>Нажмите кнопку "Выслать повторное письмо со ссылкой" и перейдите по ссылке из нового письма');
			timers.current['clearError'] = setTimeout(() => {
				navigate('/settings');
			}, 5000);
		} else {
			setMeEmailError('');
		}
	}, [location, meError]);

	const logout = () => {
		dispatch(clearMe());
		navigate('/login');
	};

	const routePage = useRoutes(routes);

	useEffect(() => {
		if (Object.keys(me).length > 0 && oldMeLength === 0) {
			setOldMeLength(Object.keys(me).length);
			dispatch(load({ url: 'departments' }));
			dispatch(load({ url: 'firms' }));
			dispatch(load({ url: 'modifications' }));
			dispatch(load({ url: 'users' }));
			dispatch(load({ url: 'typesOfWork' }));
			dispatch(load({ url: 'workflows' }));
			dispatch(load({ url: 'invites' }));
			dispatch(load({ url: 'flashes' }));
		}
	}, [dispatch, me]);

	const { isConnected, socket } = useWebSocket({ oldMeLength, me, users: usersObject });

	const connectToWebsocket = () => {
		if (socket && !socket?.connected) {
			console.log('вебсокет пытаемсо законнектиццо');
			(socket as Socket).connect();
		}
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

	const workQueueNotificationSound = new Audio('/sounds/works_in.mp3');
	const silentSound = new Audio('/sounds/silents.mp3');

	const checkSocketAndQueueStatus = () => {
		if (socketRef.current) {
			if (!socketRef.current.connected) {
				socketRef.current.connect();
			}
		}
		//если есть работа, то звучим
		if (meRef.current && workflowsInMyDepartmentCountRef.current > 0 && !meRef.current.currentWorkflowInWork && meRef.current.isSoundOn) {
			workQueueNotificationSound.play()
				.catch(() => {
					dispatch(setState({
						flashMessage: 'dontPlaySound',
					}));
				});
		}
		timers.current['checkStatuses'] = setTimeout(() => checkSocketAndQueueStatus(), 5 * 60 * 1000);
	};

	const meRef = useRef(me);
	useEffect(() => {
		meRef.current = me;
		if (me && me.isSoundOn) {
			//пустой звук для определения запрета от политики автозапуска
			silentSound.play()
				.catch(() => {
					dispatch(setState({
						flashMessage: 'dontPlaySound',
					}));
				});
		}
	}, [me]);

	useEffect(() => {
		checkSocketAndQueueStatus();
		return () => {
			console.log('очистка таймеров...');
			Object.values(timers.current).forEach(timer => clearTimeout(timer));
		};
	}, []);

	const canShow = (): boolean => {
		return Object.keys(me).length > 0
			&& Object.keys(usersObject).length > 0
			&& Object.keys(departmentsObject).length > 0;
	};

	return (
		<>
			{location != '/login' ?
				(<>
					{canShow() &&
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
								users={usersObject}
								departments={departmentsObject}
								me={me}
								isConnected={isConnected}
								connectToWebsocket={connectToWebsocket}
								onlineUsers={onlineUsers}
							/>
							<Box flexGrow={1}>
								{routePage}
								{
									Object.keys(inviteToJoin).length > 0 &&
									<InvitesAppComponent />
								}
								{
									states.flashMessage == 'dontPlaySound' &&
									<SecurityFlashAppComponent />
								}
								{
									states.flashMessage == 'delete' &&
									<DeleteFlashAppComponent message={states.deleteMessage} />
								}
							</Box>
							<Box mt={'20px'}>
								{location != '/login' &&
									<AppFooterComponent />
								}
							</Box>
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
