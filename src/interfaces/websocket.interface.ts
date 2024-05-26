export interface IWebsocket {
	bd: IBases;
	operation: 'update' | 'delete';
	id: string;
	version: number;
}

export type IBases =
	'workflows'
	| 'users'
	| 'departments'
	| 'firms'
	| 'modifications'
	| 'typesOfWork'
	| 'invites'
	| 'flashes'
	| 'websocket'
