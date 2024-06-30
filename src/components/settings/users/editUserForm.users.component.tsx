import { Box, TextField, Typography } from '@mui/material';
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
import { getTitleByID } from '@/_services/getTitleByID.service.ts';
import HeaderEditFormSettingsComponent from '@/components/settings/_shared/header.editForm.settings.component.tsx';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';
import TitleWithHotkeyComponent from '@/components/_shared/titleWithHotkey.component.tsx';

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
		if (currentUser && usersObject[currentUser]) {
			setName(getTitleByID(usersObject, currentUser));
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
			className={'padding-2su margin-2su in-depth border-round-1em'}
		>
			{
				nameOfEditedUser !== '' && <>
					<HeaderEditFormSettingsComponent title={'Редактирование пользователя'} stronger={nameOfEditedUser} />
				</>
			}
			<Box
				className={'display-flex flex-wrap flex-grow-1 gap-2su align-content-flex-start'}
			>
				<Box
					className={'display-flex flex-direction-column'}
				>
					<Typography
						variant="caption"
						className={'color-my-gray'}
					>
						отделы:
					</Typography>
					<CheckListUsersComponent
						list={departmentsArray}
						usingElements={usersDepartments}
						changeUsingElements={setUsersDepartments}
					/>
				</Box>
				<Box
					className={'width-100 min-width-200px flex-basis-0 flex-grow-1'}
				>
					<TextField
						className={'width-100 padding-bottom-1su'}
						id="name"
						label="Имя"
						variant="standard"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								predSaveUser();
							}
						}}
					/>
					<TextField
						className={'width-100 padding-bottom-1su'}
						id="login"
						label="Логин"
						variant="standard"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								predSaveUser();
							}
						}}
					/>
					<TextField
						className={'width-100'}
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
				<Box
					className={'display-flex flex-direction-column'}
				>
					<Typography
						variant="caption"
						className={'color-my-gray'}
					>
						права:
					</Typography>
					<CheckListUsersComponent
						list={USER_RIGHTS}
						usingElements={rights}
						changeUsingElements={setRights}
					/>
				</Box>
			</Box>
			{(name || login || password) && <>
				<ContainedSmallButtonComponent
					color={'success'}
					className={'width-100'}
					disabled={stopSave}
					onClick={predSaveUser}
				>
					{nameOfEditedUser === ''
						? 'Добавить нового сотрудника'
						: `Сохранить изменения в сотруднике «${nameOfEditedUser}»`

					}
				</ContainedSmallButtonComponent>

				<ContainedSmallButtonComponent
					color={'info'}
					className={'width-100'}
					onClick={() => clearEditedUser()}
				>
					<TitleWithHotkeyComponent
						title={nameOfEditedUser !== '' ? `отменить редактирование сотрудника «${nameOfEditedUser}»` : 'Очистить поля'}
						hotkey={'ESC'}
					/>

				</ContainedSmallButtonComponent>
			</>
			}        </Box>
	);
};

export default EditUserFormUsersComponent;