export const USER_RIGHTS = [
	{ _id: 'create', title: 'создать новые номера' },
	{ _id: 'stat', title: 'видеть статистику' },
	{ _id: 'start', title: 'начинать и завершать работу' },
	{ _id: 'admin', title: 'администрировать' },
	// { _id: 'write', title: 'писать в техподдержку' },
] as const;

export type IUserRight = typeof USER_RIGHTS[number]['_id'];
export type IUserRightsTitles = typeof USER_RIGHTS[number]['title'];
