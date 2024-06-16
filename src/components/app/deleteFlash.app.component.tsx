import { Box } from '@mui/material';
import ModalAppComponent from '@/components/app/modal.app.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useEffect } from 'react';
import { IDeleteMessage } from '@/interfaces/currentStates.interface.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

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
							/>
							<h3
								style={{ marginTop: 0, textAlign: 'center' }}
							>
								Вы уверены?
							</h3>
						</Box>
						<Box
							className={'display-flex gap-2su'}
						>
							<Box className={'flex-1 display-flex'}>
								<ContainedSmallButtonComponent
									color={'warning'}
									onClick={() => switchOff(true)}
								>
									Да, удалите.
								</ContainedSmallButtonComponent>
							</Box>
							<Box className={'flex-1'}>
								<ContainedSmallButtonComponent
									color={'success'}
									onClick={() => switchOff(false)}
								>
									Ни в коем случае! Оставьте как есть.
								</ContainedSmallButtonComponent>
							</Box>
						</Box>
					</ModalAppComponent>
				</Box>
			)}
		</>
	);
};

export default DeleteFlashAppComponent;