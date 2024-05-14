import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useParams } from 'react-router-dom';
import { ComponentType, lazy, Suspense } from 'react';

// тут нет необходимости использовать ленивую загрузку, но чисто для интереса - чоб и не
const MeSettingsComponent = lazy(() =>
	import( './me/meSettings.component.tsx'),
);
const MainDepartmentsComponents = lazy(() =>
	import( './departments/_mainDepartments.component.tsx'),
);
const MainFirmsComponents = lazy(() =>
	import( './firms/_mainFirms.component.tsx'),
);
const MainModificationsComponents = lazy(() =>
	import( './modifications/_mainModifications.component.tsx'),
);
const MainTypesOfWorkComponents = lazy(() =>
	import( './typesOfWork/_mainTypesOfWork.component.tsx'),
);
const MainUsersComponents = lazy(() =>
	import( './users/_mainUsers.component.tsx'),
);

const tabs = [
	{ label: 'Мои настройки', url: 'me' },
	{ label: 'Номера журналов', url: 'modifications' },
	{ label: 'Отделы', url: 'departments' },
	{ label: 'Клиенты', url: 'firms' },
	{ label: 'Типы работ', url: 'types-of-work' },
	{ label: 'Сотрудники', url: 'employees' },
];

const componentMapping: { [key: string]: ComponentType } = {
	'me': MeSettingsComponent,
	'departments': MainDepartmentsComponents,
	'firms': MainFirmsComponents,
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
					<Suspense>
						<SelectedComponent />
					</Suspense>
				</Box>
			</Box>
		</>
	);
}

export default SettingsComponent;