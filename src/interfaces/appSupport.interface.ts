import { IUser } from '@/interfaces/user.interface.ts';

export type IColors = 'blue' | 'red' | 'green' | 'darkgray';

export interface IHotkey {
	letter: string[];
	path: string;
}

export interface ITabs {
	label: string;
	url: string;
	badge?: number | undefined;
	count?: number | undefined;
	access?: (keyof IUser)[] | undefined;
}