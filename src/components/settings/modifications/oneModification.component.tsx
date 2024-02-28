import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IModification } from '@/interfaces/modification.interface.ts';

interface IOneModificationProps {
	changeEditedModification: (id: string) => void;
	deleteModification: (id: string) => void;
	modification: IModification;
	currentModification: string | undefined;
}

function OneModificationComponent({
									  currentModification,
									  changeEditedModification,
									  deleteModification,
									  modification: { _id, title },
								  }: IOneModificationProps) {
	const disabled = currentModification === _id;
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
					название
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{title}
				</Typography>

			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
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
						onClick={() => deleteModification(_id!)}
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
						onClick={() => changeEditedModification(_id!)}
						disabled={disabled}
					>
						<EditNoteOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}

export default OneModificationComponent;