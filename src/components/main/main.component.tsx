import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import MainUsersComponents from '@/components/settings/users/_mainUsers.component.tsx';
import CreateMainComponent from '@/components/main/create/create.main.component.tsx';
import InMyDepartmentMainComponent from '@/components/main/inMyDepartment/inMyDepartment.main.component.tsx';
import NotPublishedMainComponent from '@/components/main/notPublished/notPublished.main.component.tsx';
import AllWorksMainComponent from '@/components/main/allWorks/allWorks.main.component.tsx';
import MyMainComponent from '@/components/main/my/my.main.component.tsx';
import { useEffect, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import {
	getWorkflowsInMyDepartment,
	getWorkflowsInMyProcess,
	getWorkflowsNotPublished,
	getWorkflowsPublished,
} from '@/_services/useWorksSelectors.service.ts';

interface ITabs {
	label: string,
	url: string,
	badge: number,
	count: number
}


function MainComponent() {
	const { me, workflowsAll, firmsObject } = useReduxSelectors();
	const { path } = useParams();
	// console.log('путь в main.component >> ', path);

	const [tabs, setTabs] = useState<ITabs[]>([]);
	const navigate = useNavigate();
	const [myBefore, setMyBefore] = useState(0);
	const [departmentBefore, setDepartmentBefore] = useState(0);
	const [publishBefore, setPublishBefore] = useState(0);

	const setBefore = (my: number, dep: number, publ: number) => {
		setMyBefore(my);
		setDepartmentBefore(dep);
		setPublishBefore(publ);
	};


	useEffect(() => {
		setTabs([]);
		if (!me || Object.keys(me).length < 1) return;
		if (Object.keys(workflowsAll).length < 1 && path !== 'create' && path !== 'main') {
			navigate('/main');
			return;
		}
		const localeWorkflowsNotPublishedArray = getWorkflowsNotPublished(workflowsAll, firmsObject, me);
		const localeWorkflowsInMyProcess = getWorkflowsInMyProcess(workflowsAll, firmsObject, me);
		const localeWorkflowsInMyDepartment = getWorkflowsInMyDepartment(workflowsAll, firmsObject, me);
		const localeWorkflowsPublishedArray = getWorkflowsPublished(workflowsAll, firmsObject, me);


		const newTabs: ITabs[] = [];
		if (me.canStartStopWorks && localeWorkflowsNotPublishedArray.length > 0) {
			newTabs.push({
				label: 'Публикация компонентов',
				url: 'publish',
				badge: localeWorkflowsNotPublishedArray[0].urgency,
				count: localeWorkflowsNotPublishedArray.length,
			});
		}
		if (localeWorkflowsInMyProcess.length > 0) {
			newTabs.push({
				label: 'Очередь заказов у меня в работе',
				url: 'my',
				badge: localeWorkflowsInMyProcess[0].urgency,
				count: localeWorkflowsInMyProcess.length,
			});
		}
		if (localeWorkflowsInMyDepartment.length > 0) {
			newTabs.push({
				label: 'Очередь заказов в моём отделе',
				url: 'my-department',
				badge: localeWorkflowsInMyDepartment[0].urgency,
				count: localeWorkflowsInMyDepartment.length,
			});
		}
		if (localeWorkflowsPublishedArray.length > 0) {
			newTabs.push({
				label: 'Очередь общая очередь заказов',
				url: 'all-works',
				badge: localeWorkflowsPublishedArray[0].urgency,
				count: localeWorkflowsPublishedArray.length,
			});
		}
		setTabs(newTabs);
		if (path === 'all-works') {

			if (publishBefore == 0 && localeWorkflowsNotPublishedArray.length != 0) {
				setBefore(localeWorkflowsInMyProcess.length, localeWorkflowsInMyDepartment.length, localeWorkflowsPublishedArray.length);
				navigate('/main/publish');
			}
			if (myBefore == 0 && localeWorkflowsInMyProcess.length != 0) {
				setBefore(localeWorkflowsInMyProcess.length, localeWorkflowsInMyDepartment.length, localeWorkflowsPublishedArray.length);
				navigate('/main/my');
			}
			if (departmentBefore == 0 && localeWorkflowsInMyDepartment.length != 0) {
				setBefore(localeWorkflowsInMyProcess.length, localeWorkflowsInMyDepartment.length, localeWorkflowsPublishedArray.length);
				navigate('/main/my-department');
			}
		}

		setBefore(localeWorkflowsInMyProcess.length, localeWorkflowsInMyDepartment.length, localeWorkflowsPublishedArray.length);
		if (
			(path === 'publish' && localeWorkflowsNotPublishedArray.length === 0) ||
			(path === 'my-department' && localeWorkflowsInMyDepartment.length === 0) ||
			(path === 'my' && localeWorkflowsInMyProcess.length === 0) ||
			(newTabs.length > 0 && !path)
		) {
			navigate('/main/' + newTabs[0].url);
		}

	}, [
		path,
		workflowsAll,
		me.currentDepartment,
	]);

	return (
		<>
			{
				<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2}
					 bgcolor={'white'} px={2} pb={2} boxSizing={'border-box'}>
					{tabs.length > 0 && path && path != 'create' &&
						<Box justifyContent="center" id={'test'} display={'flex'}>
							<TabsLineComponent tabs={tabs} chapter={path} section={'main'} />
						</Box>
					}
					{path && path != '' ?
						<Box flexGrow={1} boxSizing={'border-box'}>
							{path === 'create' && <CreateMainComponent />}
							{path === 'my-department' && <InMyDepartmentMainComponent />}
							{path === 'publish' && <NotPublishedMainComponent />}
							{path === 'all-works' && <AllWorksMainComponent />}
							{path === 'my' && <MyMainComponent />}
							{path === 'employees' && <MainUsersComponents />}
						</Box>
						: <Box className={'table-container'}>
							<h1>ПУСТО!</h1>
						</Box>
					}
				</Box>
			}
		</>
	);
}

export default MainComponent;