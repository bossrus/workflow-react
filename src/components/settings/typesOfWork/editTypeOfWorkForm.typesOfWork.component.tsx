import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { ITypeOfWorkUpdate } from '@/interfaces/worktype.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.service.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';

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
		<Box p={2} m={2} className={'in-depth border-round-1em'}>
			{titleOfEditedTypeOfWork !== '' && (
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
					Редактирование типа работ «<strong>{titleOfEditedTypeOfWork}</strong>»
				</Typography>
			)}
			<TextField
				fullWidth
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
			<Button
				variant="contained"
				size="small"
				fullWidth
				sx={{ mt: 2, borderRadius: '10px' }}
				color={'success'}
				className={'up-shadow'}
				disabled={stopSave}
				onClick={saveTypeOfWork}
			>
				{titleOfEditedTypeOfWork === '' ? 'Добавить новый тип работ' : `Сохранить изменения в «${titleOfEditedTypeOfWork}»`}
			</Button>
			{titleOfEditedTypeOfWork !== '' && (
				<Button
					variant="contained"
					size="small"
					fullWidth
					sx={{ mt: 2, borderRadius: '10px' }}
					color={'info'}
					className={'up-shadow'}
					onClick={clearFields}
				>
					отменить редактирование типа работ «{titleOfEditedTypeOfWork}»
				</Button>
			)}
		</Box>
	);
};

export default EditTypeOfWorkFormTypesOfWorkComponent;