// src/components/settings/departments/editDepartmentForm.departments.component.tsx

import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IDepartmentUpdate } from '@/interfaces/department.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';
import { FALSE_COLOR } from '@/_constants/colors.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';

const EditDepartmentFormComponent = () => {
	const { departmentsObject, states: { currentDepartment } } = useReduxSelectors();
	const [title, setTitle] = useState('');
	const [numberInWorkflow, setNumberInWorkflow] = useState('');
	const [isUsedInWorkflow, setIsUsedInWorkflow] = useState(true);
	const [titleOfEditedDepartment, setTitleOfEditedDepartment] = useState('');
	const [stopSave, setStopSave] = useState(true);

	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {
		if (currentDepartment) {
			const localDepartment = departmentsObject[currentDepartment];
			setTitle(localDepartment.title);
			setTitleOfEditedDepartment(localDepartment.title);
			setNumberInWorkflow(localDepartment.numberInWorkflow);
			setIsUsedInWorkflow(localDepartment.isUsedInWorkflow);
		}
	}, [currentDepartment, departmentsObject]);

	useEffect(() => {
		let canSave = false;

		if (title.trim() !== '') {
			let isNumber = !isNaN(parseFloat(numberInWorkflow));
			let titleSlug = makeSlug(title.trim());
			if (currentDepartment !== undefined) {
				let currentDepartmentSlug = makeSlug(departmentsObject[currentDepartment].title);
				let isTitleChanged = titleSlug !== currentDepartmentSlug;
				let isUsedInWorkflowChanged = isUsedInWorkflow !== departmentsObject[currentDepartment].isUsedInWorkflow;
				let isNumberInWorkflowChanged = isUsedInWorkflow && isNumber && numberInWorkflow !== departmentsObject[currentDepartment].numberInWorkflow;

				canSave = isTitleChanged || (isUsedInWorkflowChanged && (!isUsedInWorkflow || (isUsedInWorkflow && isNumber))) || isNumberInWorkflowChanged;
			} else {
				const isTitleDuplicate = Object.values(departmentsObject).some(department => makeSlug(department.title) === titleSlug);
				canSave = !isTitleDuplicate && (!isUsedInWorkflow || (isUsedInWorkflow && isNumber));
			}
		}
		setStopSave(!canSave);
	}, [title, numberInWorkflow, isUsedInWorkflow, currentDepartment, departmentsObject]);

	const clearFields = () => {
		setTitle('');
		setNumberInWorkflow('');
		setIsUsedInWorkflow(true);
		setTitleOfEditedDepartment('');
		setStopSave(true);
		dispatch(setState({ currentDepartment: undefined }));
	};

	useEscapeKey(clearFields);

	const saveDepartment = () => {
		if (stopSave) return;
		const department: IDepartmentUpdate = {};
		if (currentDepartment !== undefined) {
			const currentDept = departmentsObject[currentDepartment];
			department._id = currentDept._id;
			if (title !== currentDept.title) department.title = title.trim();
			if (isUsedInWorkflow !== currentDept.isUsedInWorkflow) {
				department.isUsedInWorkflow = isUsedInWorkflow;
				department.numberInWorkflow = isUsedInWorkflow ? numberInWorkflow : 'notUsedInWorkflow';
			}
			if (isUsedInWorkflow && numberInWorkflow !== currentDept.numberInWorkflow) {
				department.numberInWorkflow = numberInWorkflow;
			}
		} else {
			department.title = title.trim();
			department.isUsedInWorkflow = isUsedInWorkflow;
			department.numberInWorkflow = isUsedInWorkflow ? numberInWorkflow : 'notUsedInWorkflow';
		}
		dispatch(patchOne({ url: 'departments', data: department }));
		clearFields();
	};

	return (
		<Box p={2} m={2} className={'in-depth border-round-1em'}>
			{titleOfEditedDepartment !== '' && (
				<Typography
					variant="h5"
					component="h2"
					color={'yellow'}
					sx={{
						mb: '1em',
						backgroundColor: '#0288d1',
						textAlign: 'center',
						borderRadius: '10px',
					}}
				>
					Редактирование отдела «<strong>{titleOfEditedDepartment}</strong>»
				</Typography>
			)}
			<TextField
				fullWidth
				id="title"
				label="Название отдела"
				variant="standard"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						saveDepartment();
					}
				}}
			/>
			<SwitchButtonComponent
				checkState={isUsedInWorkflow}
				changeChecked={setIsUsedInWorkflow}
				mode={'usual'}
				trueTitle={'Принимает участие в технологической цепочке'}
				falseTitle={'Не принимает участие в технологической цепочке'}
				falseBackgroundColor={FALSE_COLOR}
				trueBackgroundColor={'green'}
			/>
			{isUsedInWorkflow && (
				<TextField
					type={'number'}
					value={numberInWorkflow}
					onChange={(e) => setNumberInWorkflow(e.target.value)}
					fullWidth
					id="number-in-line"
					label="Номер отдела в технологической цепочке"
					variant="standard"
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							saveDepartment();
						}
					}}
				/>
			)}
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
				{titleOfEditedDepartment === '' ? 'Добавить новый отдел' : `Сохранить отдел «${titleOfEditedDepartment}»`}
			</Button>

			{titleOfEditedDepartment !== '' && (
				<Button
					variant="contained"
					size="small"
					fullWidth
					sx={{ mt: 2, borderRadius: '10px' }}
					color={'info'}
					className={'up-shadow'}
					onClick={clearFields}
				>
					отменить редактирование отдела «{titleOfEditedDepartment}»
				</Button>
			)}
		</Box>
	);
};

export default EditDepartmentFormComponent;