import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import axiosCreate from '@/_api/axiosCreate.ts';
import { useNavigate } from 'react-router-dom';
import ToWorkButtonComponent from '@/components/_shared/toWorkButton.component.tsx';
import { assignColor } from '@/_constants/urgencyColors.ts';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';

function InMyDepartmentMainComponent() {
	const {
		typesOfWorkObject,
		firmsObject,
		modificationsObject,
		usersObject,
		me,
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
	const editWorkflow = (id: string) => {
		navigate(`/main/create/${id}`);
	};

	function takeWorks(id: string = '') {
		const data: string[] = [];
		if (id === '') {
			for (let key in checks) {
				if (checks[key]) {
					data.push(key);
				}
			}
		} else {
			data.push(id);
		}
		const result = axiosCreate.patch('/workflows/take', { ids: data });
		console.log('забрали в работу, вроде', result);
		navigate('/main');
	}

	const [showDescription, setShowDescription] = useState<string>('');
	const show = (id: string = '') => {
		setShowDescription(id);
	};

	const selectWorkflowsByFirm = (firm: string) => {
		const newChecks: Record<string, boolean> = { ...checks };
		for (let key in checks) {
			if (firm === '' || workflowsObject[key].firm === firm) {
				newChecks[key] = true;
			}
		}
		setChecks(newChecks);
	};

	return (
		<>
			{
				Object.keys(workflows).length > 0 &&
				Object.keys(typesOfWorkObject).length > 0 &&
				Object.keys(firmsObject).length > 0 &&
				Object.keys(usersObject).length > 0 &&
				Object.keys(checks).length > 0 &&
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
									<Box flexGrow={1} p={1} display="flex" gap={2}
										 overflow="auto"
										 flexDirection="column"
										 height={'100%'}
									>
										{
											workflows.length > 0 &&
											workflows.map((wrk) => (
												<Box key={wrk._id} display="flex"
													 flexDirection="column"
													 borderRadius={2}
													 border={1}
													 borderColor={'#cbcbcb'}>
													<Box display="flex"
														 flexDirection="row"
														 width={'100%'}
														 boxShadow={2}
														 p={1}
														 bgcolor={colors[wrk._id!]}
														 borderRadius={2}
														 boxSizing={'border-box'}
														 gap={1}
														 alignItems={'center'}
														 flexWrap={'wrap'}
														 onMouseOver={() => show(wrk._id)}
														 onMouseOut={() => show()}
													>
														<Box>
															<Checkbox checked={checks[wrk._id!]}
																	  onChange={() => changeChecked(wrk._id!)} />
														</Box>
														<Box flexGrow={1}>
															<strong>{wrk.title}</strong>
														</Box>
														<Box flexGrow={1} textAlign={'center'}>
															<Box>
																{firmsObject[wrk.firm!].title}
															</Box>
															<Box>
																№ {modificationsObject[wrk.modification!].title}
															</Box>
														</Box>
														<Box flexGrow={1} textAlign={'center'}>
															<Box>
																<i>{typesOfWorkObject[wrk.type!].title}</i>
															</Box>
															<Box>
																{wrk.countPages} стр.,
																{wrk.countPictures} tif
															</Box>
														</Box>
														{me.canStartStopWorks &&
															<Box>
																<EditButtonComponent id={wrk._id!} dis={false}
																					 onClickHere={() => editWorkflow(wrk._id!)} />
															</Box>}
														<Box>
															<ToWorkButtonComponent id={wrk._id!} dis={false}
																				   onClickHere={takeWorks} />
														</Box>
													</Box>
													{wrk._id === showDescription &&
														<Box p={2} pt={'0!important'}>
															<small>
															<pre className={'warp-text'}>
															{wrk.description}
															</pre>
															</small>
														</Box>
													}

												</Box>
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
								Выделить все заказы
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
								Снять выделение со всех заказов
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
								Взять в работу выделенны{countChecked > 1 ? 'е' : 'й'} заказ{countChecked > 1 && 'ы'}
							</Button>

						</Box>
					</Box>
				</Box>}
		</>
	);
}

export default InMyDepartmentMainComponent;