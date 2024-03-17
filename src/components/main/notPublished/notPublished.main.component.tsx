import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box, Button } from '@mui/material';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import axiosCreate from '@/_api/axiosCreate.ts';
import { useNavigate } from 'react-router-dom';

function NotPublishedMainComponent() {
	const {
		workflowsNotPublishedObject,
		typesOfWorkObject,
		departmentsObject,
		firmsObject,
		modificationsObject,
		usersObject,
		me,
	} = useReduxSelectors();

	const [checks, setChecks] = useState<Record<string, boolean>>({});
	const [myChecks, setMyChecks] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const keys = Object.keys(workflowsNotPublishedObject);
		if (keys.length <= 0) return;
		const allChecks: Record<string, boolean> = {};
		const allMyChecks: Record<string, boolean> = {};
		console.log('me = ', me, ':');
		keys.map((key) => {
			allChecks[key] = false;
			console.log('\t', workflowsNotPublishedObject[key].whoAddThisWorkflow);
			if (me._id === workflowsNotPublishedObject[key].whoAddThisWorkflow) {
				console.log('присваиваем');
				allMyChecks[key] = false;
			}
		});
		setChecks(allChecks);
		setMyChecks(allMyChecks);
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
		setTimeout(() => {
			const myTrue = Object.values(myChecks).every(value => value);
			const allTrue = Object.values(checks).every(value => value);
			const anyTrue = Object.values(checks).some(value => value);
			console.log('myTrue = «', myTrue, '» \tallTrue = «', allTrue, '»');
			setAllMyTrueChecks(myTrue);
			setAllTrueChecks(allTrue);
			setAnyTrueChecks(anyTrue);
		}, 0);
	};
	// const checkUncheckMyWorks = () => {
	// 	console.log('входим в отметку');
	//
	// 	const allMyChecks: Record<string, boolean> = JSON.parse(JSON.stringify(myChecks));
	// 	const allChecks: Record<string, boolean> = JSON.parse(JSON.stringify(checks));
	// 	if (allMyTrueChecks) {
	// 		for (let key in allMyChecks) {
	// 			allMyChecks[key] = false;
	// 			allChecks[key] = false;
	// 		}
	// 	} else {
	// 		for (let key in allMyChecks) {
	// 			allMyChecks[key] = true;
	// 			allChecks[key] = true;
	// 		}
	// 	}
	// 	setMyChecks(allMyChecks);
	// 	setChecks(allChecks);
	// 	setAllTrue();
	// };
	// const checkUncheckAllWorks = () => {
	// 	console.log('входим в отметку');
	// 	const allMyChecks: Record<string, boolean> = JSON.parse(JSON.stringify(myChecks));
	// 	const allChecks: Record<string, boolean> = JSON.parse(JSON.stringify(checks));
	// 	if (allTrueChecks) {
	// 		for (let key in allChecks) {
	// 			allChecks[key] = false;
	// 			if (allMyChecks[key] !== undefined) allMyChecks[key] = false;
	// 		}
	// 	} else {
	// 		for (let key in allChecks) {
	// 			allChecks[key] = true;
	// 			if (allMyChecks[key] !== undefined) allMyChecks[key] = true;
	// 		}
	// 	}
	// 	setMyChecks(allMyChecks);
	// 	setChecks(allChecks);
	// 	setAllTrue();
	// };

	const checkUncheckMyWorks = () => {
		console.log('входим в отметку');

		const allMyChecks: Record<string, boolean> = Object.keys(myChecks).reduce((acc, key) => ({
			...acc,
			[key]: !allMyTrueChecks,
		}), {});
		const allChecks: Record<string, boolean> = Object.keys(checks).reduce((acc, key) => ({
			...acc,
			[key]: !allMyTrueChecks,
		}), {});

		setMyChecks(allMyChecks);
		setChecks(allChecks);
		setAllTrue();
	};

	const checkUncheckAllWorks = () => {
		console.log('входим в отметку');

		const allMyChecks: Record<string, boolean> = Object.keys(myChecks).reduce((acc, key) => ({
			...acc,
			[key]: !allTrueChecks,
		}), {});
		const allChecks: Record<string, boolean> = Object.keys(checks).reduce((acc, key) => ({
			...acc,
			[key]: !allTrueChecks,
		}), {});

		setMyChecks(allMyChecks);
		setChecks(allChecks);
		setAllTrue();
	};


	const navigate = useNavigate();
	const editWorkflow = (id: string) => {
		navigate(`/main/create/${id}`);
	};

	function publishWorks() {
		const data: string[] = [];
		for (let key in checks) {
			if (checks[key]) {
				data.push(key);
			}
		}
		const result = axiosCreate.patch('/workflows/publish', { ids: data });
		console.log('опубликовали, вроде', result);
	}

	const [showDescription, setShowDescription] = useState<string>('');
	const show = (id: string = '') => {
		setShowDescription(id);
	};

	return (
		<>
			{
				Object.keys(workflowsNotPublishedObject).length > 0 &&
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
											Object.keys(workflowsNotPublishedObject).length > 0 &&
											Object.keys(workflowsNotPublishedObject).map((key) => (
												<Box key={key} display="flex"
													 flexDirection="row"
													 width={'100%'}
													 boxShadow={2}
													 p={1}
													 bgcolor={'white'}
													 borderRadius={2}
													 boxSizing={'border-box'}
													 gap={2}
													 alignItems={'center'}
													 flexWrap={'wrap'}
													 onMouseOver={() => show(key)}
													 onMouseOut={() => show()}
												>
													<Box>
														<Checkbox checked={checks[key]}
																  onChange={() => changeChecked(key)} />
														{usersObject[workflowsNotPublishedObject[key].whoAddThisWorkflow] ? usersObject[workflowsNotPublishedObject[key].whoAddThisWorkflow].name : 'тютю'}
													</Box>
													<Box flexGrow={1}>
														<strong>{workflowsNotPublishedObject[key].title}</strong>
													</Box>
													<Box flexGrow={1}>
														<Box>
															{firmsObject[workflowsNotPublishedObject[key].firm].title}
														</Box>
														<Box>
															№ {modificationsObject[workflowsNotPublishedObject[key].modification].title}
														</Box>
													</Box>
													<Box flexGrow={1}>
														<Box>
															<i>{typesOfWorkObject[workflowsNotPublishedObject[key].type].title}</i>
														</Box>
														<Box>
															{departmentsObject[workflowsNotPublishedObject[key].currentDepartment].title}
														</Box>
													</Box>
													<Box flexGrow={1}>
														<Box>
															количество
															картинок {workflowsNotPublishedObject[key].countPictures} шт.
														</Box>
														<Box>
															количество
															страниц {workflowsNotPublishedObject[key].countPages} шт.
														</Box>
													</Box>
													<Box alignItems={'end'}>
														<EditButtonComponent id={key}
																			 dis={false}
																			 onClickHere={editWorkflow} />
													</Box>
													{key === showDescription &&
														<Box>
															{workflowsNotPublishedObject[key].description}
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
								{allTrueChecks ? 'Снять выделение со всех работ' : 'Выделить все работы'}
							</Button>
							<Button
								variant="outlined"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'inherit'}
								className={'up-shadow'}
								onClick={checkUncheckMyWorks}
							>
								{allMyTrueChecks ? 'Снять выделение со всех ваших работ' : 'Выделить все ваши работы'}
							</Button>
							<Button
								variant="contained"
								size="small"
								sx={{ mt: 2, borderRadius: '10px', flexGrow: 1 }}
								color={'success'}
								className={'up-shadow'}
								disabled={!anyTrueChecks}
								onClick={publishWorks}
							>
								Опубликовать выделенные работы
							</Button>

						</Box>
					</Box>
				</Box>}
		</>
	);
}

export default NotPublishedMainComponent;