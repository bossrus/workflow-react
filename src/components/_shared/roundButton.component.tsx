import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { IconButton, Tooltip } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { ReactElement } from 'react';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

interface IProps {
	id: string,
	dis: boolean,
	onClickHere: (id: string) => void,
	mode: 'edit' | 'delete' | 'toWork' | 'support' | 'exit',
}

interface IconConfig {
	icon: ReactElement;
	color: 'info' | 'error' | 'default' | 'inherit' | 'primary' | 'secondary' | 'success' | 'warning';
	title: string;
}

const icons: Record<IProps['mode'], IconConfig> = {
	edit: {
		icon: <EditNoteOutlinedIcon />,
		color: 'info',
		title: 'Редактировать',
	},
	delete: {
		icon: <CancelOutlinedIcon />,
		color: 'error',
		title: 'Удалить',
	},
	toWork: {
		icon: <AddToPhotosIcon />,
		color: 'success',
		title: 'Взять в работу',
	},
	support: {
		icon: <RateReviewIcon />,
		color: 'primary',
		title: 'Техподдержка',
	},
	exit: {
		icon: <MeetingRoomIcon />,
		color: 'secondary',
		title: 'Выход',
	},
};

function RoundButtonComponent({
								  id,
								  onClickHere,
								  dis,
								  mode,
							  }: IProps) {
	return (
		<Tooltip
			title={icons[mode].title}
			arrow
			componentsProps={tooltipProps}
		>
			<IconButton
				color={icons[mode].color}
				className={'up-shadow'}
				onClick={() => onClickHere(id)}
				disabled={dis}
			>
				{icons[mode].icon}
			</IconButton>
		</Tooltip>
	);
}

export default RoundButtonComponent;