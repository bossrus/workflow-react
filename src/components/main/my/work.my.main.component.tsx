import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';

interface IProps {
	work_id: string;
}

interface IList {
	id: string;
	title: string;
}

function WorkMyMainComponent({ work_id }: IProps) {

	const {
		me,
		typesOfWorkObject,
		firmsObject,
		modificationsObject,

		departmentsInWorkflowArray,
		usersArray,
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
			if (user._id !== me._id && user.departments.includes(me.currentDepartment))
				newUsers.push({
					title: user.name,
					id: user._id,
				});
		}
		setUsersList(newUsers);
	}, [usersArray, me.currentDepartment]);

	useEffect(() => {
		if (!me.currentDepartment || departmentsInWorkflowArray.length < 1 || !workflowsObject[work_id]) return;
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
		if (workflowsObject[work_id].executors!.length < 2) {
			console.log('а екзекуторов тута', workflowsObject[work_id].executors!.length);
			setSelectedDepartment(newDepartments[index + 1].id);
		} else {
			console.log('а тут вовсе даже совместное творчество');
			setSelectedDepartment('justClose');
		}
	}, [me.currentDepartment, departmentsInWorkflowArray, workflowsObject, me.currentWorkflowInWork]);

	const saveToDescription = () => {
		if (!description) return;
		(async () => {
			await axiosCreate.patch('/workflows/description/' + work_id, {
				text: description,
			});
		})();
		setDescription('');
	};

	const inviteUser = () => {
		(async () => {
			await axiosCreate.post('/invites', {
				from: me._id,
				to: selectedUser,
				workflow: work_id,
			});
		})();
		setSelectedUser('');
	};

	const closeWorkflow = () => {
		(async () => {
			await axiosCreate.patch('/workflows/close/' + work_id, {
				newDepartment: selectedDepartment,
			});
		})();
		setDescription('');
		navigate('/main');
	};

	return (
		<>
			{
				workflowsObject[work_id] &&
				firmsObject &&
				modificationsObject &&
				typesOfWorkObject &&
				selectedDepartment !== '' &&
				<Box display="flex" flexDirection="column" height="100%">
					<Box
						width={'100%'}
						p={1}
						boxSizing={'border-box'}
						mb={2}
						boxShadow={3} borderRadius={2}
						bgcolor={'white'}
						justifyContent={'center'}
						display={'flex'}
						flexDirection={'row'}
						flexWrap={'wrap'}
						gap={1}
					>
						<Box>
							{firmsObject[workflowsObject[work_id].firm].title}
						</Box>
						<Box>
							№{modificationsObject[workflowsObject[work_id].modification].title},
						</Box>
						<Box>
							<strong>
								{workflowsObject[work_id].title}
							</strong>,
						</Box>
						<Box>
							<i>
								{typesOfWorkObject[workflowsObject[work_id].type].title}
							</i>
						</Box>

					</Box>
					<Box display="flex" flexDirection="row" height="100%" boxShadow={3} borderRadius={2}
						 bgcolor={'white'} p={2} boxSizing={'border-box'}>
						<Box flexGrow={1} pr={1}>
							<table className={'table-container'}>
								<tbody>
								<tr>
									<td className={'align-top'}>
							<pre className={'warp-text table-container'}
								 style={{ boxSizing: 'border-box', marginTop: 0 }}>
							{workflowsObject[work_id].description}
							</pre>
									</td>
								</tr>
								</tbody>
							</table>
						</Box>
						<Box minWidth={'300px'} height={'100%'} display={'flex'}
							 flexDirection={'column'}>
							<table className={'just-table-container'}>
								<tbody>
								<tr>
									<td className={'align-top'}>

										<Box
											height={'100%'}
											display={'flex'}
											flexDirection={'column'}
											gap={3}
										>
											<Box
												flexGrow={1} display={'flex'}
												flexDirection={'column'}>
											<textarea
												className={'shadow-inner'}
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												style={{
													height: '100%',
													width: '100%',
													border: 'none',
													borderRadius: '10px',
													padding: '10px',
													resize: 'none',
													boxSizing: 'border-box',
													outline: 'none',
												}}
											/>
												<Button
													variant="contained"
													size="small"
													sx={{ mt: 2, borderRadius: '10px' }}
													fullWidth
													color={'primary'}
													className={'up-shadow'}
													disabled={description.length < 1}
													onClick={saveToDescription}
												>
													Добавить информацию в описание
												</Button>
											</Box>
											<Box className={'shadow'} p={2} bgcolor={'#fafafa'} borderRadius={2}>
												Пригласить присоединиться к работе<br />
												<FormControl variant="standard" fullWidth>
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
												<Button
													variant="contained"
													size="small"
													sx={{ mt: 2, borderRadius: '10px' }}
													fullWidth
													color={'success'}
													className={'up-shadow'}
													disabled={selectedUser == ''}
													onClick={inviteUser}
												>
													Пригласить
												</Button>
											</Box>
											<Box>
												{
													selectedDepartment != 'justClose' && (
														<>
															Передать работу в:<br />
															<FormControl variant="standard" fullWidth>
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
														</>
													)
												}
												<Button
													variant="contained"
													size="small"
													sx={{ mt: 2, borderRadius: '10px' }}
													fullWidth
													color={'error'}
													className={'up-shadow'}
													onClick={closeWorkflow}
												>
													Завершить работу
												</Button>
											</Box></Box>
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