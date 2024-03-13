import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { loadById } from '@/store/_shared.thunks.ts';
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

	const deletes = {
		'workflows': workflows.actions.deleteElement,
		'users': usersStore.actions.deleteElement,
		'departments': departments.actions.deleteElement,
		'firms': firms.actions.deleteElement,
		'modifications': modifications.actions.deleteElement,
		'typesOfWork': typesOfWork.actions.deleteElement,
	};


	let socket: Socket | null = null;

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
						|| (bd == 'flashes' || bd == 'invites')
					) {
						console.log('\twebsocket обновляет ', bd, ' №', id);
						dispatch(loadById({ url: bd, id: id }));
					}
					if (id == me._id && me.version !== version) {
						console.log('\tнужно обновить самого себя');
						dispatch(loadById({ url: 'users/me', id }));
					}
					break;
				case 'delete':
					console.log('\twebsocket удаляет ', bd, ' №', id);
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
				websocketReaction(message);
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
