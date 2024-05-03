import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import { ILogObject } from '@/interfaces/log.interface.ts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useNavigate } from 'react-router-dom';

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
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const res = await axiosCreate.post('workflows/stat/' + propsId, {});
			console.log('\nрезультат запроса:\n', res.data);
			const dataArray: string[] = [];
			setWorkflowsList(res.data as IWorkflow[]);
			(res.data as IWorkflow[]).forEach((item) => {
				dataArray.push(item._id as string);
			});
			const result = await axiosCreate.post('/log', { ids: dataArray });
			console.log(result.data);
			setLoglist(result.data as ILogObject);
		} catch (e) {
			console.log('неудачный запрос', e);
		}
		setIsLoading(false);
	};
	const navigate = useNavigate();
	const goToStatMain = () => {
		navigate('/stat');
	};

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2} bgcolor={'white'}>
				<Box flexGrow={1} p={2} height={'100%'}>
					<Box
						height="100%"
						className={'shadow-inner background'}
						borderRadius={2}
						p={2}
						boxSizing={'border-box'}
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
									width={'100%'}
									height={'100%'}
									boxSizing={'border-box'}
									display="flex" flexDirection="column"
								>
									<Box
										textAlign={'center'}
									>
										<h3>
											{firmsObject[workflowsList[0].firm as string].title}
											{', '}
											№{modificationsObject[workflowsList[0].modification as string].title}
											{', '}
											«{workflowsList[0].title}»
										</h3>
									</Box>
									<Box flexGrow={1}>
										<table className={'table-container'}>
											<tbody>
											<tr>
												<td className={'align-top just-table-container'}>
													<Box flexGrow={1} p={1} display="flex" gap={1}
														 overflow="auto"
														 flexDirection="column"
														 height={'100%'}
														 boxSizing={'border-box'}
													>
														{
															workflowsList.map((workflow) => (
																<Accordion
																	key={workflow._id}
																>
																	<AccordionSummary
																		expandIcon={<ExpandMoreIcon />}
																		sx={{
																			backgroundColor: '#b0f0fd',
																			'&.Mui-expanded': {
																				backgroundColor: '#b0f0fd',
																				margin: '0! important',
																			},
																			'&:hover': {
																				backgroundColor: '#a2f0fd',
																			},
																			margin: '0! important',
																		}}
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
																			paddingBottom={1}
																		>
																			<Accordion
																				sx={{
																					backgroundColor: '#f3fdff',
																					'&:hover': {
																						backgroundColor: '#e9f9fb',
																					},
																					margin: '0! important',
																				}}
																			>
																				<AccordionSummary
																					expandIcon={<ExpandMoreIcon />}

																				>
																					<Typography>Подробности и
																						комментарии</Typography>
																				</AccordionSummary>
																				<AccordionDetails
																				>
																					<pre className={'warp-text'}>
																						<small><small>
																							{workflow.description}
																						</small></small>
																					</pre>
																				</AccordionDetails>
																			</Accordion>
																		</Box>
																		<Box
																			flexGrow={1}
																			// p={1}
																			display="flex"
																			gap={1}
																			flexDirection="column"
																		>
																			{
																				loglist[workflow._id as string] &&
																				loglist[workflow._id as string].map((logItem) => {
																					if (['close', 'take', 'publish'].includes(logItem.operation)) {
																						return (
																							<Box
																								key={logItem._id} // Assuming logItem has a unique identifier _id
																								// flexGrow={1}
																								display="flex"
																								gap={2}
																								flexDirection="row"
																							>
																								<Box width={'20%'}>
																									{new Date(logItem.date as number).toLocaleString('ru-RU', {
																										day: '2-digit',
																										month: '2-digit',
																										year: 'numeric',
																										hour: '2-digit',
																										minute: '2-digit',
																									})}
																								</Box>
																								<Box width={'10%'}>
																									{usersObject[logItem.idWorker].name}
																								</Box>
																								<Box flexGrow={1}>
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
																					}
																					return null;
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
				<Box px={2} pb={2}>
					<Button
						variant="contained"
						size="small"
						fullWidth
						sx={{ borderRadius: '10px' }}
						color={'info'}
						className={'up-shadow'}
						onClick={() => goToStatMain()}
					>
						Вернуться
					</Button>
				</Box>
			</Box>
		</>
	);
}

export default specificWorkflowStatComponent;