import { Box } from '@mui/material';
import FlashWithAnyKeyReactionAppComponent from '@/components/app/flashWithAnyKeyReaction.app.component.tsx';

const SecurityFlashAppComponent = () => {

	return (
		<FlashWithAnyKeyReactionAppComponent buttonLabel={'Разблокировать аудио'}>
			<h2
				className={'margin-top-0 text-align-center'}
			>
				Здрасте!
			</h2>
			<Box
				className={'display-flex flex-direction-column max-height-300px text-align-center'}
			>
				В связи с&nbsp;правилами безопасности браузера, автоматическое воспроизведение аудио возможно
				только
				после вашего&nbsp;взаимодействия с&nbsp;сайтом.
				<br />
				<strong className={'padding-top-2su'}>Что нужно сделать?</strong>
				<br />
				Просто нажмите любую кнопку или&nbsp;кликните в&nbsp;любом месте окна.
				<br />
				<i className={'padding-top-2su'}>Это сразу разблокирует все аудиофункции и&nbsp;позволит вам
					наслаждаться полным звуковым
					сопровождением.</i>
			</Box>
		</FlashWithAnyKeyReactionAppComponent>
	);
};

export default SecurityFlashAppComponent;