import { Box, Button } from '@mui/material';
import ModalAppComponent from '@/components/app/modal.app.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useEffect } from 'react';

const SecurityFlashAppComponent = () => {

	const dispatch = useDispatch<TAppDispatch>();

	const switchOff = () => {
		dispatch(setState({
			flashMessage: undefined,
		}));
	};

	useEffect(() => {
		const handleKeyDown = () => {
			switchOff();
		};
		const handleClick = () => {
			switchOff();
		};
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleClick);
		};
	}, []);

	return (
		<Box height={'100%'} width={'100%'} onKeyDown={switchOff} onClick={switchOff}>
			<ModalAppComponent>
				<h2 style={{ marginTop: 0, textAlign: 'center' }}>
					Внимание!
				</h2>
				<Box
					display="flex"
					flexDirection={'column'}
					maxHeight={'300px'}
					maxWidth={'300px'}
					textAlign={'center'}
				>
					<i>Из-за правил безопасности браузера, автоматическое воспроизведение аудио возможно только
						после того, как вы взаимодействуете с сайтом.</i>
					<br />
					<strong>Что делать?</strong>
					<br />
					Просто нажмите любую кнопку или кликните в&nbsp;любом месте окна.
					<br />
					Это мгновенно разблокирует все аудиофункции и&nbsp;позволит вам наслаждаться полным звуковым
					сопровождением.
				</Box>
				<Button
					variant="contained"
					size="small"
					fullWidth
					sx={{ mt: 2, borderRadius: '10px' }}
					color={'warning'}
					className={'up-shadow'}
					onClick={() => switchOff()}
				>
					Разблокировать аудио
				</Button>
			</ModalAppComponent>
		</Box>
	);
};

export default SecurityFlashAppComponent;