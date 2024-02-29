import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { IDepartmentsObject } from '@/interfaces/department.interface.ts';
import CheckedStringOneUserComponent from '@/components/settings/users/checkedString.oneUser.component.tsx';

interface IOneUserProps {
	changeEditedUser: (id: string) => void;
	deleteUser: (id: string) => void;
	user: IUser;
	currentUser: string | undefined;
	listOfDepartments: IDepartmentsObject;
}

function OneUserComponent({
							  currentUser,
							  changeEditedUser,
							  deleteUser,
							  listOfDepartments,
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
						  }: IOneUserProps) {
	const disabled = currentUser === _id;
	return (
		<Box
			display="flex" p={1} m={2}
			// maxWidth={'300px'}
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
						canMakeModification && <CheckedStringOneUserComponent title={'создать новые номера'} />
					}
					{
						canSeeStatistics && <CheckedStringOneUserComponent title={'видеть статистику'} />
					}
					{
						canStartStopWorks && <CheckedStringOneUserComponent title={'начинать и завершать работу'} />
					}
					{
						canWriteToSupport && <CheckedStringOneUserComponent title={'писать в поддержку'} />
					}
					{
						isAdmin && <CheckedStringOneUserComponent title={'администрировать'} />
					}
				</Box>


			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
				// p={1}
			>
				<Tooltip
					title={'Удалить'}
					arrow
					placement="right"
					componentsProps={tooltipProps}
				>
					<IconButton
						color="warning"
						className={'up-shadow'}
						onClick={() => deleteUser(_id)}
						disabled={disabled}
					>
						<CancelOutlinedIcon />
					</IconButton>
				</Tooltip>
				<Tooltip
					title={'Редактировать'}
					arrow
					placement="right"
					componentsProps={tooltipProps}
				>
					<IconButton
						color="info"
						className={'up-shadow'}
						onClick={() => changeEditedUser(_id)}
						disabled={disabled}
					>
						<EditNoteOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}

export default OneUserComponent;