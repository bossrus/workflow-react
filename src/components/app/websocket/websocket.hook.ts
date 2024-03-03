import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { loadById } from '@/store/_api.slice.ts';
import { DEFAULT_WEBSOCKET_URL } from '@/_constants/api.ts';
import { IAuthInterface } from '@/interfaces/auth.interface.ts';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import {
	departments,
	firms,
	modifications,
	TAppDispatch,
	typesOfWork,
	users as usersStore,
	workflows,
} from '@/store/_store.ts';
import { setOnline } from '@/store/usersOnline.slice.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { IWebsocket } from '@/interfaces/websocket.interface.ts';

interface IProps {
	auth: IAuthInterface | null;
	users: IUserObject;
	me: IUserUpdate;
}

export const useWebSocket = ({ auth, me, users }: IProps) => {
	const [isConnected, setIsConnected] = useState(false);
	const dispatch = useDispatch<TAppDispatch>();

	const {
		modificationsObject,
		firmsObject,
		typesOfWorkObject,
		departmentsObject,
		workflowsObject,
	} = useReduxSelectors();

	console.log('websocket users = ', users);

	const deletes = {
		'workflows': workflows.actions.deleteElement,
		'users': usersStore.actions.deleteElement,
		'departments': departments.actions.deleteElement,
		'firms': firms.actions.deleteElement,
		'modifications': modifications.actions.deleteElement,
		'typesOfWork': typesOfWork.actions.deleteElement,
	};


	let socket: Socket | null = null;

	const workWithUsers = (id: string, version: number, operation: string) => {
		console.log('\t\t\twebsocket работает с юзером');
		console.log('id => ', id);
		if (!users[id] || users[id].version !== version) {
			dispatch(loadById({ url: 'users', id }));
		}
		if (id == me._id && me.version !== version) {
			dispatch(loadById({ url: 'users/me', id }));
		}
		if (operation === 'delete' && users[id]) dispatch(usersStore.actions.deleteElement(id));
	};

	const workWithOther = ({ bd, operation, id, version }: IWebsocket) => {
		if (bd == 'websocket') {
			dispatch(setOnline(JSON.parse(id)));
		} else {
			switch (operation) {
				case 'update':
					if ((bd == 'departments' && (!departmentsObject[id] || departmentsObject[id].version != version))
						|| (bd == 'firms' && (!firmsObject[id] || firmsObject[id].version != version))
						|| (bd == 'modifications' && (!modificationsObject[id] || modificationsObject[id].version != version))
						|| (bd == 'typesOfWork' && (!typesOfWorkObject[id] || typesOfWorkObject[id].version != version))
						|| (bd == 'workflows' && (!workflowsObject[id] || workflowsObject[id].version != version))
						|| (bd == 'flashes' || bd == 'invites')
					) {
						console.log('websocket обновляет ', bd, ' №', id);
						console.log('>>> \tdepartments = ', departmentsObject);
						// if (bd == 'invites' || bd == 'flashes' || (storeItem[bd][id].version != version)) {
						dispatch(loadById({ url: bd, id: id }));
					}
					break;
				case 'delete':
					console.log('websocket удаляет ', bd, ' №', id);
					if (bd !== 'invites' && bd !== 'flashes') {
						dispatch(deletes[bd](id));
					}
					break;
			}
		}
	};

	useEffect(() => {
		if (auth && Object.keys(me).length > 0) {
			socket = io(DEFAULT_WEBSOCKET_URL, {
				query: {
					login: auth?.auth_login,
					loginToken: auth?.auth_token,
				},
				reconnection: true,
				reconnectionAttempts: 2,
			});

			socket.on('connect', () => {
				setIsConnected(true);
				if (socket)
					socket.send('Соединение установлено');
			});

			socket.on('servermessage', (message) => {
				console.log('Сообщение от сервера: ', message);
				const { bd, operation, id, version } = message;
				switch (bd) {
					case 'websocket':
						dispatch(setOnline(JSON.parse(id)));
						break;
					case 'users':
						workWithUsers(id, version, operation);
						break;
					default:
						workWithOther(message);
						break;
				}
			});

			socket.on('disconnect', () => {
				dispatch(setOnline([]));
				setIsConnected(true);
				console.log('Соединение разорвано');
			});

			socket.on('reconnect_attempt', (attemptNumber) => {
				console.log('Попытка переподключения номер ', attemptNumber);
			});
		}
		return () => {
			if (socket && auth && Object.keys(me).length > 0)
				socket.disconnect();
		};
	}, [me, auth]);

	return { isConnected, socket };
};
