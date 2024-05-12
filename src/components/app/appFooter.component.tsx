import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LinkAppFooterComponent from '@/components/app/link.appFooter.component.tsx';
import { IColors } from '@/interfaces/appSupport.interface.ts';
import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { IUserUpdate } from '@/interfaces/user.interface.ts';

interface ILinks {
	path: string,
	title: string,
	letter: string,
	color: IColors,
	skipOnLines: string[],
	requiredField?: keyof IUserUpdate;
}

const links: ILinks[] = [
	{
		path: '/settings',
		title: 'Настройки',
		letter: 'O',
		color: 'blue',
		skipOnLines: ['/settings'],
	},
	{
		path: '/main/create',
		title: 'Создать новый заказ',
		letter: 'N',
		color: 'red',
		skipOnLines: ['/create'],
		requiredField: 'canStartStopWorks',
	},
	{
		path: '/main/',
		title: 'Главное окно',
		letter: 'M',
		color: 'green',
		skipOnLines: ['publish',
			'my',
			'my-department',
			'all-works'],
	},
	{
		path: '/stat/',
		title: 'Статистика',
		letter: 'S',
		color: 'darkgray',
		skipOnLines: ['/stat'],
		requiredField: 'canSeeStatistics',
	},
];


function AppFooterComponent() {

	const { me } = useReduxSelectors();

	const navigate = useNavigate();
	const location = useLocation().pathname;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.shiftKey || event.metaKey || !event.altKey) {
			return;
		}

		const link = links.find(linkItem => linkItem.letter.toLowerCase() === event.key.toLowerCase());
		if (link) {
			navigate(link.path);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const display = (skipOnLines: string[], requiredField?: keyof IUserUpdate) => {
		if (skipOnLines.some(skipLine => location.includes(skipLine))) {
			return false;
		}

		if (requiredField) {
			return me[requiredField] as boolean;
		}

		return true;
	};

	return (
		<Box textAlign={'center'}>
			<small>
				{links.map(({ path, title, letter, color, skipOnLines, requiredField }) =>
						display(skipOnLines, requiredField) && (
							<LinkAppFooterComponent
								key={letter}
								color={color}
								title={title}
								link={path}
								letter={letter}
								goToUrl={navigate}
							/>
						),
				)}
			</small>
		</Box>
	);
}

export default AppFooterComponent;