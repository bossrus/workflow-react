import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { ITypeOfWork } from '@/interfaces/worktype.interface.ts';

interface IOneTypeOfWorkProps {
	changeEditedTypeOfWork: (id: string) => void;
	deleteTypeOfWork: (id: string) => void;
	typeOfWork: ITypeOfWork;
	currentTypeOfWork: string | undefined;
}

// {title, 	numberInWorkflow,	isUsedInWorkflow}
function OneTypeOfWorkComponent({
									currentTypeOfWork,
									changeEditedTypeOfWork,
									deleteTypeOfWork,
									typeOfWork: { _id, title },
								}: IOneTypeOfWorkProps) {
	const disabled = currentTypeOfWork === _id;
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
					название
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{title}
				</Typography>

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
						onClick={() => deleteTypeOfWork(_id!)}
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
						onClick={() => changeEditedTypeOfWork(_id!)}
						disabled={disabled}
					>
						<EditNoteOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}

export default OneTypeOfWorkComponent;