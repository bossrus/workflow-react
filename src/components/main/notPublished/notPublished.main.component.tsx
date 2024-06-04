import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import { assignColor } from '@/_constants/urgencyColors.ts';
import WorkInfoComponent from '@/components/_shared/workInfo.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { publishWorkflowThunk } from '@/store/workflows.thunks.ts';

function NotPublishedMainComponent() {
	const {
		typesOfWorkObject,
		departmentsObject,
		firmsObject,
		modificationsObject,
		usersObject,
		me,
	} = useReduxSelectors();

	const navigate = useNavigate();

	useEffect(() => {
		if (Object.keys(me).length <= 0) return;
		if (!me.canStartStopWorks)
			navigate('/main');
	}, [me.canStartStopWorks]);

	const { workflowsNotPublishedObject } = useWorksSelectors();

	const [checks, setChecks] = useState<Record<string, boolean>>({});
	const [myChecks, setMyChecks] = useState<Record<string, boolean>>({});

	const [colors, setColors] = useState<Record<string, string>>({});
	useEffect(() => {
		if (!workflowsNotPublishedObject) return;
		const keys = Object.keys(workflowsNotPublishedObject);
		if (keys.length <= 0) return;
		const allChecks: Record<string, boolean> = {};
		const allMyChecks: Record<string, boolean> = {};
		const newColors: Record<string, string> = {};
		keys.map((key) => {
			allChecks[key] = false;
			newColors[key] = assignColor(workflowsNotPublishedObject[key].urgency);
			if (me._id === workflowsNotPublishedObject[key].whoAddThisWorkflow) {
				allMyChecks[key] = false;
			}
		});
		setChecks(allChecks);
		setMyChecks(allMyChecks);
		setColors(newColors);
	}, [workflowsNotPublishedObject]);

	const changeChecked = (id: string) => {
		setChecks({ ...checks, [id]: !checks[id] });
		if (myChecks[id] !== undefined)
			setMyChecks({ ...myChecks, [id]: !myChecks[id] });
		setAllTrue();
	};

	const [allTrueChecks, setAllTrueChecks] = useState(false);
	const [allMyTrueChecks, setAllMyTrueChecks] = useState(false);
	const [anyTrueChecks, setAnyTrueChecks] = useState(false);

	useEffect(() => {
		setAllTrue();
	}, [checks, myChecks]);
	const setAllTrue = () => {
		const myTrue = !!Object.values(myChecks).length && Object.values(myChecks).every(value => value);
		const allTrue = !!Object.values(checks).length && Object.values(checks).every(value => value);
		const anyTrue = !!Object.values(checks).length && Object.values(checks).some(value => value);
		setAllMyTrueChecks(myTrue);
		setAllTrueChecks(allTrue);
		setAnyTrueChecks(anyTrue);
	};

	const myChecksRef = useRef(myChecks);
	useEffect(() => {
		myChecksRef.current = myChecks;
	}, [myChecks]);

	const checksRef = useRef(checks);
	useEffect(() => {
		checksRef.current = checks;
	}, [checks]);

	const allMyTrueChecksRef = useRef(allMyTrueChecks);
	useEffect(() => {
		allMyTrueChecksRef.current = allMyTrueChecks;
	}, [allMyTrueChecks]);

	const allTrueChecksRef = useRef(allTrueChecks);
	useEffect(() => {
		allTrueChecksRef.current = allTrueChecks;
	}, [allTrueChecks]);

	const checkUncheckMyWorks = () => {

		console.log(checksRef.current);
		const allMyChecks: Record<string, boolean> = {};
		const allChecks: Record<string, boolean> = JSON.parse(JSON.stringify(checksRef.current));
		Object.keys(myChecksRef.current).map((key) => {
			allMyChecks[key] = !allMyTrueChecksRef.current;
			allChecks[key] = !allMyTrueChecksRef.current;
		}, {});

		setMyChecks(allMyChecks);
		setChecks(allChecks);
	};


	const checkUncheckAllWorks = () => {
		const allMyChecks: Record<string, boolean> = Object.keys(myChecksRef.current).reduce((acc, key) => ({
			...acc,
			[key]: !allTrueChecksRef.current,
		}), {});
		const allChecks: Record<string, boolean> = Object.keys(checksRef.current).reduce((acc, key) => ({
			...acc,
			[key]: !allTrueChecksRef.current,
		}), {});

		setMyChecks(allMyChecks);
		setChecks(allChecks);
		setAllTrue();
	};

	const dispatch = useDispatch<TAppDispatch>();

	async function publishWorks() {
		console.log('checksRef.current=', checksRef.current);
		if (Object.keys(checksRef.current).length <= 0) return;
		const data: string[] = [];
		for (let key in checksRef.current) {
			if (checksRef.current[key]) {
				data.push(key);
			}
		}
		console.log('data = ', data);
		if (data.length <= 0) return;
		dispatch(publishWorkflowThunk({ ids: data }));
		navigate(`/main/`);
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;

			if (event.key.toLowerCase() === 'enter') {
				publishWorks().then();
			}

			if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'ф') {
				checkUncheckAllWorks();
			}
			if (event.key.toLowerCase() === 'y' || event.key.toLowerCase() === 'н') {
				checkUncheckMyWorks();
			}

		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const canShowPage = () => {
		return workflowsNotPublishedObject &&
			firmsObject &&
			usersObject &&
			checks &&
			Object.keys(workflowsNotPublishedObject).length > 0 &&
			Object.keys(firmsObject).length > 0 &&
			Object.keys(usersObject).length > 0 &&
			Object.keys(checks).length > 0;
	};

	return (
		<>
			{
				canShowPage() &&
				<Box height={'100%'} py={2} boxSizing={'border-box'} width={'100%'} display="flex"
					 flexDirection="column">
					<Box
						display="flex"
						flexDirection="column"
						height="100%"
						borderRadius={2}
						className={'shadow-inner background'}
						boxSizing={'border-box'}
					>
						<table className={'table-container'}>
							<tbody>
							<tr>
								<td className={'align-top'}>
									<Box flexGrow={1} p={1} display="flex" gap={1}
										 overflow="auto"
										 flexDirection="column"
										 height={'100%'}
									>
										{
											Object.keys(workflowsNotPublishedObject).length > 0 &&
											Object.keys(workflowsNotPublishedObject).map((key) => (
												<WorkInfoComponent
													key={key}
													idProps={key}
													colorProps={colors[key]}
													checkedProps={checks[key]}
													workflowTitle={workflowsNotPublishedObject[key].title}
													workflowFirmTitle={firmsObject[workflowsNotPublishedObject[key].firm].title}
													workflowModificationTitle={modificationsObject[workflowsNotPublishedObject[key].modification].title}
													workflowTypeTitle={typesOfWorkObject[workflowsNotPublishedObject[key].type].title}
													workflowDepartmentTitle={departmentsObject[workflowsNotPublishedObject[key].currentDepartment].title}
													workflowCountPictures={workflowsNotPublishedObject[key].countPictures}
													workflowCountPages={workflowsNotPublishedObject[key].countPages}
													workflowDescription={workflowsNotPublishedObject[key].description}
													changeChecked={() => changeChecked(key)}
													creator={usersObject[workflowsNotPublishedObject[key].whoAddThisWorkflow] ? usersObject[workflowsNotPublishedObject[key].whoAddThisWorkflow].name : 'тютю'}
												/>
											))
										}
									</Box>
								</td>
							</tr>
							</tbody>
						</table>
						<Box display="flex"
							 flexDirection="row"
							 width={'100%'}
							 boxSizing={'border-box'}
							 gap={2}
							 p={2}
							 alignItems={'center'}
							 flexWrap={'wrap'}>
							<Button
								variant="outlined"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'inherit'}
								className={'up-shadow'}
								onClick={checkUncheckAllWorks}
							>
								<span>{allTrueChecks ? 'Снять выделение со всех работ' : 'Выделить все работы'} <small
									style={{ color: 'gray' }}>(ALT+A)</small></span>
							</Button>
							{
								Object.keys(myChecks).length > 0 &&
								<Button
									variant="outlined"
									size="small"
									sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
									color={'inherit'}
									className={'up-shadow'}
									onClick={checkUncheckMyWorks}
								>
									<span>{
										allMyTrueChecks
											? 'Снять выделение со всех ваших работ'
											: 'Выделить все ваши работы'
									} <small
										style={{ color: 'gray' }}>(ALT+Y)</small>
									</span>
								</Button>
							}
							<Button
								variant="contained"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'success'}
								className={'up-shadow'}
								disabled={!anyTrueChecks}
								onClick={publishWorks}
							>
								<span>Опубликовать выделенные работы <small
									style={{ color: 'white' }}>(ALT+ENTER)</small></span>
							</Button>

						</Box>
					</Box>
				</Box>}
		</>
	);
}

export default NotPublishedMainComponent;