import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { loadById } from '@/store/_api.slice.ts';
import { DEFAULT_WEBSOCKET_URL } from '@/_constants/api.ts';
import { setOnline } from '@/store/usersOnline.slice.ts';
import { IAuthInterface } from '@/interfaces/auth.interface.ts';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { TAppDispatch } from '@/store/_store.ts';

export const useWebSocket = (auth: IAuthInterface | null, me: IUserUpdate, users: IUserObject) => {
	const [isConnected, setIsConnected] = useState(false);
	const dispatch = useDispatch<TAppDispatch>();
	let socket: Socket | null = null;

	const workWithUsers = (id: string, version: number, operation: string) => {
		console.log('\t\t\tпросто чтобы не было ошибки', operation);
		console.log('id => ', id);
		if (!users[id] || users[id].version !== version) {
			dispatch(loadById({ url: 'users', id }));
		}
		if (id == me._id && me.version !== version) {
			dispatch(loadById({ url: 'users/me', id }));
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
					case 'user':
						workWithUsers(id, version, operation);
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
