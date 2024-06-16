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
		<Box
			className={'height-100 width-100'}
			onKeyDown={switchOff}
			onClick={switchOff}
		>
			<ModalAppComponent>
				<h2
					className={'margin-top-0 text-align-center'}
				>
					Внимание!
				</h2>
				<Box
					className={'display-flex flex-direction-column max-height-300px text-align-center'}
				>
					В связи с&nbsp;правилами безопасности браузера, автоматическое воспроизведение аудио возможно
					только
					после вашего&nbsp;взаимодействия с&nbsp;сайтом.
					<br />
					<strong className={'padding-top2su'}>Что нужно сделать?</strong>
					<br />
					Просто нажмите любую кнопку или&nbsp;кликните в&nbsp;любом месте окна.
					<br />
					<i className={'padding-top2su'}>Это сразу разблокирует все аудиофункции и&nbsp;позволит вам
						наслаждаться полным звуковым
						сопровождением.</i>
				</Box>
				<Button
					variant="contained"
					color={'info'}
					className={'size-small width-100 margin-top-2su border-radius-10px up-shadow'}
					onClick={() => switchOff()}
				>
					Разблокировать аудио
				</Button>
			</ModalAppComponent>
		</Box>
	);
};

export default SecurityFlashAppComponent;