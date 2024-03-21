import { Box, styled } from '@mui/material';
import { ReactNode } from 'react';

const FullScreenOverlay = styled(Box)({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100vw',
	height: '100vh',
	backgroundColor: 'rgba(0, 0, 0, 0.8)',
	zIndex: 1000,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const ModalBox = styled(Box)({
	backgroundColor: 'white',
	padding: '12px',
	borderRadius: '8px',
	boxShadow: '6px 6px 6px rgba(0, 0, 0, 1)',
});

interface IProps {
	children: ReactNode;
}

const ModalAppComponent = ({ children }: IProps) => {

	return (
		<FullScreenOverlay>
			<ModalBox>
				{children}
			</ModalBox>
		</FullScreenOverlay>
	);
};

export default ModalAppComponent;