import { Box, Typography } from '@mui/material';
import { IUser } from '@/interfaces/user.interface.ts';
import CheckedStringOneUserUsersComponent from '@/components/settings/users/checkedString.oneUser.users.component.tsx';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';

interface IOneUserProps {
	user: IUser;
	deleteUser: (id: string) => void;
}

function OneUserUsersComponent({
								   user: {
									   _id,
									   name,
									   departments,
									   canMakeModification,
									   canSeeStatistics,
									   isAdmin,
									   canStartStopWorks,
									   canWriteToSupport,
									   login,
								   },
								   deleteUser,
							   }: IOneUserProps) {

	const { departmentsObject: listOfDepartments, states: { currentUser } } = useReduxSelectors();

	const disabled = currentUser === _id;

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedUser = (id: string | undefined) => {
		dispatch(setState({
			currentUser: id,
		}));
	};


	return (
		<Box
			display="flex" p={1} m={2}
			className={`${disabled ? 'in-depth' : 'shadow'}`}
			borderRadius={'10px'}
		>
			<Box
				flexGrow={1}
				p={1}
			>
				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					имя
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{name}
				</Typography>

				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					логин
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{login}
				</Typography>

				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					входит в отдел{departments.length > 1 && 'ы'}:
				</Typography>
				{departments.map(department => (
					<Typography key={department} variant="h5" sx={{ fontWeight: 'bold' }}>
						{listOfDepartments[department] ? listOfDepartments[department].title : 'это надо удалить :)'}
					</Typography>
				))}
				<Box sx={{ pt: 2 }}>
					<Typography variant="caption" sx={{ color: '#989a9b' }}>
						имеющиеся права:
					</Typography>
					{
						canMakeModification && <CheckedStringOneUserUsersComponent title={'создать новые номера'} />
					}
					{
						canSeeStatistics && <CheckedStringOneUserUsersComponent title={'видеть статистику'} />
					}
					{
						canStartStopWorks &&
						<CheckedStringOneUserUsersComponent title={'начинать и завершать работу'} />
					}
					{
						canWriteToSupport && <CheckedStringOneUserUsersComponent title={'писать в поддержку'} />
					}
					{
						isAdmin && <CheckedStringOneUserUsersComponent title={'администрировать'} />
					}
				</Box>


			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
				// p={1}
			>
				<DeleteButtonComponent id={_id} dis={disabled} onClickHere={deleteUser} />
				<EditButtonComponent id={_id} dis={disabled} onClickHere={changeEditedUser} />
			</Box>
		</Box>
	);
}

export default OneUserUsersComponent;