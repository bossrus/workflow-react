import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IModificationUpdate } from '@/interfaces/modification.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';
import HeaderEditFormSettingsComponent from '@/components/settings/_shared/header.editForm.settings.component.tsx';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';
import TitleWithHotkeyComponent from '@/components/_shared/titleWithHotkey.component.tsx';

const EditModificationFormModificationsComponent = () => {
	const { modificationsObject, states: { currentModification } } = useReduxSelectors();

	const [title, setTitle] = useState('');
	const [titleOfEditedModification, setTitleOfEditedModification] = useState('');
	const [stopSave, setStopSave] = useState(true);

	useEffect(() => {
		if (currentModification) {
			setTitle(modificationsObject[currentModification].title);
			setTitleOfEditedModification(modificationsObject[currentModification].title);
		}

	}, [currentModification]);

	useEffect(() => {
		let titleSlug = makeSlug(title.trim());

		const canSave = title !== ''
			&& !Object.values(modificationsObject).some(modification => makeSlug(modification.title.trim()) === titleSlug);

		setStopSave(!canSave);
	}, [title]);

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedModification = (id: string | undefined) => {
		dispatch(setState({
			currentModification: id,
		}));
		if (id === undefined) {
			setTitleOfEditedModification('');
		}
	};

	const clearFields = () => {
		setTitle('');
		setTitleOfEditedModification('');
		setStopSave(true);
		changeEditedModification(undefined);
		dispatch(setState({
			currentModification: undefined,
		}));
	};

	useEscapeKey(clearFields);

	const saveModification = () => {
		if (stopSave) return;
		const modification: IModificationUpdate = {
			title: title.trim(),
		};
		if (currentModification !== undefined) {
			modification._id = currentModification;
		}
		dispatch(patchOne({ url: 'modifications', data: modification }));
		clearFields();
	};

	return (
		<Box
			className={'padding-2su margin-2su in-depth border-round-1em'}
		>
			{
				titleOfEditedModification !== '' && <>
					<HeaderEditFormSettingsComponent

						stronger={titleOfEditedModification} title={'Редактирование номера журнала'} />
				</>
			}
			<TextField
				className={'width-100'}
				id="title"
				label="Номер журнала"
				variant="standard"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						saveModification();
					}
				}}
			/>
			{title && <>
				<ContainedSmallButtonComponent
					color={'success'}
					className={'width-100'}
					disabled={stopSave}
					onClick={saveModification}
				>
					{titleOfEditedModification === ''
						? 'Добавить новый номер журнала'
						: `Сохранить номер журнала «${titleOfEditedModification}»`
					}
				</ContainedSmallButtonComponent>
				<ContainedSmallButtonComponent
					color={'info'}
					className={'width-100'}
					onClick={() => changeEditedModification(undefined)}
				>
					<TitleWithHotkeyComponent
						title={titleOfEditedModification !== '' ? `отменить редактирование номера журнала «${titleOfEditedModification}»` : 'очистить поля'}
						hotkey={'ESC'}
					/>

				</ContainedSmallButtonComponent>
			</>
			}        </Box>
	);
};

export default EditModificationFormModificationsComponent;