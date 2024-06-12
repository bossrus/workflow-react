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
				<Box
					className={'width-100 height-100'}
				>
					<ModalAppComponent>
						<Box
							className={'display-flex flex-direction-column text-align-center'}
						>
							Вы хотите удалить
							<h2
								style={{ color: '#ed6c02' }}
								dangerouslySetInnerHTML={{ __html: message.message }}
							>
								{message.message}
							</h2>
							<h3
								style={{ marginTop: 0, textAlign: 'center' }}
							>
								Вы уверены?
							</h3>
						</Box>
						<Box
							className={'display-flex justify-content-space-between'}
						>
							<Button
								variant="contained"
								color={'warning'}
								className={'padding-6px-16px font-size-0875rem up-shadow width-100 margin-top-2su border-radius-10px flex-1 margin-right-1su'}
								onClick={() => switchOff(true)}
							>
								Да, удалите.
							</Button>
							<Button
								variant="contained"
								color={'success'}
								className={'flex-1 margin-left-1su border-radius-10px margin-top-2su up-shadow width-100 padding-6px-16px font-size-0875rem'}
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