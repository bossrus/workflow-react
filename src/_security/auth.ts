import { IAuthInterface } from '@/interfaces/auth.interface.ts';

export async function getAuth(): Promise<IAuthInterface | null> {
	let auth: IAuthInterface | null = null;
	try {
		auth = JSON.parse(localStorage.getItem('workflow-auth') as string);
	} catch (e) {
		auth = null;
	}
	return auth;
}

export async function setAuth(auth_login: string, auth_token: string): Promise<void> {
	const auth: string = JSON.stringify({
		auth_login,
		auth_token,
	});
	console.log('set auth = ', auth);
	localStorage.setItem('workflow-auth', auth);
}

export async function clearAuth() {
	localStorage.removeItem('workflow-auth');
}