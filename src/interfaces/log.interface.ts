import { IDatabases } from '@/interfaces/databases.interface.ts';

const logOperations = [
	'create',
	'publish',
	'transfer',
	'add_to_description',
	'edit',
	'delete',
	'take',
	'close',
	'check',
] as const;

export type ILogOperation = (typeof logOperations)[number];

export interface ILog {
	_id: string,
	bd: IDatabases,
	idSubject: string,
	idWorker: string,
	date: number,
	operation: ILogOperation
	description: string
}

export interface ILogObject {
	[_id: string]: ILog[];
}

export type ILogUpdate = Partial<ILog>
