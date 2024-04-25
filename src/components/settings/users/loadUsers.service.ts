import axiosCreate from '@/_api/axiosCreate.ts';

export const loadUsers = async () => {
	// console.log('зашли в получение данных');
	const response = await axiosCreate.get('users/admin');
	return response.data;
};