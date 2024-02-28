import { Box, Button, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import SettingsHeaderComponent from '@/components/settings/settingsHeader.component.tsx';
import OneUserComponent from '@/components/settings/users/oneUser.component.tsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IUser, IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import { deleteOne, patchOne } from '@/store/_api.slice.ts';
import makeSlug from '@/_services/makeSlug.ts';
import { loadUsers } from '@/components/settings/users/loadUsers.service.ts';

function mainUsersComponents() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [usersObject, setUsersObject] = useState<IUserObject>({});

	useEffect(() => {
		(async () => {
			usersLoading(await loadUsers());
		})();
	}, []);

	const usersLoading = (newUsersObject: IUserObject) => {
		setUsers(Object.values(newUsersObject));
		setUsersObject(newUsersObject);
		console.log('переменные присвоены');
	};


	const { currentUser } = useReduxSelectors().states;
	const [name, setName] = useState('');
	const [departments, setDepartments] = useState<string[]>([]);
	const [canMakeModification, setCanMakeModification] = useState<boolean>(false);
	const [canSeeStatistics, setCanSeeStatistics] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [canStartStopWork, setCanStartStopWork] = useState<boolean>(false);
	const [canWriteToSupport, setCanWriteToSupport] = useState<boolean>(true);
	const [nameOfEditedUser, setNameOfEditedUser] = useState('');
	const [stopSave, setStopSave] = useState(true);
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');

	const { departmentsObject: listOfDepartments } = useReduxSelectors();
	useEffect(() => {
		if (currentUser) {
			setName(usersObject[currentUser].name);
			setNameOfEditedUser(usersObject[currentUser].name);
			setDepartments(usersObject[currentUser].departments);
			setCanMakeModification(usersObject[currentUser].canMakeModification);
			setCanSeeStatistics(usersObject[currentUser].canSeeStatistics);
			setCanStartStopWork(usersObject[currentUser].canStartStopWorks);
			setIsAdmin(usersObject[currentUser].isAdmin);
			setLogin(usersObject[currentUser].login);
			setPassword(usersObject[currentUser].password);
			setCanWriteToSupport(usersObject[currentUser].canWriteToSupport);
		}
	}, [currentUser]);

	useEffect(() => {
		let canSave = false;
		let nameSlug = makeSlug(name);
		let loginSlug = makeSlug(login);


		const duplicateName = users.some(user => (currentUser !== undefined && user._id !== currentUser) && makeSlug(user.name) === nameSlug);
		const duplicateLogin = users.some(user => (currentUser !== undefined && user._id !== currentUser) && makeSlug(user.login) === loginSlug);

		if (name !== '' && login != '' && !duplicateName && !duplicateLogin) {
			if (currentUser !== undefined) {
				let currentUserSlug = makeSlug(usersObject[currentUser].name);
				let isTitleChanged = nameSlug !== currentUserSlug;
				let isCanMakeModificationChanged = canMakeModification !== usersObject[currentUser].canMakeModification;
				let isCanWriteToSupportChanged = canWriteToSupport !== usersObject[currentUser].canWriteToSupport;
				let isSeeStatisticsChanged = canSeeStatistics !== usersObject[currentUser].canSeeStatistics;
				let isStartStopWorksChanged = canStartStopWork !== usersObject[currentUser].canStartStopWorks;
				let isAdminChanged = isAdmin !== usersObject[currentUser].isAdmin;
				let passwordChanged = password !== '';
				let loginChanged = login !== usersObject[currentUser].login;
				let departmentsChanged = JSON.stringify(departments.sort()) !== JSON.stringify(usersObject[currentUser].departments.sort());


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
					departments.length > 0 &&
					login != '' &&
					password != '';
			}
		}

		console.log('canSave = ', canSave);
		setStopSave(!canSave);


	}, [name, departments, canMakeModification, canSeeStatistics, isAdmin, canStartStopWork, canWriteToSupport, login, password]);

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
		setDepartments([]);
		setCanMakeModification(false);
		setCanSeeStatistics(false);
		setIsAdmin(false);
		setCanStartStopWork(false);
		setCanWriteToSupport(true);
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
		usersLoading(newUsersObject);
	};

	const saveUser = () => {
		const user: IUserUpdate = {};
		if (currentUser !== undefined) user._id = usersObject[currentUser]._id;
		if (currentUser == undefined || canMakeModification !== usersObject[currentUser].canMakeModification) user.canMakeModification = canMakeModification;
		if (currentUser == undefined || canWriteToSupport !== usersObject[currentUser].canWriteToSupport) user.canWriteToSupport = canWriteToSupport;
		if (currentUser == undefined || canSeeStatistics !== usersObject[currentUser].canSeeStatistics) user.canSeeStatistics = canSeeStatistics;
		if (currentUser == undefined || canStartStopWork !== usersObject[currentUser].canStartStopWorks) user.canStartStopWorks = canStartStopWork;
		if (currentUser == undefined || isAdmin !== usersObject[currentUser].isAdmin) user.isAdmin = isAdmin;
		if (currentUser == undefined || password !== '') user.password = password;
		if (currentUser == undefined || login !== usersObject[currentUser].login) user.login = login;
		if (currentUser == undefined || name !== usersObject[currentUser].login) user.name = name;
		if (currentUser == undefined || JSON.stringify(departments.sort()) !== JSON.stringify(usersObject[currentUser].departments.sort())) user.departments = departments;

		dispatch(patchOne({ url: 'users', data: user }));
		clearFields();
	};

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2} bgcolor={'white'}>
				<Box p={2}>
					<SettingsHeaderComponent activeSettingsTab={'Сотрудники'} />
				</Box>
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
												listOfDepartments={listOfDepartments}
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
									backgroundColor: '#0288d1', // Замените #color на желаемый цвет фона
									textAlign: 'center',
									borderRadius: '10px',
								}}>

								Редактирование пользователя «<strong>{nameOfEditedUser}</strong>»
							</Typography>
						</>
					}
					<TextField
						fullWidth
						id="title"
						label="Название отдела"
						variant="standard"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
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
							? 'Добавить новый отдел'
							: `Сохранить отдел «${nameOfEditedUser}»`

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

export default mainUsersComponents;