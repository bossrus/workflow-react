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
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';

interface ITabs {
	label: string,
	url: string,
	badge: number,
	count: number
}


function MainComponent() {
	const {
		me,
		workflowsAll,
	} = useReduxSelectors();
	const {
		workflowsInMyProcess,
		workflowsNotPublishedArray,
		workflowsPublishedArray,
		workflowsInMyDepartment,
	} = useWorksSelectors();
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

		const newTabs: ITabs[] = [];
		if (me.canStartStopWorks && workflowsNotPublishedArray.length > 0) {
			newTabs.push({
				label: 'Публикация компонентов',
				url: 'publish',
				badge: workflowsNotPublishedArray[0].urgency,
				count: workflowsNotPublishedArray.length,
			});
		}
		if (workflowsInMyProcess.length > 0) {
			newTabs.push({
				label: 'Очередь заказов у меня в работе',
				url: 'my',
				badge: workflowsInMyProcess[0].urgency,
				count: workflowsInMyProcess.length,
			});
		}
		if (workflowsInMyDepartment.length > 0) {
			newTabs.push({
				label: 'Очередь заказов в моём отделе',
				url: 'my-department',
				badge: workflowsInMyDepartment[0].urgency,
				count: workflowsInMyDepartment.length,
			});
		}
		if (workflowsPublishedArray.length > 0) {
			newTabs.push({
				label: 'Очередь общая очередь заказов',
				url: 'all-works',
				badge: workflowsPublishedArray[0].urgency,
				count: workflowsPublishedArray.length,
			});
		}
		setTabs(newTabs);
		if (path === 'all-works') {

			if (publishBefore == 0 && workflowsNotPublishedArray.length != 0) {
				setBefore(workflowsInMyProcess.length, workflowsInMyDepartment.length, workflowsPublishedArray.length);
				navigate('/main/publish');
			}
			if (myBefore == 0 && workflowsInMyProcess.length != 0) {
				setBefore(workflowsInMyProcess.length, workflowsInMyDepartment.length, workflowsPublishedArray.length);
				navigate('/main/my');
			}
			if (departmentBefore == 0 && workflowsInMyDepartment.length != 0) {
				setBefore(workflowsInMyProcess.length, workflowsInMyDepartment.length, workflowsPublishedArray.length);
				navigate('/main/my-department');
			}
		}

		setBefore(workflowsInMyProcess.length, workflowsInMyDepartment.length, workflowsPublishedArray.length);
		if (
			(path === 'publish' && workflowsNotPublishedArray.length === 0) ||
			(path === 'my-department' && workflowsInMyDepartment.length === 0) ||
			(path === 'my' && workflowsInMyProcess.length === 0) ||
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