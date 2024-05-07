import { Box, Button } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IDataForStatistic } from '@/interfaces/dataForStat.interface.ts';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import FiltersStatComponent from '@/components/stat/filters.stat.component.tsx';
import BodyTableStatComponent from '@/components/stat/body-table.stat.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useNavigate } from 'react-router-dom';
import { IOrder } from '@/interfaces/databases.interface.ts';

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

function AllWorkflowsStatComponent() {
	const {
		firmsArray,
		modificationsArray,
	} = useReduxSelectors();

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
	const [sortByField, setSortByField] = useState<keyof IWorkflow>('isPublished');
	const [sortDirection, setSortDirection] = useState<IOrder>('asc');

	const [firstEnter, setFirstEnter] = useState<boolean>(false);

	const {
		states,
	} = useReduxSelectors();

	// let needUpdate = false;

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
		if (states.statState == undefined)
			loadData();
	}, []);

	const dispatch = useDispatch<TAppDispatch>();


	// useEffect(() => {
	// 	if (!needUpdate) return;
	// 	sortStatisticData();
	// }, [statisticData]);

	// const sortStatisticData = (newSortField?: IFieldList) => {
	// 	// Определяем направление сортировки и поле для сортировки
	// 	const localSortDirection: IIncreaseDecrease = newSortField === sortByField
	// 		? (sortDirection === 'increase' ? 'decrease' : 'increase')
	// 		: 'increase';
	// 	const localSortField: IFieldList = newSortField || sortByField;
	//
	// 	// Обновляем состояние, если это необходимо
	// 	if (newSortField) {
	// 		setSortByField(localSortField);
	// 	}
	// 	setSortDirection(localSortDirection);
	//
	// 	// Выполняем сортировку
	// 	const sortedData: IWorkflow[] = [...statisticData].sort((a, b) => {
	// 		const aValue = a[localSortField] ?? '';
	// 		const bValue = b[localSortField] ?? '';
	//
	// 		// Сравниваем значения, учитывая направление сортировки
	// 		return (aValue < bValue ? -1 : 1) * (localSortDirection === 'increase' ? 1 : -1);
	// 	});
	//
	// 	needUpdate = false;
	// 	setStatisticData(sortedData);
	// };

	const loadData = async () => {
		const data: IDataForStatistic = {};
		if (useFirm) {
			data['firm'] = firm;
		}
		if (useModification) {
			data['modification'] = modification;
		}
		if (useDate) {
			data['dateFrom'] = new Date(dateFrom + ' 00:00').getTime();
			data['dateTo'] = new Date(dateTo + ' 23:59').getTime();
		}
		if (showChecked) {
			data['showChecked'] = true;
		}
		if (showUnchecked) {
			data['showUnchecked'] = true;
		}
		try {
			const res = await axiosCreate.post('workflows/stat', data);
			// console.log('\nрезультат запроса:\n', res.data);
			// needUpdate = true;
			setStatisticData(res.data);
		} catch (e) {
			// console.log('неудачный запрос', e);
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


	useEffect(() => {
		// console.log('заходим в проверку стейта статистики', states.statState);
		if (states.statState !== undefined) {
			setFirm(states.statState.firm);
			setUseFirm(states.statState.useFirm);
			setModification(states.statState.modification);
			setUseModification(states.statState.useModification);
			setShowChecked(states.statState.showChecked);
			setShowUnchecked(states.statState.showUnchecked);
			setUseDate(states.statState.useDate);
			setDateFrom(states.statState.dateFrom);
			setDateTo(states.statState.dateTo);
			setSortByField(states.statState.sortByField as IFieldList);
			setSortDirection(states.statState.sortDirection);

			setFirstEnter(true);

			dispatch(setState({
				statState: undefined,
			}));

		}
	}, [states.statState]);

	useEffect(() => {
		if (!firstEnter) return;
		setFirstEnter(false);
		// console.log('запускаем loadData при', useDate);
		loadData();
	}, [firm,
		useFirm,
		modification,
		useModification,
		showChecked,
		showUnchecked,
		useDate,
		dateFrom,
		dateTo,
		canUpdateTable,
		showWarning,
		statisticData,
		sortByField,
		sortDirection]);

	const navigate = useNavigate();
	const showSpecificWorkflows = (id: string) => {
		// console.log('сохраняем стейт при ', sortByField, ' > ', sortDirection);
		const statState = {
			firm,
			useFirm,
			modification,
			useModification,
			showChecked,
			showUnchecked,
			useDate,
			dateFrom,
			dateTo,
			canUpdateTable,
			sortByField,
			sortDirection,
		};
		dispatch(setState({
			statState,
		}));
		navigate('/stat/' + id);
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
					<Box
						height="100%"
						className={'shadow-inner background'}
						borderRadius={2}
						p={2}
						boxSizing={'border-box'}
					>
						<BodyTableStatComponent
							rows={statisticData}
							showSpecificWorkflows={showSpecificWorkflows}
							setSortByField={setSortByField}
							setSortDirection={setSortDirection}
							sortByField={sortByField}
							sortDirection={sortDirection}
						/>
					</Box>
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

export default AllWorkflowsStatComponent;