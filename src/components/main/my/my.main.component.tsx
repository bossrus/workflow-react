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
	// console.log('paramsPath в my.main.component >>>>', paramsPath);
	// console.log('id в my.main.component >>>>', paramsId);

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
		// console.log('диспатчим');
		dispatch(patchOne({
			url: 'users/me',
			data: data,
		}));
	};

	useEffect(() => {
		console.log('зашли в юзефект');
		if (workflowsInMyProcess.length < 1) return;
		console.log('проверка на длину миновала');
		if (!paramsId
			|| !workflowsObject[paramsId]
			|| !workflowsObject[paramsId].executors
			|| !workflowsObject[paramsId].executors!.includes(me._id!)
			|| workflowsObject[paramsId].currentDepartment !== me.currentDepartment
		) {
			console.log('внутри уcловий');
			if (workflowsInMyProcess.length > 0) {
				console.log('переход на актив!');
				navigate('/main/my/' + workflowsInMyProcess[0]._id);
			} else {
				console.log('неча утут делать');
				navigate('/main');
			}
		}
		if (me.currentWorkflowInWork != paramsId) {
			changeMeCurrent(paramsId!);
		}
	}, [paramsId, workflowsInMyProcess]);

	useEffect(() => {
		console.log('меняем табс при ', workflowsInMyProcess.length);
		setTabs(workflowsInMyProcess.map((work) => {
			return {
				label: work.title,
				url: work._id!,
			};
		}));
	}, [workflowsInMyProcess]);

	// useEffect(() => {
	// 	console.log('табы пустые. пошли отседа');
	// 	// if (tabs.length < 1) navigate('/main');
	//
	// 	console.log('workflowsInMyProcess.length > 0 =', workflowsInMyProcess.length > 0);
	// 	console.log('tabs.length > 0 =', tabs.length > 0);
	// 	console.log('paramsId =', paramsId);
	//
	// }, [tabs]);

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
							<TabsLineComponent tabs={tabs} chapter={paramsId!} section={'main/my'} />
						</Box>
						<Box flexGrow={1} p={2}>
							<WorkMyMainComponent work_id={paramsId!} />
						</Box>
					</Box>
				</Box>
			}
		</>
	);
}

export default MyMainComponent;