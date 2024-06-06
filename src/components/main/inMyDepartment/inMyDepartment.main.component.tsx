import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignColor } from '@/_constants/urgencyColors.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import WorkInfoComponent from '@/components/_shared/workInfo.component.tsx';
import { TAppDispatch } from '@/store/_store.ts';
import { useDispatch } from 'react-redux';
import { takeWorkflowThunk } from '@/store/workflows.thunks.ts';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';

function InMyDepartmentMainComponent() {
	const {
		typesOfWorkObject,
		firmsObject,
		modificationsObject,
		usersObject,
	} = useReduxSelectors();

	const {
		workflowsObject,
		workflowsInMyDepartment,
	} = useWorksSelectors();

	const [listOfFirms, setListOfFirms] = useState<string[]>([]);
	const [colors, setColors] = useState<Record<string, string>>({});

	const [checks, setChecks] = useState<Record<string, boolean>>({});
	const [anyChecked, setAnyChecked] = useState(false);
	const [countChecked, setCountChecked] = useState(0);

	useEffect(() => {
		setChecks({});
		setAnyChecked(false);
		setCountChecked(0);

		const newColors: Record<string, string> = {};
		for (let work of workflowsInMyDepartment) {
			newColors[work._id!] = assignColor(work.urgency);
		}
		setColors(newColors);
	}, [workflowsInMyDepartment]);

	const uncheckAll = () => {
		const allChecks: Record<string, boolean> = {};
		const newFirmsList: Record<string, boolean> = {};
		for (let workflow of workflowsInMyDepartment) {
			allChecks[workflow._id!] = false;
			if (!newFirmsList[workflow.firm]) newFirmsList[workflow.firm] = true;
		}
		setChecks(allChecks);
		setListOfFirms(Object.keys(newFirmsList));
		setAnyChecked(false);
	};

	useEffect(() => {
		if (workflowsInMyDepartment.length <= 0) return;
		uncheckAll();
	}, [workflowsInMyDepartment]);

	const updateAnyChecked = () => {
		const count = Object.values(checks).filter(value => value).length;
		setAnyChecked(count > 0);
		setCountChecked(count);
	};
	useEffect(() => {
		updateAnyChecked();
	}, [checks]);

	const changeChecked = (id: string) => {
		setChecks({ ...checks, [id]: !checks[id] });
	};

	const navigate = useNavigate();

	const checksRef = useRef(checks);
	useEffect(() => {
		checksRef.current = checks;
	}, [checks]);

	const dispatch = useDispatch<TAppDispatch>();

	async function takeWorks(id: string = '') {
		const data: string[] = id ? [id] : Object.keys(checksRef.current).filter(key => checksRef.current[key]);
		if (data.length > 0) {
			dispatch(takeWorkflowThunk({ ids: data }));
			navigate('/main/');
		}
	}

	const selectWorkflowsByFirm = (firm: string) => {
		const newChecks = Object.keys(checksRef.current).reduce((acc, key) => {
			if (firm === '' || workflowsObject[key].firm === firm) {
				acc[key] = true;
			}
			return acc;
		}, { ...checksRef.current });

		setChecks(newChecks);
	};
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === 'escape') {
				uncheckAll();
			}
			if (!event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;

			if (event.key.toLowerCase() === 'enter') {
				takeWorks().then();
			}

			if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'ф') {
				selectWorkflowsByFirm('');
			}

		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const canShowPage = () => {
		return Object.keys(workflowsInMyDepartment).length > 0 &&
			Object.keys(typesOfWorkObject).length > 0 &&
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
											workflowsInMyDepartment.length > 0 &&
											workflowsInMyDepartment.map((wrk) => (
												<WorkInfoComponent
													key={wrk._id}
													idProps={wrk._id!}
													colorProps={colors[wrk._id!]}
													workflowTitle={wrk.title}
													workflowFirmTitle={getTitleByID(firmsObject, wrk.firm)}
													workflowModificationTitle={getTitleByID(modificationsObject, wrk.modification)}
													workflowTypeTitle={getTitleByID(typesOfWorkObject, wrk.type)}
													workflowCountPages={wrk.countPages}
													workflowCountPictures={wrk.countPictures}
													workflowDescription={wrk.description}
													changeChecked={() => changeChecked(wrk._id!)}
													checkedProps={checks[wrk._id!]}
													workflowShowDepartment={false}
												>
													<RoundButtonComponent
														mode={'toWork'}
														id={wrk._id!}
														dis={false}
														onClickHere={takeWorks}
													/>
												</WorkInfoComponent>
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
							 gap={1}
							 p={2}
							 alignItems={'center'}
							 flexWrap={'wrap'}>
							<Button
								variant="outlined"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'primary'}
								className={'up-shadow'}
								disabled={countChecked === Object.keys(workflowsInMyDepartment).length}
								onClick={() => selectWorkflowsByFirm('')}
							>
								<span>Выделить все заказы <small style={{ color: 'gray' }}>(ALT+A)</small></span>
							</Button>
							{listOfFirms.length > 1 &&
								listOfFirms.map((firm) => (
									<Button
										key={firm}
										variant="outlined"
										size="small"
										sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
										color={'inherit'}
										className={'up-shadow'}
										disabled={countChecked === Object.keys(workflowsInMyDepartment).length}
										onClick={() => selectWorkflowsByFirm(firm)}
									>
										Выделить все заказы «{getTitleByID(firmsObject, firm)}»
									</Button>
								))
							}
							<Button
								variant="outlined"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'secondary'}
								className={'up-shadow'}
								disabled={!anyChecked}
								onClick={uncheckAll}
							>
								<span>Снять выделение со всех заказов <small
									style={{ color: 'gray' }}>(ESC)</small></span>
							</Button>
							<Button
								variant="contained"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'success'}
								className={'up-shadow'}
								disabled={!anyChecked}
								onClick={() => takeWorks()}
							>
								<span>
									Взять в работу выделенны
									{countChecked > 1 ? 'е' : 'й'} заказ
									{countChecked > 1 && 'ы'} <small
									style={{ color: 'white' }}>(ALT+Enter)</small></span>
							</Button>

						</Box>
					</Box>
				</Box>}
		</>
	);
}

export default InMyDepartmentMainComponent;