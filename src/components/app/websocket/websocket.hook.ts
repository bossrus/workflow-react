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
		flashMessages,
	} = useReduxSelectors();

	const deletes: { [key: string]: (id: string) => { type: string, payload: string } } = {
		'workflows': workflows.actions.deleteElement,
		'users': usersStore.actions.deleteElement,
		'departments': departments.actions.deleteElement,
		'firms': firms.actions.deleteElement,
		'modifications': modifications.actions.deleteElement,
		'typesOfWork': typesOfWork.actions.deleteElement,
	};

	const entities = {
		'departments': departmentsObject,
		'firms': firmsObject,
		'modifications': modificationsObject,
		'typesOfWork': typesOfWorkObject,
		'workflows': workflowsObject,
		'users': users,
		'flashes': flashMessages,
	};

	const [socket, setSocket] = useState<Socket>();

	const websocketReaction = ({ bd, operation, id, version }: IWebsocket) => {
		if (bd == 'websocket') {
			dispatch(setOnline(JSON.parse(id)));
		} else {
			switch (operation) {
				case 'update':
					if (
						bd != 'invites' &&
						entities[bd] &&
						(bd == 'flashes' || !entities[bd][id] || entities[bd][id].version != version)) {
						dispatch(loadById({ url: bd, id }));
					}

					if (bd == 'invites' && id == me._id) {
						dispatch(load({ url: bd }));
					}

					if (id == me._id && me.version !== version) {
						dispatch(loadById({ url: 'users/me', id }));
					}
					break;

				case 'delete':
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
			return;
		}
		if (oldMeLength !== 0) {
			// console.log('сменился me или auth');
			const newSocket = io(DEFAULT_WEBSOCKET_URL, {
				query: {
					login: auth?.authLogin,
					loginToken: auth?.authToken,
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
				// console.log('получено сообщение от websocket:', message);
				websocketReaction(message);
			});

			newSocket.on('disconnect', () => {
				dispatch(setOnline([]));
				setIsConnected(false);
			});

			newSocket.on('reconnect_attempt', (attemptNumber) => {
				console.log('WS Попытка переподключения номер ', attemptNumber);
			});
		}
		return () => {
			if (oldMeLength !== 0) {
				if (socket && auth && Object.keys(me).length > 0) {
					setIsConnected(false);
					socket.disconnect();
				}
			}
		};
	}, [oldMeLength]);

	return { isConnected, socket };
};
