import { Tab, Tabs } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = [
	{
		label: 'Мои настройки',
		url: '',
	},
	{
		label: 'Номера журналов',
		url: 'modifications',
	},
	{
		label: 'Отделы',
		url: 'departments',
	},
	{
		label: 'Клиенты',
		url: 'firms',
	},
	{
		label: 'Типы работ',
		url: 'types',
	},
	{
		label: 'Сотрудники',
		url: 'employees',
	},
] as const;

interface ISettingsHeaderProps {
	activeSettingsTab: typeof tabs[number]['label'],
}

function SettingsHeaderComponent(
	{ activeSettingsTab }: ISettingsHeaderProps,
) {
	const activeTab = tabs.findIndex(tab => tab.label === activeSettingsTab);
	const navigate = useNavigate();
	const logNewTab = (_event: SyntheticEvent, newValue: number) => {
		console.log(newValue);
		navigate(`/settings/${tabs[newValue]['url']}`);
	};
	return (
		<Tabs
			value={activeTab}
			onChange={logNewTab}
			variant="scrollable"
			scrollButtons="auto"
			allowScrollButtonsMobile
			aria-label="scrollable auto tabs example"
			sx={{ minHeight: '33px! important' }}
		>
			{
				tabs.map((tab) => (
					<Tab
						className={'down-shadow my-tabs'}
						sx={{ borderRadius: 3 }}
						key={tab.url}
						label={tab.label}
					/>
				))
			}
		</Tabs>
	);
}

export default SettingsHeaderComponent;