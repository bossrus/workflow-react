import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IconButton, Tooltip } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface IProps {
	id: string,
	dis: boolean,
	// place: 'right' | 'left' | 'bottom' | 'top',
	onClickHere: (id: string) => void
};

function DeleteButtonComponent({ id, onClickHere, dis }: IProps) {
	return (
		<Tooltip
			title={'Удалить'}
			arrow
			componentsProps={tooltipProps}
		>
			<IconButton
				color="error"
				className={'up-shadow'}
				onClick={() => onClickHere(id)}
				disabled={dis}
			>
				<CancelOutlinedIcon />
			</IconButton>
		</Tooltip>
	);
}

export default DeleteButtonComponent;