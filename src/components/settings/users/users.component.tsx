import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneUserUsersComponent from '@/components/settings/users/oneUser.users.component.tsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IUser, IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { deleteOne, patchOne } from '@/store/_shared.thunks.ts';
import { loadUsers } from '@/components/settings/users/loadUsers.service.ts';
import EditUserFormUsersComponent from '@/components/settings/users/editUserForm.users.component.tsx';
import { useNavigate } from 'react-router-dom';

function UsersComponents() {

	const { states: { currentUser }, me, usersObject: lowUsersInfo } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}

	}, [me]);

	const [users, setUsers] = useState<IUser[]>([]);
	const [usersObject, setUsersObject] = useState<IUserObject>({});

	useEffect(() => {
		console.log('ОБНОВИЛСЯ МАССИВ СОТРУДНИКОВ');
		usersLoadingFromApi().then();
	}, [lowUsersInfo]);

	const usersLoadingFromApi = async (): Promise<void> => {
		fillLocalUserList(await loadUsers());
	};

	const fillLocalUserList = (newUsersObject: IUserObject) => {
		setUsersObject(newUsersObject);
		setUsers(Object.values(newUsersObject));
	};


	const dispatch = useDispatch<TAppDispatch>();

	const deleteUser = (id: string) => {
		dispatch(deleteOne({ url: 'users', id }));
		const newUsersObject = { ...usersObject };
		delete newUsersObject[id];
		fillLocalUserList(newUsersObject);
	};

	const saveUser = async (user: IUserUpdate) => {

		await dispatch(patchOne({ url: 'users', data: user }));

		if (!currentUser) {
			await usersLoadingFromApi();
		} else {
			const newUserObject = { ...usersObject };
			newUserObject[currentUser] = { ...newUserObject[currentUser], ...user };
			fillLocalUserList(newUserObject);
		}

	};

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%">
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'align-top'}>
							<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
								 sx={{ height: '100%', alignContent: 'flex-start' }}>
								{
									users.map((user) =>
										<Box
											key={user._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}
										>
											<OneUserUsersComponent
												deleteUser={deleteUser}
												user={user}
											/>
										</Box>,
									)
								}
							</Box>
						</td>
					</tr>
					</tbody>
				</table>
				<EditUserFormUsersComponent
					currentUser={currentUser}
					usersObject={usersObject}
					saveUser={saveUser}
				/>
			</Box>
		</>
	);
}

export default UsersComponents;