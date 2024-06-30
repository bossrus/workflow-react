import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useParams } from 'react-router-dom';
import { ComponentType } from 'react';
import MeSettingsComponent from '@/components/settings/me/me.settings.component.tsx';
import DepartmentsComponents from '@/components/settings/departments/departments.settings.component.tsx';
import FirmsComponents from '@/components/settings/firms/firms.settings.component.tsx';
import ModificationsComponents from '@/components/settings/modifications/modifications.component.tsx';
import MainTypesOfWorkComponents from '@/components/settings/typesOfWork/typesOfWork.component.tsx';
import UsersComponents from '@/components/settings/users/users.component.tsx';
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
	'modifications': ModificationsComponents,
	'types-of-work': MainTypesOfWorkComponents,
	'employees': UsersComponents,
};

function SettingsComponent() {
	const { path } = useParams();
	const SelectedComponent = componentMapping[path as string] || MeSettingsComponent;

	return (
		<>
			<Box
				className={'box-shadow-3 display-flex flex-direction-column height-100 border-radius-2su background-color-white padding-x-2su'}
			>
				<Box
					className={'justify-content-center display-flex'}
				>
					<TabsLineComponent
						tabs={tabs}
						chapter={path || 'me'}
						section={'settings'}
					/>
				</Box>
				<Box
					className={'flex-grow-1'}
				>
					<SelectedComponent />
				</Box>
			</Box>
		</>
	);
}

export default SettingsComponent;