export const getIDByTitle = <T extends { title: string, _id: string }>(
	data: Array<T> | { [key: string]: T },
	title: string,
): string => {
	let id: string = '[неопределено]';
	if (Array.isArray(data)) {
		for (let item of data) {
			if (item.title.toLowerCase() === title.toLowerCase()) {
				id = item._id;
				break;
			}
		}
	} else {
		for (let key in data) {
			if (data[key].title.toLowerCase() === title.toLowerCase()) {
				id = data[key]._id;
				break;
			}
		}
	}
	return id;
};