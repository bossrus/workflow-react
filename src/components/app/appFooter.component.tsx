import { useLocation, useNavigate } from 'react-router-dom';
import LinkAppFooterComponent from '@/components/app/link.appFooter.component.tsx';
import { IColors } from '@/interfaces/appSupport.interface.ts';
import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { IUserUpdate } from '@/interfaces/user.interface.ts';
import useHotkeysNavigation from '@/_hooks/useHotkeysNavigation.tsx';

interface ILinks {
	path: string,
	title: string,
	letter: string[],
	color: IColors,
	skipOnLines: string[],
	requiredField?: keyof IUserUpdate;
}

const links: ILinks[] = [
	{
		path: '/settings',
		title: 'Настройки',
		letter: ['O', 'Щ'],
		color: 'blue',
		skipOnLines: ['/settings'],
	},
	{
		path: '/main/create',
		title: 'Создать новый заказ',
		letter: ['N', 'Т'],
		color: 'red',
		skipOnLines: ['/create'],
		requiredField: 'canStartStopWorks',
	},
	{
		path: '/main/',
		title: 'Главное окно',
		letter: ['M', 'Ь'],
		color: 'black',
		skipOnLines: ['publish',
			'my',
			'my-department',
			'all-works'],
	},
	{
		path: '/stat/',
		title: 'Статистика',
		letter: ['S', 'Ы'],
		color: 'green',
		skipOnLines: ['/stat'],
		requiredField: 'canSeeStatistics',
	},
];


function AppFooterComponent() {

	const { me } = useReduxSelectors();

	const navigate = useNavigate();
	const location = useLocation().pathname;

	const hotkeys = links.map(link => ({
		letter: link.letter,
		path: link.path,
	}));

	useHotkeysNavigation(hotkeys);

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
								key={letter[0]}
								color={color}
								title={title}
								link={path}
								letter={letter[0]}
								goToUrl={navigate}
							/>
						),
				)}
			</small>
		</Box>
	);
}

export default AppFooterComponent;