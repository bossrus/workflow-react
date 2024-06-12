import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IFirmUpdate } from '@/interfaces/firm.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import useEscapeKey from '@/_hooks/useEscapeKey.hook.ts';
import makeSlug from '@/_services/makeSlug.service.ts';

function EditFirmFormComponent() {
	const { firmsObject, states: { currentFirm } } = useReduxSelectors();
	const [title, setTitle] = useState('');
	const [basicPriority, setBasicPriority] = useState(50000);
	const [titleOfEditedFirm, setTitleOfEditedFirm] = useState('');
	const [stopSave, setStopSave] = useState(true);

	const setStates = () => {
		if (currentFirm) {
			setTitle(firmsObject[currentFirm].title);
			setTitleOfEditedFirm(firmsObject[currentFirm].title);
			setBasicPriority(firmsObject[currentFirm].basicPriority);
		}
	};

	useEffect(() => {
		setStates();
	}, [currentFirm, firmsObject]);

	const shouldAllowSave = (
		title: string,
		basicPriority: number,
		currentFirm: string | undefined,
		firmsObject: {
			[key: string]: { title: string; basicPriority: number }
		},
	): boolean => {
		if (title.trim() === '') {
			return false;
		}

		const titleSlug = makeSlug(title);

		let result: boolean;
		if (currentFirm !== undefined) {
			const currentFirmSlug = makeSlug(firmsObject[currentFirm].title);

			const isTitleChanged = titleSlug !== currentFirmSlug;
			const isBasicPriorityChanged = basicPriority !== firmsObject[currentFirm].basicPriority;

			result = isTitleChanged || isBasicPriorityChanged;

		} else {
			result = !Object.values(firmsObject).some((firm) => makeSlug(firm.title) === titleSlug);
		}
		return result;
	};

	useEffect(() => {
		const canSave = shouldAllowSave(title, basicPriority, currentFirm, firmsObject);
		setStopSave(!canSave);
	}, [title, basicPriority, currentFirm, firmsObject]);
	;

	const dispatch = useDispatch<TAppDispatch>();

	const clearFields = () => {
		setTitle('');
		setBasicPriority(50000);
		setTitleOfEditedFirm('');
		setStopSave(true);
		dispatch(setState({ currentFirm: undefined }));
	};

	useEscapeKey(clearFields);

	const saveFirm = () => {
		if (stopSave) return;
		const firm: IFirmUpdate = {};
		if (currentFirm !== undefined) {
			firm._id = currentFirm;
			if (title !== firmsObject[currentFirm].title) firm.title = title.trim();
			if (basicPriority !== firmsObject[currentFirm].basicPriority) {
				firm.basicPriority = basicPriority;
			}
		} else {
			firm.title = title;
			firm.basicPriority = basicPriority;
		}
		dispatch(patchOne({ url: 'firms', data: firm }));
		clearFields();
	};

	return (
		<Box p={2} m={2} className={'in-depth border-round-1em'}>
			{titleOfEditedFirm !== '' && (
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
					Редактирование клиента «<strong>{titleOfEditedFirm}</strong>»
				</Typography>
			)}
			<TextField
				fullWidth
				id="title"
				label="Название клиента"
				variant="standard"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						saveFirm();
					}
				}}
			/>
			<TextField
				type={'number'}
				value={basicPriority}
				onChange={(e) => setBasicPriority(+e.target.value)}
				fullWidth
				id="number-in-line"
				label="Базовый приоритет клиента"
				variant="standard"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						saveFirm();
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
				onClick={saveFirm}
			>
				{titleOfEditedFirm === ''
					? 'Добавить нового клиента'
					: `Сохранить изменения в клиенте «${titleOfEditedFirm}»`}
			</Button>

			{titleOfEditedFirm !== '' && (
				<Button
					variant="contained"
					size="small"
					fullWidth
					sx={{ mt: 2, borderRadius: '10px' }}
					color={'info'}
					className={'up-shadow'}
					onClick={clearFields}
				>
					отменить редактирование клиента «{titleOfEditedFirm}»
				</Button>
			)}
		</Box>
	);
}

export default EditFirmFormComponent;