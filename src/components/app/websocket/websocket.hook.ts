import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { load, loadById } from '@/store/_shared.thunks.ts';
import { DEFAULT_WEBSOCKET_URL } from '@/_constants/api.ts';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import {
	departments,
	firms,
	modifications,
	TAppDispatch,
	typesOfWork,
	users as usersStore, workflows,
} from '@/store/_store.ts';
import { setOnline } from '@/store/usersOnline.slice.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { IWebsocket } from '@/interfaces/websocket.interface.ts';
import { getAuth } from '@/_security/auth.ts';

interface IProps {
	users: IUserObject;
	me: IUserUpdate;
	oldMeLength: number;
}

export const useWebSocket = ({ oldMeLength, me, users }: IProps) => {
	const [isConnected, setIsConnected] = useState(false);
	const dispatch = useDispatch<TAppDispatch>();

	const {
		modificationsObject,
		firmsObject,
		typesOfWorkObject,
		departmentsObject,
		workflowsAll: workflowsObject,
	} = useReduxSelectors();

	const deletes: { [key: string]: (id: string) => { type: string, payload: string } } = {
		'workflows': workflows.actions.deleteElement,
		'users': usersStore.actions.deleteElement,
		'departments': departments.actions.deleteElement,
		'firms': firms.actions.deleteElement,
		'modifications': modifications.actions.deleteElement,
		'typesOfWork': typesOfWork.actions.deleteElement,
	};


	const [socket, setSocket] = useState<Socket>();

	const websocketReaction = ({ bd, operation, id, version }: IWebsocket) => {
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
						|| (bd == 'users' && (!users[id] || users[id].version != version))
						|| (bd == 'flashes')
					) {
						// console.log('\twebsocket обновляет ', bd, ' №', id);
						dispatch(loadById({ url: bd, id: id }));
					}
					if (bd == 'invites' && id == me._id) {
						// console.log('\twebsocket обновляет ', bd, ' для №', id);
						dispatch(load({ url: bd }));
					}
					if (id == me._id && me.version !== version) {
						// console.log('\tнужно обновить самого себя');
						dispatch(loadById({ url: 'users/me', id }));
					}
					break;
				case 'delete':
					// console.log('\twebsocket удаляет ', bd, ' №', id);
					if (bd !== 'invites' && bd !== 'flashes') {
						dispatch(deletes[bd](id));
					}
					break;
			}
		}
	};

	useEffect(() => {
		const auth = getAuth();
		if (!auth) {
			// console.log('отмена запуска вебсокета. нет авторизации', auth);
			return;
		}
		if (oldMeLength !== 0) {
			// console.log('сменился me или auth');
			const newSocket = io(DEFAULT_WEBSOCKET_URL, {
				query: {
					login: auth?.auth_login,
					loginToken: auth?.auth_token,
				},
				reconnection: true,
				reconnectionAttempts: 2,
			});

			setSocket(newSocket);

			newSocket.on('connect', () => {
				setIsConnected(true);
				if (newSocket)
					newSocket.send('Соединение установлено');
			});

			newSocket.on('servermessage', (message) => {
				// console.log('Сообщение от сервера: ', message);
				websocketReaction(message);
			});

			newSocket.on('disconnect', () => {
				dispatch(setOnline([]));
				setIsConnected(false);
				// console.log('Соединение разорвано');
			});

			newSocket.on('reconnect_attempt', (attemptNumber) => {
				console.log('Попытка переподключения номер ', attemptNumber);
			});
		}
		return () => {
			if (oldMeLength !== 0) {
				// console.log('useWebsocket is closed');
				if (socket && auth && Object.keys(me).length > 0) {
					setIsConnected(false);
					socket.disconnect();
				}
			}
		};
	}, [oldMeLength]);

	return { isConnected, socket };
};
