export const getIDByTitle = <T extends { title: string, _id: string }>(arr: Array<T>, title: string): string => {
	for (let item of arr) {
		if (item.title.toLowerCase() === title.toLowerCase()) {
			return item._id;
		}
	}
	return '';
};