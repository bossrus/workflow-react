import { Box, Button, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneModificationComponent from '@/components/settings/modifications/oneModification.component.tsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { IModificationUpdate } from '@/interfaces/modification.interface.ts';
import { deleteOne, patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.ts';

function MainModificationsComponents() {
	const { modificationsArray: modifications } = useReduxSelectors();
	const { modificationsObject } = useReduxSelectors();
	const { currentModification } = useReduxSelectors().states;
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
		let titleSlug = makeSlug(title);

		const canSave = title !== ''
			&& !modifications.some(modification => makeSlug(modification.title) === titleSlug);

		console.log('canSave = ', canSave);
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
	};

	const deleteModification = (id: string) => {
		dispatch(deleteOne({ url: 'modifications', id }));
	};

	const saveModification = () => {
		const modification: IModificationUpdate = {
			title: title,
		};
		if (currentModification !== undefined) {
			modification._id = currentModification;
		}
		dispatch(patchOne({ url: 'modifications', data: modification }));
		clearFields();
	};

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
									modifications.map((modification) =>
										<Box
											key={modification._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
											<OneModificationComponent
												deleteModification={deleteModification}
												currentModification={currentModification}
												changeEditedModification={changeEditedModification}
												modification={modification}
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
						titleOfEditedModification !== '' && <>
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
			</Box>
		</>
	);
}

export default MainModificationsComponents;