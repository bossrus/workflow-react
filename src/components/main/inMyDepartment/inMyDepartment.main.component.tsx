import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToWorkButtonComponent from '@/components/_shared/toWorkButton.component.tsx';
import { assignColor } from '@/_constants/urgencyColors.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import WorkInfoComponent from '@/components/_shared/workInfo.component.tsx';
import { TAppDispatch } from '@/store/_store.ts';
import { useDispatch } from 'react-redux';
import { takeWorkflowThunk } from '@/store/workflows.thunks.ts';

function InMyDepartmentMainComponent() {
	const {
		typesOfWorkObject,
		firmsObject,
		modificationsObject,
		usersObject,
	} = useReduxSelectors();

	const {
		workflowsObject,
		workflowsInMyDepartment: workflows,
	} = useWorksSelectors();

	const [listOfFirms, setListOfFirms] = useState<string[]>([]);
	const [colors, setColors] = useState<Record<string, string>>({});


	useEffect(() => {
		setChecks({});
		setAnyChecked(false);
		setCountChecked(0);

		const newColors: Record<string, string> = {};
		for (let work of workflows) {
			newColors[work._id!] = assignColor(work.urgency);
		}
		setColors(newColors);
	}, [workflows]);

	const [checks, setChecks] = useState<Record<string, boolean>>({});
	const [anyChecked, setAnyChecked] = useState(false);
	const [countChecked, setCountChecked] = useState(0);


	const uncheckAll = () => {
		const allChecks: Record<string, boolean> = {};
		const newFirmsList: Record<string, boolean> = {};
		for (let workflow of workflows) {
			allChecks[workflow._id!] = false;
			if (!newFirmsList[workflow.firm]) newFirmsList[workflow.firm] = true;
		}
		setChecks(allChecks);
		setListOfFirms(Object.keys(newFirmsList));
		setAnyChecked(false);
	};

	useEffect(() => {
		if (workflows.length <= 0) return;
		uncheckAll();
	}, [workflows]);

	const updateAnyChecked = () => {
		let count = 0;
		let selected = false;
		for (let value of Object.values(checks)) {
			if (value) {
				selected = true;
				count++;
			}
		}
		setAnyChecked(selected);
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
		const data: string[] = [];
		if (id === '') {
			for (let key in checksRef.current) {
				if (checksRef.current[key]) {
					data.push(key);
				}
			}
		} else {
			data.push(id);
		}
		if (data.length > 0) {
			dispatch(takeWorkflowThunk({ ids: data }));
			navigate('/main/');
		}
	}

	const selectWorkflowsByFirm = (firm: string) => {
		const newChecks: Record<string, boolean> = { ...checksRef.current };
		for (let key in checksRef.current) {
			if (firm === '' || workflowsObject[key].firm === firm) {
				newChecks[key] = true;
			}
		}
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
		return Object.keys(workflows).length > 0 &&
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
											workflows.length > 0 &&
											workflows.map((wrk) => (
												<WorkInfoComponent
													key={wrk._id}
													idProps={wrk._id!}
													colorProps={colors[wrk._id!]}
													workflowTitle={wrk.title}
													workflowFirmTitle={firmsObject[wrk.firm!].title}
													workflowModificationTitle={modificationsObject[wrk.modification!].title}
													workflowTypeTitle={typesOfWorkObject[wrk.type!].title}
													workflowCountPages={wrk.countPages}
													workflowCountPictures={wrk.countPictures}
													workflowDescription={wrk.description}
													changeChecked={() => changeChecked(wrk._id!)}
													checkedProps={checks[wrk._id!]}
													workflowShowDepartment={false}
												>
													<ToWorkButtonComponent id={wrk._id!} dis={false}
																		   onClickHere={takeWorks} />
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
								disabled={countChecked === Object.keys(workflows).length}
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
										disabled={countChecked === Object.keys(workflows).length}
										onClick={() => selectWorkflowsByFirm(firm)}
									>
										Выделить все заказы «{firmsObject[firm].title}»
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