import { Typography } from '@mui/material';

interface IProps {
	caption: string;
	title: string;
}

const TitleWithCationSettingsComponent = ({ title, caption }: IProps) => (
	<>
		<Typography
			variant="caption"
			className={'color-my-gray'}
		>
			{caption}
		</Typography>
		<Typography
			variant="h5"
			className={'font-weight-bold'}>
			{title}
		</Typography>
	</>
);

export default TitleWithCationSettingsComponent;