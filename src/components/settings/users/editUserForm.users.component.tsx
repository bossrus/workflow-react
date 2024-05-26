import { Box, Button, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import CheckListUsersComponent from '@/components/settings/users/checkList.users.component.tsx';
import { USER_RIGHTS } from '@/_constants/userRights.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';

interface IEditUserFormProps {
	currentUser: string | undefined;
	usersObject: IUserObject;
	saveUser: (user: IUserUpdate) => Promise<void>;
}

const EditUserFormUsersComponent = ({ currentUser, usersObject, saveUser }: IEditUserFormProps) => {

	const { departmentsArray } = useReduxSelectors();

	const [name, setName] = useState('');
	const [usersDepartments, setUsersDepartments] = useState<string[]>([]);
	const [nameOfEditedUser, setNameOfEditedUser] = useState('');
	const [stopSave, setStopSave] = useState(true);
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [rights, setRights] = useState<string[]>([]);

	useEffect(() => {
		if (currentUser) {
			setName(usersObject[currentUser].name);
			setNameOfEditedUser(usersObject[currentUser].name);
			setUsersDepartments(usersObject[currentUser].departments);
			setLogin(usersObject[currentUser].login);

			const newRights: string[] = [];
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
		let nameSlug = makeSlug(name.trim());
		let loginSlug = makeSlug(login.trim());

		let duplicate = false;
		for (let user of Object.values(usersObject)) {
			if (
				(makeSlug(user.name) === nameSlug || makeSlug(user.login) === loginSlug)
				&& user._id !== currentUser
			) {
				duplicate = true;
				break;
			}
		}

		if (name.trim() !== '' && login.trim() != '' && !duplicate) {
			if (currentUser !== undefined) {
				let currentUserSlug = makeSlug(usersObject[currentUser].name);
				let isTitleChanged = nameSlug !== currentUserSlug;
				let isCanMakeModificationChanged = usersObject[currentUser].canMakeModification !== rights.includes('create');
				let isCanWriteToSupportChanged = usersObject[currentUser].canWriteToSupport !== rights.includes('write');
				let isSeeStatisticsChanged = usersObject[currentUser].canSeeStatistics !== rights.includes('stat');
				let isStartStopWorksChanged = usersObject[currentUser].canStartStopWorks !== rights.includes('start');
				let isAdminChanged = usersObject[currentUser].isAdmin !== rights.includes('admin');
				let passwordChanged = password !== '';
				let loginChanged = login.trim() !== usersObject[currentUser].login;
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

		setStopSave(!canSave);
	}, [name, usersDepartments, rights, login, password]);

	const dispatch = useDispatch<TAppDispatch>();

	const predSaveUser = () => {
		if (stopSave) return;
		const user: IUserUpdate = {};
		if (currentUser !== undefined) user._id = usersObject[currentUser]._id;
		if (currentUser == undefined || usersObject[currentUser].canMakeModification !== rights.includes('create')) user.canMakeModification = rights.includes('create');
		if (currentUser == undefined || usersObject[currentUser].canWriteToSupport !== rights.includes('write')) user.canWriteToSupport = rights.includes('write');
		if (currentUser == undefined || usersObject[currentUser].canSeeStatistics !== rights.includes('stat')) user.canSeeStatistics = rights.includes('stat');
		if (currentUser == undefined || usersObject[currentUser].canStartStopWorks !== rights.includes('start')) user.canStartStopWorks = rights.includes('start');
		if (currentUser == undefined || usersObject[currentUser].isAdmin !== rights.includes('admin')) user.isAdmin = rights.includes('admin');
		if (currentUser == undefined || password !== '') user.password = password;
		if (currentUser == undefined || login !== usersObject[currentUser].login) user.login = login.trim();
		if (currentUser == undefined || name !== usersObject[currentUser].login) user.name = name.trim();
		if (currentUser == undefined || JSON.stringify(usersDepartments.sort()) !== JSON.stringify(usersObject[currentUser].departments.sort())) user.departments = usersDepartments;

		saveUser(user).then();

		clearFields();
	};

	const clearEditedUser = () => {
		dispatch(setState({ currentUser: undefined }));
		setNameOfEditedUser('');
	};

	const clearFields = () => {
		setName('');
		setUsersDepartments([]);
		setRights([]);
		setLogin('');
		setPassword('');
		setStopSave(true);
		clearEditedUser();
	};

	useEscapeKey(clearFields);

	return (
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
					<CheckListUsersComponent
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
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								predSaveUser();
							}
						}}
					/>
					<TextField
						fullWidth
						id="login"
						label="Логин"
						variant="standard"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
						sx={{ pb: 1 }}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								predSaveUser();
							}
						}}
					/>
					<TextField
						fullWidth
						id="password"
						label="Пароль"
						variant="standard"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								predSaveUser();
							}
						}}
					/>
				</Box>
				<Box display={'flex'} flexDirection={'column'}>
					<Typography variant="caption" sx={{ color: '#989a9b' }}>
						права:
					</Typography>
					<CheckListUsersComponent
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
				onClick={predSaveUser}
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
					onClick={() => clearEditedUser()}
				>
					отменить редактирование отдела «{nameOfEditedUser}»
				</Button>}
		</Box>
	);
};

export default EditUserFormUsersComponent;