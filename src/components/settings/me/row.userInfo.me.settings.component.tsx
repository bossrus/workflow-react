import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface IProps {
	children: ReactNode;
	title: string;
}

function RowUserInfoMeSettingsComponent({ children, title }: IProps) {
	return (
		<Box
			className={'padding-bottom-1su padding-left-15'}
		>
			<Typography
				variant="caption"
				className={'color-my-gray'}
			>
				{title}
			</Typography>
			<Typography
				variant="h5"
				className={'font-weight-bold padding-left-2su'}
			>
				{children}
			</Typography>
		</Box>
	);
}

export default RowUserInfoMeSettingsComponent;