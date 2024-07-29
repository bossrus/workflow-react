import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import UsersComponents from '@/components/settings/users/users.component.tsx';
import CreateMainComponent from '@/components/main/create/create.main.component.tsx';
import InMyDepartmentMainComponent from '@/components/main/inMyDepartment/inMyDepartment.main.component.tsx';
import NotPublishedMainComponent from '@/components/main/notPublished/notPublished.main.component.tsx';
import AllWorksMainComponent from '@/components/main/allWorks/allWorks.main.component.tsx';
import MyMainComponent from '@/components/main/my/my.main.component.tsx';
import { ReactElement, useEffect, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import { ITabs } from '@/interfaces/appSupport.interface.ts';

const components: { [key: string]: ReactElement } = {
	'create': <CreateMainComponent />,
	'my-department': <InMyDepartmentMainComponent />,
	'publish': <NotPublishedMainComponent />,
	'all-works': <AllWorksMainComponent />,
	'my': <MyMainComponent />,
	'employees': <UsersComponents />,
};


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

	const [tabs, setTabs] = useState<ITabs[]>([]);
	const navigate = useNavigate();
	const [myBefore, setMyBefore] = useState(0);
	const [departmentBefore, setDepartmentBefore] = useState(0);
	const [publishBefore, setPublishBefore] = useState(0);

	const setBefore = (my: number, dep: number, publ: number) => {
		if (my !== myBefore) setMyBefore(my);
		if (dep !== departmentBefore) setDepartmentBefore(dep);
		if (publ !== publishBefore) setPublishBefore(publ);
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
				label: 'Публикация заказов',
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
				label: 'Общая очередь заказов',
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

	useEffect(() => {
		if (!path || path === '') {
			document.title = 'Нет работы';
		}
	}, [path]);

	return (
		<>
			{
				<Box
					className={'box-shadow-3 box-sizing-border-box display-flex flex-direction-column height-100 box-sizing-border-box border-radius-2su background-color-white padding-x-2su'}
				>
					{tabs.length > 0 && path && path != 'create' &&
						<Box
							className={'justify-content-center display-flex'}
						>
							<TabsLineComponent tabs={tabs} chapter={path} section={'main'} />
						</Box>
					}
					{path && path != ''
						?
						<Box
							className={'flex-grow-1 box-sizing-border-box'}
						>
							{components[path] && components[path]}
						</Box>
						:
						<Box className={'table-container display-flex align-items-center justify-content-center'}>
							<h2>
								В работе ничего нет
							</h2>
						</Box>
					}
				</Box>
			}
		</>
	);
}

export default MainComponent;