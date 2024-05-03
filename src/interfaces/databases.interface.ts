const databases = [
	'workflow',
	'user',
	'department',
	'firm',
	'modification',
	'type',
	'invite',
	'flash',
] as const;
export type IDatabases = (typeof databases)[number];

export type IOrder = 'asc' | 'desc';
