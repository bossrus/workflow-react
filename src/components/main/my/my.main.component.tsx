import { Box } from '@mui/material';
import TabsLineComponent from '@/components/_shared/tabsLine.component.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IUserUpdate } from '@/interfaces/user.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import WorkMyMainComponent from '@/components/main/my/work.my.main.component.tsx';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';

interface Itabs {
	label: string;
	url: string;
}

function MyMainComponent() {

	const [tabs, setTabs] = useState<Itabs[]>([]);

	const { id: paramsId } = useParams();

	const { me } = useReduxSelectors();
	const {
		workflowsObject,
		workflowsInMyProcess,
	} = useWorksSelectors();

	const navigate = useNavigate();
	const dispatch = useDispatch<TAppDispatch>();


	const changeMeCurrent = (id: string) => {
		if (id === me.currentWorkflowInWork) return;
		const data: IUserUpdate = {
			_id: me._id,
			currentWorkflowInWork: id,
		};
		dispatch(patchOne({
			url: 'users/me',
			data: data,
		}));
	};

	useEffect(() => {
		if (workflowsInMyProcess.length < 1) return;
		if (!paramsId
			|| !workflowsObject[paramsId]
			|| !workflowsObject[paramsId].executors
			|| !workflowsObject[paramsId].executors!.includes(me._id!)
			|| workflowsObject[paramsId].currentDepartment !== me.currentDepartment
		) {
			if (workflowsInMyProcess.length > 0) {
				navigate('/main/my/' + workflowsInMyProcess[0]._id);
			} else {
				navigate('/main');
			}
			return;
		}
		if (me.currentWorkflowInWork != paramsId) {
			changeMeCurrent(paramsId!);
		}
	}, [paramsId, workflowsInMyProcess]);

	useEffect(() => {
		setTabs(workflowsInMyProcess.map((work) => {
			return {
				label: work.title,
				url: work._id!,
			};
		}));
	}, [workflowsInMyProcess]);

	return (
		<>
			{
				workflowsInMyProcess.length > 0 &&
				tabs.length > 0 &&
				paramsId &&
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
							<TabsLineComponent tabs={tabs} chapter={paramsId} section={'main/my'} />
						</Box>
						<Box flexGrow={1} p={2}>
							<WorkMyMainComponent incomingWorkID={paramsId!} />
						</Box>
					</Box>
				</Box>
			}
		</>
	);
}

export default MyMainComponent;