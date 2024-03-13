import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IconButton, Tooltip } from '@mui/material';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';

interface IProps {
	id: string,
	dis: boolean,
	// place: 'right' | 'left' | 'bottom' | 'top',
	onClickHere: (id: string) => void
};

function EditButtonComponent({ id, onClickHere, dis }: IProps) {
	return (
		<Tooltip
			title={'Редактировать'}
			arrow
			componentsProps={tooltipProps}
		>
			<IconButton
				color="info"
				className={'up-shadow'}
				onClick={() => onClickHere(id)}
				disabled={dis}
			>
				<EditNoteOutlinedIcon />
			</IconButton>
		</Tooltip>
	);
}

export default EditButtonComponent;