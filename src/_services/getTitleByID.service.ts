export const getTitleByID = (
	data: { [key: string]: { title?: string, name?: string } } | Array<{ _id: string, title?: string, name?: string }>,
	_id: string,
): string => {
	let item: { _id: string, title?: string, name?: string }
		| { title?: string, name?: string }
		| undefined;
	if (Array.isArray(data)) {
		item = data.find(item => item._id === _id);
	} else {
		item = data[_id];
	}
	return item?.title ?? item?.name ?? '[не определено]';
};