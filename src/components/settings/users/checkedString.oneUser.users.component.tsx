import { Box, Typography } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

interface IProps {
	title: string;
}

function CheckedStringOneUserUsersComponent({ title }: IProps) {
	return (
		<Box
			className={'display-flex align-items-center'}
		>
			<CheckBoxOutlinedIcon
				className={'color-my-green width-auto height-2su padding-right-05su'}
			/>
			<Typography
				variant="body1"
				className={'padding-5px-0'}
			>
				{title}
			</Typography>

		</Box>
	);
}

export default CheckedStringOneUserUsersComponent;