import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IHotkey } from '@/interfaces/appSupport.interface.ts';


const useHotkeysNavigation = (hotkeys: IHotkey[], needShift: boolean) => {
	const navigate = useNavigate();

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.metaKey || (!event.altKey && (!needShift || !event.shiftKey))) {
			return;
		}

		const hotkey = hotkeys.find(hk => hk.letter.some(letter => letter.toLowerCase() === event.key.toLowerCase()));
		if (hotkey) {
			navigate(hotkey.path);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [hotkeys]);
};

export default useHotkeysNavigation;