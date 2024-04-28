import { Box, Button, FormControl, FormControlLabel, FormGroup, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IDataForStatistic } from '@/interfaces/dataForStat.interface.ts';

function StatComponent() {
	const { firmsArray, modificationsArray } = useReduxSelectors();
	const [firm, setFirm] = useState<string>('');
	const [useFirm, setUseFirm] = useState<boolean>(false);
	const [modification, setModification] = useState<string>('');
	const [useModification, setUseModification] = useState<boolean>(false);
	const [showChecked, setShowChecked] = useState<boolean>(false);
	const [showUnchecked, setShowUnchecked] = useState<boolean>(true);
	const [useDate, setUseDate] = useState<boolean>(false);
	const [dateFrom, setDateFrom] = useState<string>('');
	const [dateTo, setDateTo] = useState<string>('');
	const [canUpdateTable, setCanUpdate] = useState<boolean>(false);
	const [showWarning, setShowWarning] = useState<boolean>(false);

	const changeUseDateChecked = (isChecked: boolean) => {
		setUseDate(isChecked);
		const currentDate = isChecked ? new Date().toISOString().split('T')[0] : '';
		setDateFrom(currentDate);
		setDateTo(currentDate);
	};

	useEffect(() => {
		checkForm();
	}, [
		useFirm,
		useModification,
		showChecked,
		showUnchecked,
		useDate,

		firm,
		modification,
		dateFrom,
		dateTo,
	]);

	useEffect(() => {
		console.log(showUnchecked);
	}, []);

	const loadData = async () => {
		const data: IDataForStatistic = {};
		if (useFirm) {
			data['firm'] = firm;
		}
		if (useModification) {
			data['modification'] = modification;
		}
		if (useDate) {
			data['dateFrom'] = new Date(dateFrom).getTime();
			data['dateTo'] = new Date(dateTo).getTime();
		}
		if (showChecked) {
			data['showChecked'] = true;
		}
		if (showUnchecked) {
			data['showUnchecked'] = true;
		}
		try {
			const res = await axiosCreate.post('workflows/stat', data);
			console.log('\nрезультат запроса:\n', res);
		} catch (e) {
			console.log('неудачный запрос', e);
		}
		setCanUpdate(false);
	};

	const checkForm = () => {
		const isFirmValid = useFirm ? firm !== '' : true;
		const isModificationValid = useModification ? modification !== '' : true;
		const isDateValid = useDate ? dateFrom !== '' && dateTo !== '' : true;

		const localCanUpdate = isFirmValid && isModificationValid && isDateValid;
		const shouldShowWarning = showChecked && [useFirm, useModification, useDate].filter(Boolean).length < 2;

		setShowWarning(shouldShowWarning);
		setCanUpdate(!shouldShowWarning && localCanUpdate);
	};


	return (
		<>
			<Box display="flex" flexDirection="column" height="100%" boxShadow={3} borderRadius={2} bgcolor={'white'}>
				<Box display="flex" flexDirection="column">
					<Box p={2} display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
						<Box display={'flex'} flexDirection={'column'}>
							<FormGroup>
								<FormControlLabel control={
									<Checkbox checked={useFirm} onChange={(event) => {
										setUseFirm(event.target.checked);
									}} />
								} label="Журнал:" />
							</FormGroup>
							{useFirm &&
								<FormControl variant="standard" sx={{ m: 1, minWidth: 120, pl: 2 }}>
									<Select
										value={firm}
										onChange={(event) => {
											setFirm(event.target.value);
										}}
									>
										{firmsArray &&
											firmsArray.map((item) => (
												<MenuItem key={item._id} value={item._id}>
													{item.title}
												</MenuItem>
											))
										}
									</Select>
								</FormControl>}
						</Box>
						<Box display={'flex'} flexDirection={'column'}>
							<FormGroup>
								<FormControlLabel control={
									<Checkbox checked={useModification} onChange={(event) => {
										setUseModification(event.target.checked);
									}} />
								} label="Номер журнала:" />
							</FormGroup>
							{useModification &&
								<FormControl variant="standard" sx={{ m: 1, minWidth: 120, pl: 2 }}>
									<Select
										value={modification}
										onChange={(event) => {
											setModification(event.target.value);
										}}
									>
										{firmsArray &&
											modificationsArray.map((item) => (
												<MenuItem key={item._id} value={item._id}>
													{item.title}
												</MenuItem>
											))
										}
									</Select>
								</FormControl>}
						</Box>
						<Box display={'flex'} flexDirection={'column'}>
							<FormGroup>
								<FormControlLabel control={
									<Checkbox checked={showChecked} onChange={(event) => {
										setShowChecked(event.target.checked);
									}} />
								} label="Показать отмеченные" />
								<FormControlLabel control={
									<Checkbox checked={showUnchecked} onChange={(event) => {
										setShowUnchecked(event.target.checked);
									}} />
								} label="Показать не отмеченные" />
							</FormGroup>
						</Box>
						<Box display={'flex'} flexDirection={'row'}>
							<Box flexDirection={'column'} display={'flex'}>
								<Checkbox checked={useDate} onChange={(event) => {
									changeUseDateChecked(event.target.checked);
								}} />
							</Box>
							<Box display={'flex'} flexDirection={'column'} pt={'10px'} gap={'17px'}>
								{useDate
									?
									<>
										<Box display="flex" justifyContent="space-between">
											<span style={{ paddingTop: '2px', color: 'gray' }}>дата, с</span>
											<input
												type="date"
												className={'date-picker'}
												value={dateFrom}
												onChange={(event) => setDateFrom(event.target.value)}
											/>
										</Box>
										<Box display="flex" justifyContent="space-between">
											<span style={{ paddingTop: '2px', color: 'gray' }}>дата, по</span>
											<input
												type="date"
												className={'date-picker'}
												value={dateTo}
												onChange={(event) => setDateTo(event.target.value)}
											/>
										</Box>

									</>
									: <span style={{ paddingTop: '2px' }}>
								Сделать выборку по дате
							</span>
								}
							</Box>
						</Box>
					</Box>
					{showWarning &&
						<Box px={2} textAlign={'center'}>
							<p style={{ color: 'red' }}>
								Если необходимо <strong>«Показать отмеченные»</strong>, выборка становится слишком
								большой.
								<br />
								Для получения данных необходимо добавить минимум два дополнительных параметра (<i>«Журнал»,
								«Номер журнала», или «Сделать выборку по дате»</i>).
							</p>

						</Box>
					}
					{canUpdateTable &&
						<Box px={2}>
							<Button
								variant="contained"
								size="small"
								fullWidth
								sx={{ borderRadius: '10px' }}
								color={'success'}
								className={'up-shadow'}
								onClick={() => loadData()}
							>
								Обновить таблицу
							</Button>
						</Box>
					}
				</Box>
				<Box flexGrow={1} overflow="auto" p={2}>
					<table className={'table-container'}>
						<tbody>
						<tr>
							<td className={'align-top'}>

							</td>
						</tr>
						</tbody>
					</table>
				</Box>
				<Box px={2} pb={2}>
					<Button
						disabled={true} //поставить наличие выделенных работ
						variant="contained"
						size="small"
						fullWidth
						sx={{ borderRadius: '10px' }}
						color={'info'}
						className={'up-shadow'}
						onClick={() => alert('pressing')}
					>
						Отметить выделенное
					</Button>
				</Box>
			</Box>
		</>
	);
}

export default StatComponent;