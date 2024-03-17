import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IUserUpdate } from '@/interfaces/user.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import WorkMyMainComponent from '@/components/main/my/work.my.main.component.tsx';

interface Itabs {
	label: string;
	url: string;
}

function MyMainComponent() {

	const [tabs, setTabs] = useState<Itabs[]>([]);

	const { path, id: params_id } = useParams();
	console.log('path в my.main.component >>>>', path);
	console.log('id в my.main.component >>>>', params_id);

	const { me, workflowsPublishedObject } = useReduxSelectors();

	const navigate = useNavigate();
	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {
		if (!path && !params_id) return;
		const works: IWorkflow[] = [];
		for (const key in workflowsPublishedObject) {
			if (workflowsPublishedObject[key].executors?.includes(me._id!))
				works.push(workflowsPublishedObject[key]);
		}
		if (works.length === 0) {
			navigate('/main');
		}
		if (works.length === 0) {
			return;
		}
		console.log('длина ворков -= ', works.length);
		changePage(works[0]._id!);
		console.log('works = ', works);
		setTabs(works.map((work) => {
			return {
				label: work.title,
				url: work._id!,
			};
		}));
	}, [workflowsPublishedObject, me.currentWorkflowInWork, params_id]);

	const changeMeCurrent = (id: string) => {
		const data: IUserUpdate = {
			_id: me._id,
			currentWorkflowInWork: id,
		};
		console.log('диспатчим');
		dispatch(patchOne({
			url: 'users/me',
			data: data,
		}));
	};

	const changePage = (id: string) => {
		if (!me.currentWorkflowInWork) {
			changeMeCurrent(id);
		} else {
			if (!params_id) {
				console.log('перенавигейчиваем');
				navigate('/main/my/' + me.currentWorkflowInWork);
			} else if (params_id !== me.currentWorkflowInWork) {
				changeMeCurrent(params_id);
			}
		}
	};

	return (
		<>
			{tabs.length > 0 &&
				path &&
				params_id &&
				<Box height={'100%'} pt={2} boxSizing={'border-box'} width={'100%'} display="flex"
					 flexDirection="column">
					<Box
						display="flex"
						flexDirection="column"
						height="100%"
						borderRadius={2}
						className={'shadow-inner background'}
						boxSizing={'border-box'}
					>
						<Box justifyContent="center" id={'test'} display={'flex'}>
							<TabsLineComponent tabs={tabs} chapter={params_id!} section={'main/my'} />
						</Box>
						<Box flexGrow={1} p={2}>
							<WorkMyMainComponent work_id={params_id!} />
						</Box>
					</Box>
				</Box>
			}
		</>
	);
}

export default MyMainComponent;