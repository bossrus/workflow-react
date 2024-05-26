import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IModificationUpdate } from '@/interfaces/modification.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';

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
			p={2}
			m={2}
			className={'in-depth border-round-1em'}
		>
			{
				titleOfEditedModification !== '' && <>
					<Typography
						variant="h5"
						component="h2"
						color={'yellow'}
						sx={{
							mb: '1em',
							backgroundColor: '#0288d1',
							textAlign: 'center',
							borderRadius: '10px',
						}}>

						Редактирование номера журнала «<strong>{titleOfEditedModification}</strong>»
					</Typography>
				</>
			}
			<TextField
				fullWidth
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
			<Button
				variant="contained"
				size="small"
				fullWidth
				sx={{ mt: 2, borderRadius: '10px' }}
				color={'success'}
				className={'up-shadow'}
				disabled={stopSave}
				onClick={saveModification}
			>
				{titleOfEditedModification === ''
					? 'Добавить новый номер журнала'
					: `Сохранить номер журнала «${titleOfEditedModification}»`
				}
			</Button>

			{titleOfEditedModification !== '' &&
				<Button
					variant="contained"
					size="small"
					fullWidth
					sx={{ mt: 2, borderRadius: '10px' }}
					color={'info'}
					className={'up-shadow'}
					onClick={() => changeEditedModification(undefined)}
				>
					отменить редактирование номера журнала «{titleOfEditedModification}»
				</Button>}
		</Box>
	);
};

export default EditModificationFormModificationsComponent;