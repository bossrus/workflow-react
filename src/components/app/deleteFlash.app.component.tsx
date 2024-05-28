import { Box, Button } from '@mui/material';
import ModalAppComponent from '@/components/app/modal.app.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useEffect } from 'react';
import { IDeleteMessage } from '@/interfaces/currentStates.interface.ts';

interface IDeleteFlashProps {
	message?: IDeleteMessage;
}

const DeleteFlashAppComponent = ({ message }: IDeleteFlashProps) => {

	const dispatch = useDispatch<TAppDispatch>();

	const switchOff = (state: boolean) => {
		if (!message) return;
		dispatch(setState({
			flashMessage: undefined,
			deleteMessage: { ...message, result: state },
		}));
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();
			if (event.key === 'Enter' || event.key === 'Escape') switchOff(event.key === 'Enter');
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<>
			{message && (
				<Box height={'100%'} width={'100%'}>
					<ModalAppComponent>
						<Box
							display="flex"
							flexDirection={'column'}
							textAlign={'center'}
						>
							Вы хотите удалить
							<h2
								style={{ color: '#ed6c02' }}
								dangerouslySetInnerHTML={{ __html: message.message }}
							>
								{/*{message.message}*/}
							</h2>
							<h3
								style={{ marginTop: 0, textAlign: 'center' }}
							>
								Вы уверены?
							</h3>
						</Box>
						<Box display="flex" justifyContent="space-between">
							<Button
								variant="contained"
								size="small"
								fullWidth
								sx={{ mt: 2, borderRadius: '10px', flex: 1, mr: 1 }}
								color={'warning'}
								className={'up-shadow'}
								onClick={() => switchOff(true)}
							>
								Да, удалите.
							</Button>
							<Button
								variant="contained"
								size="small"
								fullWidth
								sx={{ mt: 2, borderRadius: '10px', flex: 1, ml: 1 }}
								color={'success'}
								className={'up-shadow'}
								onClick={() => switchOff(false)}
							>
								Ни в коем случае! Оставьте как есть.
							</Button>
						</Box>
					</ModalAppComponent>
				</Box>
			)}
		</>
	);
};

export default DeleteFlashAppComponent;