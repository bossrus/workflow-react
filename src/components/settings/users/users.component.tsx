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
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';

function UsersComponents() {

	const { states: { currentUser, deleteMessage }, me, usersObject: lowUsersInfo } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}
		document.title = 'Сотрудники';
	}, [me]);

	const [users, setUsers] = useState<IUser[]>([]);
	const [usersObject, setUsersObject] = useState<IUserObject>({});

	useEffect(() => {
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

	const marker = 'пользователя';

	const [userIdToDel, setUserIdToDel] = useState<string>('');


	useEffect(() => {
		if (isNotValidDeleteMessage(deleteMessage, marker, userIdToDel)) return;
		if (deleteMessage!.result) {
			dispatch(deleteOne({ url: 'users', id: userIdToDel }));
			const newUsersObject = { ...usersObject };
			delete newUsersObject[userIdToDel];
			fillLocalUserList(newUsersObject);
		}
		dispatch(setState({ deleteMessage: undefined }));
		setUserIdToDel('');
	}, [deleteMessage]);


	const deleteUser = async (id: string) => {
		dispatch(setState({
			flashMessage: 'delete',
			deleteMessage: { id: id, message: `${marker} «${getTitleByID(usersObject, id)}»`, result: undefined },
		}));
		setUserIdToDel(id);
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
			<Box
				className={'display-flex flex-direction-column height-100'}
			>
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'vertical-align-top'}>
							<Box
								className={'display-flex flex-wrap flex-grow-1 overflow-auto padding-2su height-100 align-content-flex-start'}
							>
								{
									users.map((user) =>
										<Box
											key={user._id}
											className={'flex-basis-0 flex-grow-1 min-width-250px'}
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