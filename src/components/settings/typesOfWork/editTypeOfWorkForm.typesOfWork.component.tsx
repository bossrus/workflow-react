import { Box, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { ITypeOfWorkUpdate } from '@/interfaces/worktype.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';
import HeaderEditFormSettingsComponent from '@/components/settings/_shared/header.editForm.settings.component.tsx';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';
import TitleWithHotkeyComponent from '@/components/_shared/titleWithHotkey.component.tsx';

const EditTypeOfWorkFormTypesOfWorkComponent: React.FC = () => {
	const { typesOfWorkArray: typesOfWork, typesOfWorkObject, states: { currentTypeOfWork } } = useReduxSelectors();
	const [title, setTitle] = useState('');
	const [titleOfEditedTypeOfWork, setTitleOfEditedTypeOfWork] = useState('');
	const [stopSave, setStopSave] = useState(true);

	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {
		if (currentTypeOfWork) {
			setTitle(typesOfWorkObject[currentTypeOfWork].title);
			setTitleOfEditedTypeOfWork(typesOfWorkObject[currentTypeOfWork].title);
		}
		return () => {
			dispatch(setState({ currentTypeOfWork: undefined }));
		};
	}, [currentTypeOfWork]);

	useEffect(() => {
		let titleSlug = makeSlug(title.trim());
		const canSave = (title.trim() !== '' && !typesOfWork.some(typeOfWork => makeSlug(typeOfWork.title) === titleSlug));
		setStopSave(!canSave);
	}, [title, typesOfWork]);


	const clearFields = () => {
		setTitle('');
		setTitleOfEditedTypeOfWork('');
		setStopSave(true);
		dispatch(setState({ currentTypeOfWork: undefined }));
		setTitleOfEditedTypeOfWork('');
	};

	useEscapeKey(clearFields);

	const saveTypeOfWork = () => {
		if (stopSave) return;
		const typeOfWork: ITypeOfWorkUpdate = { title: title.trim() };
		if (currentTypeOfWork !== undefined) {
			typeOfWork._id = typesOfWorkObject[currentTypeOfWork]._id;
		}
		dispatch(patchOne({ url: 'typesOfWork', data: typeOfWork }));
		clearFields();
	};

	return (
		<Box
			className={'padding-2su margin-2su in-depth border-round-1em'}
		>
			{titleOfEditedTypeOfWork !== '' && (
				<HeaderEditFormSettingsComponent
					title={`Редактирование типа работ`}
					stronger={titleOfEditedTypeOfWork}
				/>
			)}
			<TextField
				className={'width-100'}
				id="title"
				label="Название типа работ"
				variant="standard"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						saveTypeOfWork();
					}
				}}
			/>
			{title && <>
				<ContainedSmallButtonComponent
					color={'success'}
					className={'width-100'}
					disabled={stopSave}
					onClick={saveTypeOfWork}
				>
					{titleOfEditedTypeOfWork === '' ? 'Добавить новый тип работ' : `Сохранить изменения в «${titleOfEditedTypeOfWork}»`}
				</ContainedSmallButtonComponent>
				<ContainedSmallButtonComponent
					color={'info'}
					className={'width-100'}
					onClick={clearFields}
				>
					<TitleWithHotkeyComponent
						title={titleOfEditedTypeOfWork !== '' ? `отменить редактирование типа работ «${titleOfEditedTypeOfWork}»` : 'очистить поля'}
						hotkey={'ESC'} />
				</ContainedSmallButtonComponent>
			</>
			}        </Box>
	);
};

export default EditTypeOfWorkFormTypesOfWorkComponent;