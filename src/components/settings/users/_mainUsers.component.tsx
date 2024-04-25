import { Box, Button, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneUserComponent from '@/components/settings/users/oneUser.component.tsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IUser, IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { deleteOne, patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { loadUsers } from '@/components/settings/users/loadUsers.service.ts';
import CheckListMainUserComponent from '@/components/settings/users/checkList.MainUser.component.tsx';
import { IUserRight, USER_RIGHTS } from '@/_constants/userRights.ts';

function MainUsersComponents() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [usersObject, setUsersObject] = useState<IUserObject>({});

	useEffect(() => {
		usersLoadingFromApi();
	}, []);

	const usersLoadingFromApi = async (): Promise<void> => {
		fillLocalUserList(await loadUsers());
	};

	const fillLocalUserList = (newUsersObject: IUserObject) => {
		setUsersObject(newUsersObject);
		setUsers(Object.values(newUsersObject));
		// console.log('переменные присвоены');
	};

	const [rights, setRights] = useState<string[]>([]);

	const { currentUser } = useReduxSelectors().states;
	const [name, setName] = useState('');
	const [usersDepartments, setUsersDepartments] = useState<string[]>([]);
	const [nameOfEditedUser, setNameOfEditedUser] = useState('');
	const [stopSave, setStopSave] = useState(true);
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');

	const { departmentsObject, departmentsArray } = useReduxSelectors();
	useEffect(() => {
		if (currentUser) {
			setName(usersObject[currentUser].name);
			setNameOfEditedUser(usersObject[currentUser].name);
			setUsersDepartments(usersObject[currentUser].departments);
			setLogin(usersObject[currentUser].login);

			const newRights: IUserRight[] = [];
			usersObject[currentUser].canMakeModification && newRights.push('create');
			usersObject[currentUser].canSeeStatistics && newRights.push('stat');
			usersObject[currentUser].canStartStopWorks && newRights.push('start');
			usersObject[currentUser].isAdmin && newRights.push('admin');
			usersObject[currentUser].canWriteToSupport && newRights.push('write');
			setRights(newRights);
		}
	}, [currentUser]);

	useEffect(() => {
		let canSave = false;
		let nameSlug = makeSlug(name);
		let loginSlug = makeSlug(login);


		let duplicate = false;
		for (let user of users) {
			if (
				(makeSlug(user.name) === nameSlug || makeSlug(user.login) === loginSlug)
				&& user._id !== currentUser
			) {
				duplicate = true;
				break;
			}
		}

		if (name !== '' && login != '' && !duplicate) {
			if (currentUser !== undefined) {
				let currentUserSlug = makeSlug(usersObject[currentUser].name);
				let isTitleChanged = nameSlug !== currentUserSlug;
				let isCanMakeModificationChanged = usersObject[currentUser].canMakeModification !== rights.includes('create');
				let isCanWriteToSupportChanged = usersObject[currentUser].canWriteToSupport !== rights.includes('write');
				let isSeeStatisticsChanged = usersObject[currentUser].canSeeStatistics !== rights.includes('stat');
				let isStartStopWorksChanged = usersObject[currentUser].canStartStopWorks !== rights.includes('start');
				let isAdminChanged = usersObject[currentUser].isAdmin !== rights.includes('admin');
				let passwordChanged = password !== '';
				let loginChanged = login !== usersObject[currentUser].login;
				let departmentsChanged = JSON.stringify(usersDepartments.sort()) !== JSON.stringify(usersObject[currentUser].departments.sort());

				canSave = isTitleChanged ||
					isCanMakeModificationChanged ||
					isSeeStatisticsChanged ||
					isStartStopWorksChanged ||
					isAdminChanged ||
					passwordChanged ||
					isCanWriteToSupportChanged ||
					loginChanged ||
					departmentsChanged;
			} else {
				canSave = name != '' &&
					usersDepartments.length > 0 &&
					login != '' &&
					password != '';
			}
		}

		// console.log('canSave = ', canSave);
		setStopSave(!canSave);


	}, [name, usersDepartments, rights, login, password]);

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedUser = (id: string | undefined) => {
		dispatch(setState({
			currentUser: id,
		}));
		if (id === undefined) {
			setNameOfEditedUser('');
		}
	};

	const clearFields = () => {
		setName('');
		setUsersDepartments([]);
		setRights([]);
		setNameOfEditedUser('');
		setLogin('');
		setPassword('');
		setNameOfEditedUser('');
		setStopSave(true);
		changeEditedUser(undefined);
	};

	const deleteUser = (id: string) => {
		dispatch(deleteOne({ url: 'users', id }));
		const newUsersObject = { ...usersObject };
		delete newUsersObject[id];
		fillLocalUserList(newUsersObject);
	};

	const saveUser = async () => {
		const user: IUserUpdate = {};
		if (currentUser !== undefined) user._id = usersObject[currentUser]._id;
		if (currentUser == undefined || usersObject[currentUser].canMakeModification !== rights.includes('create')) user.canMakeModification = rights.includes('create');
		if (currentUser == undefined || usersObject[currentUser].canWriteToSupport !== rights.includes('write')) user.canWriteToSupport = rights.includes('write');
		if (currentUser == undefined || usersObject[currentUser].canSeeStatistics !== rights.includes('stat')) user.canSeeStatistics = rights.includes('stat');
		if (currentUser == undefined || usersObject[currentUser].canStartStopWorks !== rights.includes('start')) user.canStartStopWorks = rights.includes('start');
		if (currentUser == undefined || usersObject[currentUser].isAdmin !== rights.includes('admin')) user.isAdmin = rights.includes('admin');
		if (currentUser == undefined || password !== '') user.password = password;
		if (currentUser == undefined || login !== usersObject[currentUser].login) user.login = login;
		if (currentUser == undefined || name !== usersObject[currentUser].login) user.name = name;
		if (currentUser == undefined || JSON.stringify(usersDepartments.sort()) !== JSON.stringify(usersObject[currentUser].departments.sort())) user.departments = usersDepartments;

		// console.log(user);

		await dispatch(patchOne({ url: 'users', data: user }));

		if (!currentUser) {
			await usersLoadingFromApi();
		} else {
			const newUserObject = { ...usersObject };
			newUserObject[currentUser] = { ...newUserObject[currentUser], ...user };
			fillLocalUserList(newUserObject);
		}

		clearFields();
	};

	useEffect(() => {
		// console.log('usersDepartments = ', usersDepartments);
	}, [usersDepartments]);

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
											minWidth={250}>
											<OneUserComponent
												listOfDepartments={departmentsObject}
												deleteUser={deleteUser}
												currentUser={currentUser}
												changeEditedUser={changeEditedUser}
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
				<Box
					p={2}
					m={2}
					className={'in-depth border-round-1em'}
				>
					{
						nameOfEditedUser !== '' && <>
							<Typography
								variant="h5"
								component="h2"
								color={'yellow'}
								sx={{
									mb: '1em',
									backgroundColor: '#0288d1',
									textAlign: 'center',
									borderRadius: '10px',
								}}>

								Редактирование пользователя «<strong>{nameOfEditedUser}</strong>»
							</Typography>
						</>
					}
					<Box display="flex" flexWrap="wrap" flexGrow={1} gap={2} sx={{ alignContent: 'flex-start' }}>
						<Box display={'flex'} flexDirection={'column'}>
							<Typography variant="caption" sx={{ color: '#989a9b' }}>
								отделы:
							</Typography>
							<CheckListMainUserComponent
								list={departmentsArray}
								usingElements={usersDepartments}
								changeUsingElements={setUsersDepartments}
							/>
						</Box>
						<Box width="100%" minWidth={200} flexBasis={0} flexGrow={1}>
							<TextField
								fullWidth
								id="name"
								label="Имя"
								variant="standard"
								value={name}
								onChange={(e) => setName(e.target.value)}
								sx={{ pb: 1 }}
							/>
							<TextField
								fullWidth
								id="login"
								label="Логин"
								variant="standard"
								value={login}
								onChange={(e) => setLogin(e.target.value)}
								sx={{ pb: 1 }}
							/>
							<TextField
								fullWidth
								id="password"
								label="Пароль"
								variant="standard"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Box>
						<Box display={'flex'} flexDirection={'column'}>
							<Typography variant="caption" sx={{ color: '#989a9b' }}>
								права:
							</Typography>
							<CheckListMainUserComponent
								list={USER_RIGHTS}
								usingElements={rights}
								changeUsingElements={setRights}
							/>
						</Box>
					</Box>

					<Button
						variant="contained"
						size="small"
						fullWidth
						sx={{ mt: 2, borderRadius: '10px' }}
						color={'success'}
						className={'up-shadow'}
						disabled={stopSave}
						onClick={saveUser}
					>
						{nameOfEditedUser === ''
							? 'Добавить нового сотрудника'
							: `Сохранить изменения в сотруднике «${nameOfEditedUser}»`

						}
					</Button>

					{nameOfEditedUser !== '' &&
						<Button
							variant="contained"
							size="small"
							fullWidth
							sx={{ mt: 2, borderRadius: '10px' }}
							color={'info'}
							className={'up-shadow'}
							onClick={() => changeEditedUser(undefined)}
						>
							отменить редактирование отдела «{nameOfEditedUser}»
						</Button>}

				</Box>
			</Box>
		</>
	);
}

export default MainUsersComponents;