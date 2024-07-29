import { IAuthInterface } from '@/interfaces/auth.interface.ts';

export function getAuth(): IAuthInterface | null {
	let auth: IAuthInterface | null;
	try {
		auth = JSON.parse(localStorage.getItem('workflow-auth') as string);
	} catch (e) {
		auth = null;
	}
	return auth;
}

export function setAuth(authLogin: string, authToken: string): void {
	const auth: string = JSON.stringify({
		authLogin,
		authToken,
	});
	localStorage.setItem('workflow-auth', auth);
}

export async function clearAuth() {
	localStorage.removeItem('workflow-auth');
}

// export const useStorageListener = (): IAuthInterface | null => {
// 	// console.log('запускаем useStorageListener');
// 	const [auhStorage, setAuhStorage] = useState<IAuthInterface | null>(getAuth());
//
// 	useEffect(() => {
// 		const handleStorageChange = (event: StorageEvent) => {
// 			// console.log('пришло событие storage > event.key = ', event.key, 'event.newValue = ', event.newValue, 'event.oldValue = ', event.oldValue);
// 			if (event.key === 'workflow-auth') {
// 				const newAuthValue: IAuthInterface | null = event.newValue ? JSON.parse(event.newValue) : null;
// 				setAuhStorage(newAuthValue);
// 			}
// 		};
//
// 		window.addEventListener('storage', handleStorageChange);
//
// 		return () => {
// 			window.removeEventListener('storage', handleStorageChange);
// 		};
// 	}, []);
//
// 	return auhStorage;
// };