import { Box, Button } from '@mui/material';
import ModalAppComponent from '@/components/app/modal.app.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { ReactNode, useEffect } from 'react';

interface IProps {
	buttonLabel: string;
	children: ReactNode;
	onSwitchOff?: () => void;
}

const flashWithAnyKeyReactionAppComponent = ({ buttonLabel, children, onSwitchOff }: IProps) => {

	const dispatch = useDispatch<TAppDispatch>();
	let isMounted = false;

	const switchOff = () => {
		if (!isMounted) return;
		if (onSwitchOff) {
			onSwitchOff();
		}
		dispatch(setState({
			flashMessage: undefined,
		}));
	};

	useEffect(() => {
		const handleKeyDown = () => {
			if (isMounted) switchOff();
		};
		const handleClick = () => {
			if (isMounted) switchOff();
		};
		const timeoutId = setTimeout(() => {
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('click', handleClick);
			console.log('запустили листенеры');
			setTimeout(() => {
				console.log('разрешили реагировать');
				isMounted = true;
			}, 100);
		}, 0);
		return () => {
			clearTimeout(timeoutId);
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
				{children}
				<Button
					variant="contained"
					color={'info'}
					className={'size-small width-100 margin-top-2su border-radius-10px up-shadow'}
					onClick={() => switchOff()}
					autoFocus={true}
				>
					{buttonLabel}
				</Button>
			</ModalAppComponent>
		</Box>
	);
};

export default flashWithAnyKeyReactionAppComponent;