import { Box, Button, TextField, Typography } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneTypeOfWorkComponent from '@/components/settings/typesOfWork/oneTypeOfWork.component.tsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { ITypeOfWorkUpdate } from '@/interfaces/worktype.interface.ts';
import { deleteOne, patchOne } from '@/store/_shared.thunks.ts';
import makeSlug from '@/_services/makeSlug.service.ts';

function MainTypesOfWorkComponents() {
	const { typesOfWorkArray: typesOfWork } = useReduxSelectors();
	const { typesOfWorkObject: typesOfWorkObject } = useReduxSelectors();
	const { currentTypeOfWork } = useReduxSelectors().states;
	const [title, setTitle] = useState('');
	const [titleOfEditedTypeOfWork, setTitleOfEditedTypeOfWork] = useState('');
	const [stopSave, setStopSave] = useState(true);

	useEffect(() => {
		if (currentTypeOfWork) {
			setTitle(typesOfWorkObject[currentTypeOfWork].title);
			setTitleOfEditedTypeOfWork(typesOfWorkObject[currentTypeOfWork].title);
		}
	}, [currentTypeOfWork]);

	useEffect(() => {
		let titleSlug = makeSlug(title);

		const canSave = (title !== '' && !typesOfWork.some(typeOfWork => makeSlug(typeOfWork.title) === titleSlug));

		// console.log('canSave = ', canSave);
		setStopSave(!canSave);


	}, [title]);

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedTypeOfWork = (id: string | undefined) => {
		dispatch(setState({
			currentTypeOfWork: id,
		}));
		if (id === undefined) {
			setTitleOfEditedTypeOfWork('');
		}
	};

	const clearFields = () => {
		setTitle('');
		setTitleOfEditedTypeOfWork('');
		setStopSave(true);
		changeEditedTypeOfWork(undefined);
	};

	const deleteTypeOfWork = (id: string) => {
		dispatch(deleteOne({ url: 'typesOfWork', id }));
	};

	const saveTypeOfWork = () => {
		const typeOfWork: ITypeOfWorkUpdate = {};
		typeOfWork.title = title;
		if (currentTypeOfWork !== undefined) {
			typeOfWork._id = typesOfWorkObject[currentTypeOfWork]._id;
		}
		dispatch(patchOne({ url: 'typesOfWork', data: typeOfWork }));
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
									typesOfWork.map((typeOfWork) =>
										<Box
											key={typeOfWork._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
											<OneTypeOfWorkComponent
												deleteTypeOfWork={deleteTypeOfWork}
												currentTypeOfWork={currentTypeOfWork}
												changeEditedTypeOfWork={changeEditedTypeOfWork}
												typeOfWork={typeOfWork}
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
						titleOfEditedTypeOfWork !== '' && <>
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

								Редактирование типа работ «<strong>{titleOfEditedTypeOfWork}</strong>»
							</Typography>
						</>
					}
					<TextField
						fullWidth
						id="title"
						label="Название типа работ"
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
						onClick={saveTypeOfWork}
					>
						{titleOfEditedTypeOfWork === ''
							? 'Добавить новый тип работ'
							: `Сохранить изменения в «${titleOfEditedTypeOfWork}»`

						}
					</Button>

					{titleOfEditedTypeOfWork !== '' &&
						<Button
							variant="contained"
							size="small"
							fullWidth
							sx={{ mt: 2, borderRadius: '10px' }}
							color={'info'}
							className={'up-shadow'}
							onClick={() => changeEditedTypeOfWork(undefined)}
						>
							отменить редактирование типа работ «{titleOfEditedTypeOfWork}»
						</Button>}

				</Box>
			</Box>
		</>
	);
}

export default MainTypesOfWorkComponents;