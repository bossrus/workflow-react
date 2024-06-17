import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IHotkey } from '@/interfaces/appSupport.interface.ts';


const useHotkeysNavigation = (hotkeys: IHotkey[], notNeedHotkeys: boolean) => {
	const navigate = useNavigate();
	const handleKeyDown = (event: KeyboardEvent) => {
		if (notNeedHotkeys || event.ctrlKey || event.metaKey || !event.altKey) {
			return;
		}
		const hotkey = hotkeys.find(hk => hk.letter.some(letter => letter.toLowerCase() === event.key.toLowerCase()));
		if (hotkey) {
			console.log(hotkey);
			navigate(hotkey.path);
		}
	};

	useEffect(() => {
		if (notNeedHotkeys) return;
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [hotkeys]);
};

export default useHotkeysNavigation;