import { Box, FormControl, FormControlLabel, FormGroup, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ICheckboxNames } from '@/components/stat/stat.component.tsx';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

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
			<Box
				className={'display-flex flex-direction-column'}
			>
				<Box
					className={'padding-2su display-flex flex-direction-row justify-content-space-around'}
				>
					<Box
						className={'display-flex flex-direction-column'}
					>
						<FormGroup>
							<FormControlLabel control={
								<Checkbox checked={useFirm} onChange={(event) => {
									setUseFirm(event.target.checked);
								}} />
							} label="Журнал:" />
						</FormGroup>
						{useFirm &&
							<FormControl
								variant="standard"
								className={'margin-1su min-width-120px padding-left-2su'}
							>
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
					<Box
						className={'display-flex flex-direction-column'}
					>
						<FormGroup>
							<FormControlLabel control={
								<Checkbox checked={useModification} onChange={(event) => {
									setUseModification(event.target.checked);
								}} />
							} label="Номер журнала:" />
						</FormGroup>
						{useModification &&
							<FormControl
								variant="standard"
								className={'margin-1su min-width-120px padding-left-2su'}
							>
								<Select
									value={modification}
									onChange={(event) => {
										setModification(event.target.value);
									}}
								>
									{firmsArray &&
										modificationsArray.map((item) => (
											<MenuItem
												key={item._id}
												value={item._id}>
												{item.title}
											</MenuItem>
										))
									}
								</Select>
							</FormControl>}
					</Box>
					<Box
						className={'display-flex flex-direction-column'}
					>
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
					<Box
						className={'display-flex flex-direction-row'}
					>
						<Box
							className={'display-flex flex-direction-column'}
						>
							<Checkbox checked={useDate} onChange={(event) => {
								changeUseDateChecked(event.target.checked);
							}} />
						</Box>
						<Box
							className={'display-flex flex-direction-column padding-top-1su gap-2su'}
						>
							{useDate
								?
								<>
									<Box
										className={'display-flex justify-content-space-between'}
									>
										<span
											className={'padding-top-2px color-my-gray'}
										>дата, с</span>
										<input
											type="date"
											className={'date-picker'}
											value={dateFrom}
											onChange={(event) => setDateFrom(event.target.value)}
										/>
									</Box>
									<Box
										className={'display-flex justify-content-space-between'}
									>
										<span
											className={'padding-top-2px color-my-gray'}
										>дата, по</span>
										<input
											type="date"
											className={'date-picker'}
											value={dateTo}
											onChange={(event) => setDateTo(event.target.value)}
										/>
									</Box>

								</>
								: <span
									className={'padding-top-2px'}
								>
								Сделать выборку по дате
							</span>
							}
						</Box>
					</Box>
				</Box>
				{showWarning &&
					<Box
						className={'padding-x-2su text-align-center'}
					>
						<p
							className={'color-red'}
						>
							Если необходимо <strong>«Показать отмеченные»</strong>, выборка становится слишком
							большой.
							<br />
							Для получения данных необходимо добавить минимум два дополнительных параметра (<i>«Журнал»,
							«Номер журнала», или «Сделать выборку по дате»</i>).
						</p>

					</Box>
				}
				{canUpdateTable &&
					<Box
						className={'padding-x-2su'}
					>
						<ContainedSmallButtonComponent
							color={'success'}
							className={'width-100'}
							onClick={() => loadData()}
						>
							Обновить таблицу
						</ContainedSmallButtonComponent>
					</Box>
				}
			</Box>
		</>
	);
}

export default FilterStatComponent;