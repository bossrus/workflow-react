import axiosCreate from '@/_api/axiosCreate.ts';

export const loadUsers = async () => {
	const response = await axiosCreate.get('users/admin');
	return response.data;
};