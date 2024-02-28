import { Box, Button, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import SettingsHeaderComponent from '@/components/settings/settingsHeader.component.tsx';
import OneFirmComponent from '@/components/settings/firms/oneFirm.component.tsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IFirmUpdate } from '@/interfaces/firm.interface.ts';
import { deleteOne, patchOne } from '@/store/_api.slice.ts';
import makeSlug from '@/_services/makeSlug.ts';

function mainFirmsComponents() {
	const { firmsArray: firms } = useReduxSelectors();
	firms.sort((a, b) => +a.basicPriority - +b.basicPriority);
	const { firmsObject } = useReduxSelectors();
	const { currentFirm } = useReduxSelectors().states;
	const [title, setTitle] = useState('');
	const [basicPriority, setBasicPriority] = useState(50000);
	const [titleOfEditedFirm, setTitleOfEditedFirm] = useState('');
	const [stopSave, setStopSave] = useState(true);

	useEffect(() => {
		if (currentFirm) {
			setTitle(firmsObject[currentFirm].title);
			setTitleOfEditedFirm(firmsObject[currentFirm].title);
			setBasicPriority(firmsObject[currentFirm].basicPriority);
		}
	}, [currentFirm]);

	useEffect(() => {
		let canSave = false;
		let titleSlug = makeSlug(title);

		if (title !== '' && !firms.some(firm => (currentFirm !== undefined && firm._id !== currentFirm) && makeSlug(firm.title) === titleSlug)) {
			canSave = true;
			if (currentFirm !== undefined) {
				let currentFirmSlug = makeSlug(firmsObject[currentFirm].title);
				let isTitleChanged = titleSlug !== currentFirmSlug;
				let isBasicPriorityChanged = basicPriority !== firmsObject[currentFirm].basicPriority;
				canSave = isTitleChanged || isBasicPriorityChanged;
			}
		}

		console.log('canSave = ', canSave);
		setStopSave(!canSave);


	}, [title, basicPriority]);

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedFirm = (id: string | undefined) => {
		dispatch(setState({
			currentFirm: id,
		}));
		if (id === undefined) {
			setTitleOfEditedFirm('');
		}
	};

	const clearFields = () => {
		setTitle('');
		setBasicPriority(50000);
		setTitleOfEditedFirm('');
		setStopSave(true);
		changeEditedFirm(undefined);
	};

	const deleteFirm = (id: string) => {
		dispatch(deleteOne({ url: 'firms', id }));
	};

	const saveFirm = () => {
		const firm: IFirmUpdate = {};
		if (currentFirm !== undefined) {
			firm._id = currentFirm;
			if (title !== firmsObject[currentFirm].title) firm.title = title;
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
		<>
			<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2} bgcolor={'white'}>
				<Box p={2}>
					<SettingsHeaderComponent activeSettingsTab={'Клиенты'} />
				</Box>
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'align-top'}>
							<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
								 sx={{ height: '100%', alignContent: 'flex-start' }}>
								{
									firms.map((firm) =>
										<Box
											key={firm._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
											<OneFirmComponent
												deleteFirm={deleteFirm}
												currentFirm={currentFirm}
												changeEditedFirm={changeEditedFirm}
												firm={firm}
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
						titleOfEditedFirm !== '' && <>
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

								Редактирование клиента «<strong>{titleOfEditedFirm}</strong>»
							</Typography>
						</>
					}
					<TextField
						fullWidth
						id="title"
						label="Название клиента"
						variant="standard"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TextField type={'number'}
							   value={basicPriority}
							   onChange={(e) => setBasicPriority(+e.target.value)}
							   fullWidth
							   id="number-in-line"
							   label="Базовый приоритет клиента"
							   variant="standard" />
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
							: `Сохранить изменения в клиенте «${titleOfEditedFirm}»`

						}
					</Button>

					{titleOfEditedFirm !== '' &&
						<Button
							variant="contained"
							size="small"
							fullWidth
							sx={{ mt: 2, borderRadius: '10px' }}
							color={'info'}
							className={'up-shadow'}
							onClick={() => changeEditedFirm(undefined)}
						>
							отменить редактирование клиента «{titleOfEditedFirm}»
						</Button>}

				</Box>
			</Box>
		</>
	);
}

export default mainFirmsComponents;