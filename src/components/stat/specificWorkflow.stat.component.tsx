import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import { ILog, ILogObject } from '@/interfaces/log.interface.ts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useNavigate } from 'react-router-dom';
import { TAppDispatch, workflows } from '@/store/_store.ts';
import { useDispatch } from 'react-redux';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

interface ISpecificWorkflowStatComponentProps {
	propsId: string;
}

function specificWorkflowStatComponent({
										   propsId,
									   }: ISpecificWorkflowStatComponentProps) {
	const [workflowsList, setWorkflowsList] = useState<IWorkflow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loglist, setLoglist] = useState<ILogObject>({});

	const {
		firmsObject,
		departmentsObject,
		typesOfWorkObject,
		usersObject,
		modificationsObject,
	} = useReduxSelectors();

	useEffect(() => {
		loadData().then();
	}, []);

	const makeLoglist = (idsList: string[], originalList: ILogObject) => {
		const newList: ILogObject = {};
		idsList.map((id) => {
			const tempElement: ILog[] = [];
			originalList[id].map((logItem) => {
				if (['close', 'take', 'publish'].includes(logItem.operation)) {
					tempElement.push(logItem);
				}
			});
			newList[id] = tempElement;
		});
		setLoglist(newList);
	};

	const dispatch = useDispatch<TAppDispatch>();

	const loadData = async () => {
		try {
			const res = await axiosCreate.post('workflows/stat/' + propsId, {});
			const dataArray: string[] = [];
			setWorkflowsList(res.data as IWorkflow[]);
			(res.data as IWorkflow[]).forEach((item) => {
				dataArray.push(item._id as string);
			});
			const result = await axiosCreate.post('/log', { ids: dataArray });
			makeLoglist(dataArray, result.data as ILogObject);
		} catch (e) {
			dispatch(workflows.actions.setError(e as string));
		}
		setIsLoading(false);
	};
	const navigate = useNavigate();
	const goToStatMain = () => {
		navigate('/stat');
	};

	return (
		<>
			<Box
				className={'box-shadow-3 display-flex flex-direction-column height-100 border-radius-2su background-color-white'}
			>
				<Box
					className={'flex-grow-1 padding-2su height-100'}
				>
					<Box
						className={'height-100 shadow-inner background border-radius-2su padding-2su box-sizing-border-box'}
					>
						{
							(
								isLoading
								|| workflowsList.length < 1
								|| Object.keys(loglist).length < 1
								|| Object.keys(firmsObject).length < 1
								|| Object.keys(departmentsObject).length < 1
								|| Object.keys(typesOfWorkObject).length < 1

							)
								? <>
									типа загрузка
								</>
								: <Box
									className={'width-100 height-100 box-sizing-border-box display-flex flex-direction-column '}
								>
									<Box
										className={'text-align-center'}
									>
										<h3>
											{firmsObject[workflowsList[0].firm as string].title}
											{', '}
											№{modificationsObject[workflowsList[0].modification as string].title}
											{', '}
											«{workflowsList[0].title}»
										</h3>
									</Box>
									<Box
										className={'flex-grow-1'}
									>
										<table className={'table-container'}>
											<tbody>
											<tr>
												<td className={'vertical-align-top just-table-container-pb0'}>
													<Box
														className={'height-100 box-sizing-border-box flex-grow-1 padding-1su display-flex gap-1su overflow-auto flex-direction-column'}
													>
														{
															workflowsList.map((workflow) => (
																<Accordion
																	key={workflow._id}
																>
																	<AccordionSummary
																		className={'accordion'}
																		expandIcon={<ExpandMoreIcon />}
																	>
																		{new Date(workflow.isPublished as number).toLocaleString('ru-RU', {
																			day: '2-digit',
																			month: '2-digit',
																			year: 'numeric',
																			hour: '2-digit',
																			minute: '2-digit',
																		})}
																		{' • '}
																		<strong>
																			{typesOfWorkObject[workflow.type as string].title}
																		</strong>
																		{' • '}
																		{usersObject[workflow.whoAddThisWorkflow as string].name}

																	</AccordionSummary>
																	<AccordionDetails
																	>
																		<Box
																			className={'padding-bottom-1su'}
																		>
																			<Accordion
																				className={'accordion-inner'}
																			>
																				<AccordionSummary
																					expandIcon={<ExpandMoreIcon />}

																				>
																					<Typography>Подробности и
																						комментарии</Typography>
																				</AccordionSummary>
																				<AccordionDetails
																				>
																					<pre className={'text-warp'}>
																						<small><small>
																							{workflow.description}
																						</small></small>
																					</pre>
																				</AccordionDetails>
																			</Accordion>
																		</Box>
																		<Box
																			className={'flex-grow-1 display-flex gap-1su flex-direction-column'}
																		>
																			{
																				loglist[workflow._id as string] &&
																				loglist[workflow._id as string].map((logItem, index) => {
																					return (
																						<Box
																							key={logItem._id}
																							className={`display-flex gap-2su flex-direction-row ${index % 2 === 0 ? 'background-color-my-gray-very-light' : 'background-color-white'}`}
																						>
																							<Box
																								className={'width-20'}
																							>
																								{new Date(logItem.date as number).toLocaleString('ru-RU', {
																									day: '2-digit',
																									month: '2-digit',
																									year: 'numeric',
																									hour: '2-digit',
																									minute: '2-digit',
																								})}
																							</Box>
																							<Box
																								className={'width-10'}
																							>
																								{usersObject[logItem.idWorker].name}
																							</Box>
																							<Box
																								className={'flex-grow-1'}
																							>
																								{
																									logItem.operation === 'publish' &&
																									'Создание заказа'
																								}
																								{
																									logItem.operation === 'take' &&
																									'Заказ взят в работу'
																								}
																								{
																									logItem.operation === 'close' &&
																									logItem.description
																								}
																							</Box>
																						</Box>
																					);
																				})
																			}
																		</Box>
																	</AccordionDetails>
																</Accordion>
															))
														}
													</Box>
												</td>
											</tr>
											</tbody>
										</table>
									</Box>
								</Box>
						}
					</Box>
				</Box>
				<Box
					className={'padding-x-2su padding-bottom-2su'}
				>
					<ContainedSmallButtonComponent
						color={'info'}
						className={'width-100'}
						onClick={() => goToStatMain()}
					>
						Вернуться
					</ContainedSmallButtonComponent>
				</Box>
			</Box>
		</>
	);
}

export default specificWorkflowStatComponent;