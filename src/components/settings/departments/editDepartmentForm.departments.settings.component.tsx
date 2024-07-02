// src/components/settings/departments/editDepartmentForm.departments.settings.component.tsx

import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IDepartmentUpdate } from '@/interfaces/department.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';
import { FALSE_COLOR, MY_GREEN_COLOR } from '@/_constants/colors.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';
import HeaderEditFormSettingsComponent from '@/components/settings/_shared/header.editForm.settings.component.tsx';
import TitleWithHotkeyComponent from '@/components/_shared/titleWithHotkey.component.tsx';

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
		return () => {
			dispatch(setState({ currentDepartment: undefined }));
		};
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
		<Box
			className={'padding-2su margin-2su in-depth border-round-1em'}
		>
			{titleOfEditedDepartment !== '' && (
				<HeaderEditFormSettingsComponent
					title={'Редактирование отдела'}
					stronger={titleOfEditedDepartment}
				/>
			)}
			<TextField
				className={'width-100'}
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
			{title && <>
				<SwitchButtonComponent
					checkState={isUsedInWorkflow}
					changeChecked={setIsUsedInWorkflow}
					mode={'usual'}
					trueTitle={'Принимает участие в технологической цепочке'}
					falseTitle={'Не принимает участие в технологической цепочке'}
					falseBackgroundColor={FALSE_COLOR}
					trueBackgroundColor={MY_GREEN_COLOR}
				/>
				{isUsedInWorkflow && (
					<TextField
						type={'number'}
						value={numberInWorkflow}
						onChange={(e) => setNumberInWorkflow(e.target.value)}
						className={'width-100'}
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

				<ContainedSmallButtonComponent
					className={'width-100'}
					color={'success'}
					disabled={stopSave}
					onClick={saveDepartment}
				>
					{titleOfEditedDepartment === '' ? 'Добавить новый отдел' : `Сохранить отдел «${titleOfEditedDepartment}»`}
				</ContainedSmallButtonComponent>
				<ContainedSmallButtonComponent
					color={'info'}
					className={'width-100'}
					onClick={clearFields}
				>
					<TitleWithHotkeyComponent
						title={titleOfEditedDepartment !== '' ? `отменить редактирование отдела «${titleOfEditedDepartment}»` : 'очистить поля'}
						hotkey={'ESC'}
					/>
				</ContainedSmallButtonComponent>
			</>}
		</Box>
	);
};

export default EditDepartmentFormComponent;