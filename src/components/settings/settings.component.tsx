import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useParams } from 'react-router-dom';
import MeSettingsComponent from '@/components/settings/me/meSettings.component.tsx';
import MainDepartmentsComponents from '@/components/settings/departments/_mainDepartments.component.tsx';
import MainFirmsComponents from '@/components/settings/firms/_mainFirms.component.tsx';
import MainModificationsComponents from '@/components/settings/modifications/_mainModifications.component.tsx';
import MainTypesOfWorkComponents from '@/components/settings/typesOfWork/_mainTypesOfWork.component.tsx';
import MainUsersComponents from '@/components/settings/users/_mainUsers.component.tsx';

const tabs = [
	{
		label: 'Мои настройки',
		url: 'me',
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
		url: 'types-of-work',
	},
	{
		label: 'Сотрудники',
		url: 'employees',
	},
];

function SettingsComponent() {
	const { path } = useParams();
	const chapter = (!path || path === 'me' || path === 'error' || path == '') ? 'me' : path;
	return (
		<>
			{chapter &&
				<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2}
					 bgcolor={'white'} px={2}>
					<Box justifyContent="center" id={'test'} display={'flex'}>
						<TabsLineComponent tabs={tabs} chapter={chapter} section={'settings'} />
					</Box>
					<Box flexGrow={1}>
						{chapter === 'me' && <MeSettingsComponent />}
						{chapter === 'departments' && <MainDepartmentsComponents />}
						{chapter === 'firms' && <MainFirmsComponents />}
						{chapter === 'modifications' && <MainModificationsComponents />}
						{chapter === 'types-of-work' && <MainTypesOfWorkComponents />}
						{chapter === 'employees' && <MainUsersComponents />}
					</Box>
				</Box>
			}
		</>
	);
}

export default SettingsComponent;