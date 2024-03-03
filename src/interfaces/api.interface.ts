//src/interfaces/api.interface.ts
export const URLS = [
	'workflows',
	'users',
	'departments',
	'firms',
	'modifications',
	'typesOfWork',
	'invites',
	'flashes',
	'users/login',
	'users/me',
] as const;
export type IUrls = (typeof URLS)[number];