import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useRef, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { useDispatch } from 'react-redux';
import { closeWorkflowThunk } from '@/store/workflows.thunks.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

interface IProps {
	incomingWorkID: string;
}

interface IList {
	id: string;
	title: string;
}

function WorkMyMainComponent({ incomingWorkID }: IProps) {

	const {
		me,
		typesOfWorkObject,
		firmsObject,
		modificationsObject,

		departmentsInWorkflowArray,
		usersArray,
		usersObject,
	} = useReduxSelectors();

	const {
		workflowsObject,
	} = useWorksSelectors();

	const navigate = useNavigate();

	const [usersList, setUsersList] = useState<IList[]>([]);
	const [selectedUser, setSelectedUser] = useState<string>('');

	const [departmentsList, setDepartmentsList] = useState<IList[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<string>('');

	const [description, setDescription] = useState<string>('');

	useEffect(() => {
		if (!me.currentDepartment || usersArray.length < 1) return;
		const newUsers: IList[] = [];
		for (const user of usersArray) {
			if (user._id !== me._id && user.departments.includes(me.currentDepartment) && !workflowsObject[incomingWorkID].executors!.includes(user._id))
				newUsers.push({
					title: user.name,
					id: user._id,
				});
		}
		setUsersList(newUsers);
	}, [usersArray, me.currentDepartment, workflowsObject]);

	useEffect(() => {
		if (!me.currentDepartment || departmentsInWorkflowArray.length < 1 || !workflowsObject[incomingWorkID]) return;
		const newDepartments: IList[] = departmentsInWorkflowArray.map(({ _id, title }) => ({
			id: _id,
			title,
		}));
		if (me.canStartStopWorks) {
			newDepartments.push({
				title: 'Завершить заказ',
				id: 'closeWork',
			});
		}
		const index = newDepartments.findIndex(department => department.id === me.currentDepartment);
		setDepartmentsList(newDepartments);
		if (workflowsObject[incomingWorkID].executors!.length < 2) {
			setSelectedDepartment(newDepartments[index + 1].id);
		} else {
			setSelectedDepartment('justClose');
		}
	}, [me.currentDepartment, departmentsInWorkflowArray, workflowsObject, me.currentWorkflowInWork]);

	const descriptionRef = useRef(description);
	useEffect(() => {
		descriptionRef.current = description;
	}, [description]);

	const saveToDescription = () => {
		if (!descriptionRef.current) return;
		(async () => {
			await axiosCreate.patch('/workflows/description/' + incomingWorkID, {
				text: descriptionRef.current,
			});
		})();
		setDescription('');
	};

	const inviteUser = () => {
		(async () => {
			await
				axiosCreate.post('/invites', {
					from: me._id,
					to: selectedUser,
					workflow: incomingWorkID,
				});
		})();
		setSelectedUser('');
	};

	const selectedDepartmentRef = useRef(selectedDepartment);
	useEffect(() => {
		selectedDepartmentRef.current = selectedDepartment;
	}, [selectedDepartment]);


	const stopWorkRef = useRef(false);


	const closeWorkflow = () => {

		if (stopWorkRef.current) return;

		if (descriptionRef.current.trim() !== '')
			saveToDescription();

		dispatch(closeWorkflowThunk({
			workflow: {
				_id: incomingWorkID,
				currentDepartment: selectedDepartmentRef.current,
			}, myId: me._id as string,
		}));

		stopWorkRef.current = true;

		navigate('/main');
	};

	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {


		const handleKeyDown = (event: KeyboardEvent) => {
			if (!event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;

			if (event.key.toLowerCase() === 'enter') {
				closeWorkflow();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<>
			{
				workflowsObject[incomingWorkID] &&
				firmsObject &&
				modificationsObject &&
				typesOfWorkObject &&
				selectedDepartment !== '' &&
				<Box
					className={'display-flex flex-direction-column height-100'}
				>
					<Box
						boxShadow={3}
						className={'width-100 padding-1su box-sizing-border-box margin-bottom-2su border-radius-2su background-color-white justify-content-center display-flex flex-direction-row flex-wrap gap-1su'}
					>
						<Box>
							{getTitleByID(firmsObject, workflowsObject[incomingWorkID].firm)}
						</Box>
						<Box>
							№{getTitleByID(modificationsObject, workflowsObject[incomingWorkID].modification)},
						</Box>
						<Box>
							<strong>
								{getTitleByID(workflowsObject, incomingWorkID)}
							</strong>,
						</Box>
						<Box>
							<i>
								{getTitleByID(typesOfWorkObject, workflowsObject[incomingWorkID].type)}
							</i>
						</Box>

					</Box>
					<Box
						boxShadow={3}
						className={'display-flex flex-direction-row height-100 border-radius-2su background-color-white padding-2su box-sizing-border-box'}
					>
						<Box
							className={'flex-grow-1 padding-right-1su'}
						>
							<table className={'table-container'}>
								<tbody>
								<tr>
									<td className={'vertical-align-top'}>
							<pre
								className={'text-warp table-container box-sizing-border-box margin-top-0'}
							>
							{workflowsObject[incomingWorkID].description}
							</pre>
									</td>
								</tr>
								</tbody>
							</table>
						</Box>
						<Box
							className={'min-width-250px height-100 display-flex flex-direction-column'}
						>
							<table className={'just-table-container-pb0'}>
								<tbody>
								<tr>
									<td className={'vertical-align-top'}>

										<Box
											className={'height-100 display-flex flex-direction-column gap-4su'}
										>
											<Box
												className={'flex-grow-1 display-flex flex-direction-column'}
											>
											<textarea
												className={'outline-none shadow-inner height-100 width-100 border-none border-radius-10px padding-10px resize-none box-sizing-border-box'}
												value={description}
												onChange={(e) => setDescription(e.target.value)}
											/>
												<ContainedSmallButtonComponent
													className={'margin-top-0'}
													color={'primary'}
													disabled={description.length < 1}
													onClick={saveToDescription}
												>
													Добавить информацию в описание
												</ContainedSmallButtonComponent>
											</Box>
											<Box
												className={'shadow background-color-main padding-2su border-radius-2su'}
											>
												Пригласить присоединиться к работе<br />
												<FormControl
													variant="standard"
													className={'width-100'}
												>
													<Select
														value={selectedUser}
														onChange={(event) => {
															setSelectedUser(event.target.value);
														}}
													>
														{usersList.length > 0 && (
															usersList.map((item) => (
																<MenuItem
																	key={item.id}
																	value={item.id}
																>
																	{item.title}
																</MenuItem>
															))
														)
														}
													</Select>
												</FormControl>
												<ContainedSmallButtonComponent
													className={'width-100'}
													color={'success'}
													disabled={selectedUser == ''}
													onClick={inviteUser}
												>
													Пригласить
												</ContainedSmallButtonComponent>
											</Box>
											<Box>
												{
													selectedDepartment != 'justClose'
														? (<>
															Передать работу в:<br />
															<FormControl
																variant="standard"
																className={'width-100'}
															>
																<Select
																	value={selectedDepartment}
																	onChange={(event) => {
																		setSelectedDepartment(event.target.value);
																	}}
																>
																	{departmentsList.length > 0 && (
																		departmentsList.map((item) => (
																			<MenuItem
																				key={item.id}
																				value={item.id}
																			>
																				{item.title}
																			</MenuItem>
																		))
																	)
																	}
																</Select>
															</FormControl>
														</>)
														: (<>
															<Box>
																<h3>
																	Совместная работа
																</h3>
																<Typography>
																	Принимают участие:
																</Typography>
																{
																	workflowsObject[incomingWorkID].executors?.map((item, index) => (
																		<span
																			key={usersObject[item]._id}
																		>
																			{index > 0 && ', '}
																			{usersObject[item].name}
																		</span>
																	))
																}
															</Box>
														</>)
												}
												<ContainedSmallButtonComponent
													color={'error'}
													className={'width-100'}
													onClick={closeWorkflow}
												>
													<span>Завершить работу <small
														style={{ color: 'white' }}
														className={'color-my-light-gray'}
													>(ALT+Enter)</small></span>
												</ContainedSmallButtonComponent>
											</Box>
										</Box>
									</td>
								</tr>
								</tbody>
							</table>
						</Box>
					</Box>
				</Box>
			}
		</>
	);
}

export default WorkMyMainComponent;