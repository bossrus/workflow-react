export interface IAuthInterface {
	auth_login: string;
	auth_token: string;
}

export interface IError {
	status: number;
	message: string;
	store?: string;
}

