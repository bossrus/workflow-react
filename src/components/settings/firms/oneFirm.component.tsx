import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IFirm } from '@/interfaces/firm.interface.ts';

interface IOneFirmProps {
	changeEditedFirm: (id: string) => void;
	deleteFirm: (id: string) => void;
	firm: IFirm;
	currentFirm: string | undefined;
}

function OneFirmComponent({
							  currentFirm,
							  changeEditedFirm,
							  deleteFirm,
							  firm: { _id, title, basicPriority },
						  }: IOneFirmProps) {
	const disabled = currentFirm === _id;
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

				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					базовый приоритет
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{basicPriority}
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
						onClick={() => deleteFirm(_id!)}
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
						onClick={() => changeEditedFirm(_id!)}
						disabled={disabled}
					>
						<EditNoteOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}

export default OneFirmComponent;