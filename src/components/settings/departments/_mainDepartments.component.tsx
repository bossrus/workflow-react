import { Box, Button, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneDepartmentComponent from '@/components/settings/departments/oneDepartment.component.tsx';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IDepartment, IDepartmentUpdate } from '@/interfaces/department.interface.ts';
import { deleteOne, patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.ts';

const FALSE_COLOR = '#92a38f';

function MainDepartmentsComponents() {
	const { departmentsArray } = useReduxSelectors();
	const [departments, setDepartments] = useState<IDepartment[]>([]);
	const { departmentsObject } = useReduxSelectors();
	const { currentDepartment } = useReduxSelectors().states;
	const [title, setTitle] = useState('');
	const [numberInWorkflow, setNumberInWorkflow] = useState('');
	const [isUsedInWorkflow, setIsUsedInWorkflow] = useState(true);
	const [switchLabel, setSwitchLabel] = useState('');
	const [titleOfEditedDepartment, setTitleOfEditedDepartment] = useState('');
	const [stopSave, setStopSave] = useState(true);

	useEffect(() => {
		const newDepartments = [...departmentsArray];
		newDepartments.sort((a, b) => {
			const numA = isNaN(Number(a.numberInWorkflow)) ? Infinity : +a.numberInWorkflow;
			const numB = isNaN(Number(b.numberInWorkflow)) ? Infinity : +b.numberInWorkflow;
			return numA - numB;
		});
		console.log('после сортировки newDepartments = ', newDepartments);
		setDepartments(newDepartments);
	}, [departmentsArray]);

	useEffect(() => {
		if (currentDepartment) {
			setTitle(departmentsObject[currentDepartment].title);
			setTitleOfEditedDepartment(departmentsObject[currentDepartment].title);
			setNumberInWorkflow(departmentsObject[currentDepartment].numberInWorkflow);
			setIsUsedInWorkflow(departmentsObject[currentDepartment].isUsedInWorkflow);
		}
	}, [currentDepartment]);

	useEffect(() => {
		let canSave = false;
		let isNumber = !isNaN(parseFloat(numberInWorkflow));
		let titleSlug = makeSlug(title);

		if (title !== '' && !departments.some(department => (currentDepartment !== undefined && department._id !== currentDepartment) && makeSlug(department.title) === titleSlug)) {
			if (currentDepartment !== undefined) {
				let currentDepartmentSlug = makeSlug(departmentsObject[currentDepartment].title);
				let isTitleChanged = titleSlug !== currentDepartmentSlug;
				let isUsedInWorkflowChanged = isUsedInWorkflow !== departmentsObject[currentDepartment].isUsedInWorkflow;
				let isNumberInWorkflowChanged = isUsedInWorkflow && isNumber && numberInWorkflow !== departmentsObject[currentDepartment].numberInWorkflow;

				canSave = isTitleChanged || (isUsedInWorkflowChanged && (!isUsedInWorkflow || (isUsedInWorkflow && isNumber))) || isNumberInWorkflowChanged;
			} else {
				canSave = !isUsedInWorkflow || (isUsedInWorkflow && isNumber && numberInWorkflow !== '');
			}
		}

		console.log('canSave = ', canSave);
		setStopSave(!canSave);


	}, [title, numberInWorkflow, isUsedInWorkflow]);

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedDepartment = (id: string | undefined) => {
		dispatch(setState({
			currentDepartment: id,
		}));
		if (id === undefined) {
			setTitleOfEditedDepartment('');
		}
	};

	const clearFields = () => {
		setTitle('');
		setNumberInWorkflow('');
		setIsUsedInWorkflow(true);
		setTitleOfEditedDepartment('');
		setStopSave(true);
		changeEditedDepartment(undefined);
	};

	const deleteDepartment = (id: string) => {
		dispatch(deleteOne({ url: 'departments', id }));
	};

	const saveDepartment = () => {
		const department: IDepartmentUpdate = {};
		if (currentDepartment !== undefined) {
			department._id = departmentsObject[currentDepartment]._id;
			if (title !== departmentsObject[currentDepartment].title) department.title = title;
			if (isUsedInWorkflow !== departmentsObject[currentDepartment].isUsedInWorkflow) {
				department.isUsedInWorkflow = isUsedInWorkflow;
				department.numberInWorkflow = isUsedInWorkflow ? numberInWorkflow : 'notUsedInWorkflow';
			}
			if (isUsedInWorkflow && numberInWorkflow !== departmentsObject[currentDepartment].numberInWorkflow) {
				department.numberInWorkflow = numberInWorkflow;
			}
		} else {
			department.title = title;
			department.isUsedInWorkflow = isUsedInWorkflow;
			console.log('isUsedInWorkflow = ', isUsedInWorkflow);
			department.numberInWorkflow = isUsedInWorkflow ? numberInWorkflow : 'notUsedInWorkflow';
		}
		dispatch(patchOne({ url: 'departments', data: department }));
		clearFields();
	};
	useEffect(() => {
		const label = isUsedInWorkflow
			? 'Принимает участие в технологической цепочке'
			: 'Не принимает участие в технологической цепочке';

		setSwitchLabel(label);

	}, [isUsedInWorkflow]);

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%">
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'align-top'}>
							<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
								 sx={{ height: '100%', alignContent: 'flex-start' }}>
								{
									departments.map((department) =>
										<Box
											key={department._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
											<OneDepartmentComponent
												deleteDepartment={deleteDepartment}
												currentDepartment={currentDepartment}
												changeEditedDepartment={changeEditedDepartment}
												department={department}
											/>
										</Box>,
									)
								}
							</Box>
						</td>
					</tr>
					</tbody>
				</table>
				<Box
					p={2}
					m={2}
					className={'in-depth border-round-1em'}
				>
					{
						titleOfEditedDepartment !== '' && <>
							<Typography
								variant="h5"
								component="h2"
								color={'yellow'}
								sx={{
									mb: '1em',
									backgroundColor: '#0288d1', // Замените #color на желаемый цвет фона
									textAlign: 'center',
									borderRadius: '10px',
								}}>

								Редактирование отдела «<strong>{titleOfEditedDepartment}</strong>»
							</Typography>
						</>
					}
					<TextField
						fullWidth
						id="title"
						label="Название отдела"
						variant="standard"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<FormGroup>
						<FormControlLabel
							control={
								<MaterialUISwitch
									sx={{ m: 1 }}
									icon={
										<SwitchStyledIcon
											sx={{ backgroundColor: FALSE_COLOR }}
										>
											<CancelOutlinedIcon
												sx={{ color: 'black' }}
											/>
										</SwitchStyledIcon>
									}
									checkedIcon={
										<SwitchStyledIcon
											sx={{ backgroundColor: 'green' }}
										>
											<CheckCircleOutlineIcon
												sx={{ color: 'white' }}
											/>
										</SwitchStyledIcon>
									}
								/>
							}
							label={<Typography
								sx={{
									fontWeight: 'bold',
									color: isUsedInWorkflow ? 'green' : FALSE_COLOR,
								}}
							>
								{switchLabel}
							</Typography>}
							checked={isUsedInWorkflow}
							onChange={(_event, checked) => setIsUsedInWorkflow(checked)}
						/>
					</FormGroup>
					{isUsedInWorkflow &&
						<TextField type={'number'}
								   value={numberInWorkflow}
								   onChange={(e) => setNumberInWorkflow(e.target.value)}
								   fullWidth
								   id="number-in-line"
								   label="Номер отдела в технологической цепочке"
								   variant="standard" />}
					<Button
						variant="contained"
						size="small"
						fullWidth
						sx={{ mt: 2, borderRadius: '10px' }}
						color={'success'}
						className={'up-shadow'}
						disabled={stopSave}
						onClick={saveDepartment}
					>
						{titleOfEditedDepartment === ''
							? 'Добавить новый отдел'
							: `Сохранить отдел «${titleOfEditedDepartment}»`

						}
					</Button>

					{titleOfEditedDepartment !== '' &&
						<Button
							variant="contained"
							size="small"
							fullWidth
							sx={{ mt: 2, borderRadius: '10px' }}
							color={'info'}
							className={'up-shadow'}
							onClick={() => changeEditedDepartment(undefined)}
						>
							отменить редактирование отдела «{titleOfEditedDepartment}»
						</Button>}

				</Box>
			</Box>
		</>
	);
}

export default MainDepartmentsComponents;