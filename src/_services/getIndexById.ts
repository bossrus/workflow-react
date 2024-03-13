export const getIndexById = <T extends { _id: string }>(arr: Array<T>, id: string): number => {
	return arr.findIndex(obj => obj._id === id);
};