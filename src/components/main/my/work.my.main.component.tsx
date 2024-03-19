import { Box, Button, FormControl, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IDepartment } from '@/interfaces/department.interface.ts';

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
		workflowsPublishedObject,
		typesOfWorkObject,
		firmsObject,
		modificationsObject,

		departmentsInWorkflowArray,
		usersArray,
	} = useReduxSelectors();

	const navigate = useNavigate();
	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {

	}, [workflowsPublishedObject]);

	const mag = firmsObject[workflowsPublishedObject[work_id].firm].title;
	const mod = modificationsObject[workflowsPublishedObject[work_id].modification].title;
	const type = typesOfWorkObject[workflowsPublishedObject[work_id].type].title;

	const [usersList, setUsersList] = useState<IList[]>([]);
	const [selectedUser, setSelectedUser] = useState<string>('');

	const [departmentsList, setDepartmentsList] = useState<IList[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<string>('');

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
		if (!me.currentDepartment || departmentsInWorkflowArray.length < 1) return;
		const newDepartments: IList[] = departmentsInWorkflowArray.map(({ _id, title }) => ({
			id: _id,
			title,
		}));
		if (me.canStartStopWorks) {
			newDepartments.push({
				title: 'Завершить заказ',
				id: 'Завершить заказ',
			});
		}
		const index = newDepartments.findIndex(department => department.id === me.currentDepartment);
		setSelectedDepartment(newDepartments[index + 1].id);
		setDepartmentsList(newDepartments);
	}, [me.currentDepartment, departmentsInWorkflowArray]);


	return (
		<>
			{
				workflowsPublishedObject[work_id] &&
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
							{mag}
						</Box>
						<Box>
							№{mod},
						</Box>
						<Box>
							<strong>
								{workflowsPublishedObject[work_id].title}
							</strong>,
						</Box>
						<Box>
							<i>
								{type}
							</i>
						</Box>

					</Box>
					<Box display="flex" flexDirection="row" height="100%" boxShadow={3} borderRadius={2}
						 bgcolor={'white'} p={2} boxSizing={'border-box'}>
						<Box flexGrow={1} pr={1}>
							<pre className={'warp-text'}>
							{workflowsPublishedObject[work_id].description}
							</pre>
						</Box>
						<Box minWidth={'300px'} height={'100%'} display={'flex'}
							 flexDirection={'column'} gap={6}>
							<Box flexGrow={1} display={'flex'}
								 flexDirection={'column'}>
								<textarea
									className={'shadow-inner'}
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
									// disabled={!anyTrueChecks}
									// onClick={publishWorks}
								>
									Добавить информацию в описание
								</Button>
							</Box>
							<Box>
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
									// onClick={publishWorks}
								>
									Пригласить
								</Button>
							</Box>
							<Box>
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
								<Button
									variant="contained"
									size="small"
									sx={{ mt: 2, borderRadius: '10px' }}
									fullWidth
									color={'error'}
									className={'up-shadow'}
									// disabled={!anyTrueChecks}
									// onClick={publishWorks}
								>
									Завершить работу
								</Button>
							</Box>

						</Box>
					</Box>
				</Box>
			}
		</>
	);
}

export default WorkMyMainComponent;