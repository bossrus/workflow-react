export interface IAuthInterface {
	authLogin: string;
	authToken: string;
}

export interface IError {
	status: number;
	message: string;
	store?: string;
}

