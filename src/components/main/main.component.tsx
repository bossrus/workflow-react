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
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';

interface ITabs {
	label: string,
	url: string,
	badge: number,
	count: number
}


function MainComponent() {
	const { me } = useReduxSelectors();
	const {
		workflowsNotPublishedArray,
		workflowsInMyProcess,
		workflowsInMyDepartment,
		workflowsPublishedArray,
	} = useWorksSelectors();
	const { path } = useParams();
	console.log('путь в main.component >> ', path);

	const [tabs, setTabs] = useState<ITabs[]>([]);
	const navigate = useNavigate();
	const [myBefore, setMyBefore] = useState(0);
	const [departmentBefore, setDepartmentBefore] = useState(0);

	const setBefore = () => {
		setMyBefore(workflowsInMyProcess.length);
		setDepartmentBefore(workflowsInMyDepartment.length);
	};

	useEffect(() => {
		setTabs([]);
		if (!me || Object.keys(me).length < 1) return;
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
		console.log('итого сбацали tabs:', tabs, 'при path = ', path);
		setTabs(newTabs);
		if (path === 'all-works') {
			if (myBefore == 0 && workflowsInMyProcess.length != 0) {
				setBefore();
				navigate('/main/my');
			}
			if (departmentBefore == 0 && workflowsInMyDepartment.length != 0) {
				setBefore();
				navigate('/main/my-department');
			}
		}
		if (newTabs.length > 0 && !path) {
			setBefore();
			navigate('/main/' + newTabs[0].url);
		}

	}, [
		path,
		workflowsNotPublishedArray,
		workflowsInMyProcess,
		workflowsInMyDepartment,
		workflowsPublishedArray,
	]);

	return (
		<>
			{
				tabs.length > 0 &&
				<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2}
					 bgcolor={'white'} px={2} pb={2} boxSizing={'border-box'}>
					{path && path != 'create' &&
						<Box justifyContent="center" id={'test'} display={'flex'}>
							<TabsLineComponent tabs={tabs} chapter={path} section={'main'} />
						</Box>}
					<Box flexGrow={1} boxSizing={'border-box'}>
						{path === 'create' && <CreateMainComponent />}
						{path === 'my-department' && <InMyDepartmentMainComponent />}
						{path === 'publish' && <NotPublishedMainComponent />}
						{path === 'all-works' && <AllWorksMainComponent />}
						{path === 'my' && <MyMainComponent />}
						{path === 'employees' && <MainUsersComponents />}
						{!path || path === '' &&
							<Box>
								<h1>ПУСТО!</h1>
							</Box>
						}
					</Box>
				</Box>
			}
		</>
	);
}

export default MainComponent;