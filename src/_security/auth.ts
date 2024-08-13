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