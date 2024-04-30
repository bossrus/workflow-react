import { Box, Button, FormControl, FormControlLabel, FormGroup, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ICheckboxNames } from '@/components/stat/stat.component.tsx';

interface FilterStatComponentProps {
	useFirm: boolean;
	setUseFirm: (value: boolean) => void;
	useModification: boolean;
	setUseModification: (value: boolean) => void;
	showChecked: boolean;
	showUnchecked: boolean;
	useDate: boolean;
	firm: string;
	setFirm: (value: string) => void;
	modification: string;
	setModification: (value: string) => void;
	dateFrom: string;
	setDateFrom: (value: string) => void;
	dateTo: string;
	setDateTo: (value: string) => void;
	firmsArray: Array<{ _id: string; title: string }>;
	modificationsArray: Array<{ _id: string; title: string }>;
	showWarning: boolean;
	canUpdateTable: boolean;
	loadData: () => void;
	changeCheckedUnchecked: (whatIsCheckbox: ICheckboxNames, isChecked: boolean) => void;
	changeUseDateChecked: (isChecked: boolean) => void;
}

function FilterStatComponent({
								 useFirm,
								 setUseFirm,
								 useModification,
								 setUseModification,
								 showChecked,
								 showUnchecked,
								 useDate,
								 firm,
								 setFirm,
								 modification,
								 setModification,
								 dateFrom,
								 setDateFrom,
								 dateTo,
								 setDateTo,
								 firmsArray,
								 modificationsArray,
								 showWarning,
								 canUpdateTable,
								 loadData,
								 changeCheckedUnchecked,
								 changeUseDateChecked,
							 }: FilterStatComponentProps) {


	return (
		<>
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
									changeCheckedUnchecked('showChecked', event.target.checked);
								}} />
							} label="Показать отмеченные" />
							<FormControlLabel control={
								<Checkbox checked={showUnchecked} onChange={(event) => {
									changeCheckedUnchecked('showUnchecked', event.target.checked);
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
		</>
	);
}

export default FilterStatComponent;