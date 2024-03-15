import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useParams } from 'react-router-dom';
import MainModificationsComponents from '@/components/settings/modifications/_mainModifications.component.tsx';
import MainTypesOfWorkComponents from '@/components/settings/typesOfWork/_mainTypesOfWork.component.tsx';
import MainUsersComponents from '@/components/settings/users/_mainUsers.component.tsx';
import CreateMainComponent from '@/components/main/create/create.main.component.tsx';
import InMyDepartmentMainComponent from '@/components/main/inMyDepartment/inMyDepartment.main.component.tsx';
import NotPublishedMainComponent from '@/components/main/notPublished/notPublished.main.component.tsx';

const tabs = [
	{
		label: 'Создать заказ',
		url: 'create',
	},
	{
		label: 'Очередь заказов у меня в работе',
		url: 'my',
	},
	{
		label: 'Публикация компонентов',
		url: 'publish',
	},
	{
		label: 'Очередь заказов в моём отделе',
		url: 'my-department',
	},
	{
		label: 'Очередь общая очередь заказов',
		url: 'all-works',
	},
];

//TODO как дойдёт дело до ручного добалвения табуляций — вспомнить о бэджах и MAX_urgency

function MainComponent() {
	const { path } = useParams();
	console.log('путь в мейне', path);
	const chapter = (!path || path == '') ? 'my' : path;
	return (
		<>
			{chapter &&
				<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2}
					 bgcolor={'white'} px={2}>
					{chapter != 'create' &&
						<Box justifyContent="center" id={'test'} display={'flex'}>
							<TabsLineComponent tabs={tabs} chapter={chapter} section={'main'} />
						</Box>}
					<Box flexGrow={1}>
						{chapter === 'create' && <CreateMainComponent />}
						{chapter === 'my-department' && <InMyDepartmentMainComponent />}
						{chapter === 'publish' && <NotPublishedMainComponent />}
						{chapter === 'modifications' && <MainModificationsComponents />}
						{chapter === 'types-of-work' && <MainTypesOfWorkComponents />}
						{chapter === 'employees' && <MainUsersComponents />}
					</Box>
				</Box>
			}
		</>
	);
}

export default MainComponent;