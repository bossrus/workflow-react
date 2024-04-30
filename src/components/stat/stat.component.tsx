import { Box, Button } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IDataForStatistic } from '@/interfaces/dataForStat.interface.ts';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import FiltersStatComponent from '@/components/stat/filters.stat.component.tsx';
import BodyTableStatComponent from '@/components/stat/body-table.stat.component.tsx';

export type ICheckboxNames = 'showChecked' | 'showUnchecked';
type IFieldList =
	'isCheckedOnStat' |
	'firm' |
	'modification' |
	'title' |
	'countPages' |
	'isPublished' |
	'whoAddThisWorkflow' |
	'type';

type IIncreaseDecrease = 'increase' | 'decrease';


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

	const [statisticData, setStatisticData] = useState<IWorkflow[]>([]);
	const [sortByField, setSortByField] = useState<IFieldList>('isPublished');
	const [sortDirection, setSortDirection] = useState<IIncreaseDecrease>('increase');

	let needUpdate = false;

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

	const changeCheckedUnchecked = (whatIsCheckbox: ICheckboxNames, isChecked: boolean) => {
		setShowChecked(prev => whatIsCheckbox === 'showUnchecked' && !isChecked ? true : (whatIsCheckbox === 'showChecked' ? isChecked : prev));
		setShowUnchecked(prev => whatIsCheckbox === 'showChecked' && !isChecked ? true : (whatIsCheckbox === 'showUnchecked' ? isChecked : prev));
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		if (!needUpdate) return;
		sortStatisticData();
	}, [statisticData]);

	const sortStatisticData = (newSortField?: IFieldList) => {
		// Определяем направление сортировки и поле для сортировки
		const localSortDirection: IIncreaseDecrease = newSortField === sortByField
			? (sortDirection === 'increase' ? 'decrease' : 'increase')
			: 'increase';
		const localSortField: IFieldList = newSortField || sortByField;

		// Обновляем состояние, если это необходимо
		if (newSortField) {
			setSortByField(localSortField);
		}
		setSortDirection(localSortDirection);

		// Выполняем сортировку
		const sortedData: IWorkflow[] = [...statisticData].sort((a, b) => {
			const aValue = a[localSortField] ?? '';
			const bValue = b[localSortField] ?? '';

			// Сравниваем значения, учитывая направление сортировки
			return (aValue < bValue ? -1 : 1) * (localSortDirection === 'increase' ? 1 : -1);
		});

		needUpdate = false;
		setStatisticData(sortedData);
	};

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
			console.log('\nрезультат запроса:\n', res.data);
			needUpdate = true;
			setStatisticData(res.data);
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
				<FiltersStatComponent
					useFirm={useFirm}
					setUseFirm={setUseFirm}
					useModification={useModification}
					setUseModification={setUseModification}
					showChecked={showChecked}
					showUnchecked={showUnchecked}
					useDate={useDate}
					firm={firm}
					setFirm={setFirm}
					modification={modification}
					setModification={setModification}
					dateFrom={dateFrom}
					setDateFrom={setDateFrom}
					dateTo={dateTo}
					setDateTo={setDateTo}
					firmsArray={firmsArray}
					modificationsArray={modificationsArray}
					showWarning={showWarning}
					canUpdateTable={canUpdateTable}
					loadData={loadData}
					changeCheckedUnchecked={changeCheckedUnchecked}
					changeUseDateChecked={changeUseDateChecked}
				/>
				<Box flexGrow={1} overflow="auto" p={2}>
					<BodyTableStatComponent rows={statisticData} />
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