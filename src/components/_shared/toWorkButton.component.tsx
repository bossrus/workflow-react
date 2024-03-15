import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IconButton, Tooltip } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

interface IProps {
	id: string,
	dis: boolean,
	// place: 'right' | 'left' | 'bottom' | 'top',
	onClickHere: (id: string) => void
};

function ToWorkButtonComponent({ id, onClickHere, dis }: IProps) {
	return (
		<Tooltip
			title={'Взять в работу'}
			arrow
			componentsProps={tooltipProps}
		>
			<IconButton
				color="success"
				className={'up-shadow'}
				onClick={() => onClickHere(id)}
				disabled={dis}
			>
				<AddToPhotosIcon />
			</IconButton>
		</Tooltip>
	);
}

export default ToWorkButtonComponent;