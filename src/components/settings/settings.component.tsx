import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useParams } from 'react-router-dom';
import { ComponentType } from 'react';
import MeSettingsComponent from '@/components/settings/me/me.settings.component.tsx';
import DepartmentsComponents from '@/components/settings/departments/departments.component.tsx';
import FirmsComponents from '@/components/settings/firms/firms.component.tsx';
import MainModificationsComponents from '@/components/settings/modifications/_mainModifications.component.tsx';
import MainTypesOfWorkComponents from '@/components/settings/typesOfWork/_mainTypesOfWork.component.tsx';
import MainUsersComponents from '@/components/settings/users/_mainUsers.component.tsx';
import { ITabs } from '@/interfaces/appSupport.interface.ts';


const tabs: ITabs[] = [
	{ label: 'Мои настройки', url: 'me' },
	{ label: 'Номера журналов', url: 'modifications', access: ['isAdmin', 'canMakeModification'] },
	{ label: 'Отделы', url: 'departments', access: ['isAdmin'] },
	{ label: 'Клиенты', url: 'firms', access: ['isAdmin'] },
	{ label: 'Типы работ', url: 'types-of-work', access: ['isAdmin'] },
	{ label: 'Сотрудники', url: 'employees', access: ['isAdmin'] },
];

const componentMapping: { [key: string]: ComponentType } = {
	'me': MeSettingsComponent,
	'departments': DepartmentsComponents,
	'firms': FirmsComponents,

	'modifications': MainModificationsComponents,
	'types-of-work': MainTypesOfWorkComponents,
	'employees': MainUsersComponents,
};

function SettingsComponent() {
	const { path } = useParams();
	const SelectedComponent = componentMapping[path as string] || MeSettingsComponent;

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2}
				 bgcolor={'white'} px={2}>
				<Box justifyContent="center" id={'test'} display={'flex'}>
					<TabsLineComponent tabs={tabs} chapter={path || 'me'} section={'settings'} />
				</Box>
				<Box flexGrow={1}>
					<SelectedComponent />
				</Box>
			</Box>
		</>
	);
}

export default SettingsComponent;