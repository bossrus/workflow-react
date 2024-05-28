export const getTitleByID = (obj: { [key: string]: { title?: string, name?: string } }, _id: string): string => {
	const item = obj[_id];
	return item?.title ?? item?.name ?? '[не определено]';
};