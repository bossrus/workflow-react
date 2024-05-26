import { Box, Typography } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

interface IProps {
	title: string;
}

function CheckedStringOneUserUsersComponent({ title }: IProps) {
	return (
		<Box display="flex" alignItems="center">
			<CheckBoxOutlinedIcon
				sx={{ color: 'green', width: 'auto', height: '1em', pr: 0.5 }} />
			<Typography variant="body1" sx={{ p: '5px 0' }}>
				{title}
			</Typography>

		</Box>
	);
}

export default CheckedStringOneUserUsersComponent;