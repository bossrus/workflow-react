import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface IProps {
	children: ReactNode;
	title: string;
}

function RowUserInfoMeSettingsComponent({ children, title }: IProps) {
	return (
		<Box
			paddingBottom={1}
			paddingLeft={'30%'}
		>
			<Typography variant="caption" sx={{ color: '#989a9b' }}>
				{title}
			</Typography>
			<Typography variant="h5" sx={{ fontWeight: 'bold', pl: 2 }}>
				{children}
			</Typography>
		</Box>
	);
}

export default RowUserInfoMeSettingsComponent;