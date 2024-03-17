import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import { assignColor } from '@/_constants/urgencyColors.ts';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import { useNavigate } from 'react-router-dom';

function AllWorksMainComponent() {
	const {
		workflowsObject,
		typesOfWorkObject,
		firmsObject,
		modificationsObject,
		usersObject,
		me,
		departmentsObject,
	} = useReduxSelectors();

	const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
	const [colors, setColors] = useState<Record<string, string>>({});


	useEffect(() => {

		const keys = Object.keys(workflowsObject);
		if (keys.length <= 0) return;
		const newWorkflows: IWorkflow[] = [];
		const newColors: Record<string, string> = {};
		for (let key of keys) {
			const work = workflowsObject[key];
			if (work.isPublished
			) {
				newWorkflows.push(workflowsObject[key]);
			}
			newColors[key] = assignColor(work.urgency);
		}
		newWorkflows.sort((a, b) => b.urgency - a.urgency);
		setWorkflows(newWorkflows);
		setColors(newColors);
	}, [workflowsObject]);

	const [showDescription, setShowDescription] = useState<string>('');
	const show = (id: string = '') => {
		setShowDescription(id);
	};

	const navigate = useNavigate();
	const editWorkflow = (id: string) => {
		navigate(`/main/create/${id}`);
	};

	return (
		<>
			{
				Object.keys(workflows).length > 0 &&
				Object.keys(typesOfWorkObject).length > 0 &&
				Object.keys(firmsObject).length > 0 &&
				Object.keys(usersObject).length > 0 &&
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
													<Box flexGrow={1}>
														<strong>{wrk.title}</strong>
													</Box>
													<Box flexGrow={1}>
														<Box>
															{firmsObject[wrk.firm!].title}
														</Box>
														<Box>
															№ {modificationsObject[wrk.modification!].title}
														</Box>
													</Box>
													<Box flexGrow={1}>
														<Box>
															<i>{typesOfWorkObject[wrk.type!].title}</i>
														</Box>
													</Box>
													<Box flexGrow={1} display={'flex'} flexDirection={'column'}>
														<Box>
															картинок — {wrk.countPictures} шт.
														</Box>
														<Box>
															страниц — {wrk.countPages} шт.
														</Box>
													</Box>
													<Box flexGrow={1} display={'flex'} flexDirection={'column'}>
														{wrk.executors && wrk.executors?.length > 0
															? <> <Box>
																в работе у
															</Box>
																<Box>
																	{wrk.executors.map(_id => usersObject[_id].name).join(', ')}
																</Box></>
															: <Box>
																заказ в очереди.
															</Box>
														}
														<Box>
															отдел «{departmentsObject[wrk.currentDepartment].title}»
														</Box>
													</Box>
													{me.canStartStopWorks &&
														<Box>
															<EditButtonComponent id={wrk._id!} dis={false}
																				 onClickHere={() => editWorkflow(wrk._id!)} />
														</Box>}
													{wrk._id === showDescription &&
														<Box>
															{wrk.description}
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
					</Box>
				</Box>}
		</>
	);
}

export default AllWorksMainComponent;