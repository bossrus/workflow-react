import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IDataForStatistic } from '@/interfaces/dataForStat.interface.ts';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import FiltersStatComponent from '@/components/stat/filters.stat.component.tsx';
import BodyTableStatComponent from '@/components/stat/body-table.stat.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch, workflows } from '@/store/_store.ts';
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
			loadData().then();
	}, []);

	const dispatch = useDispatch<TAppDispatch>();


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
			setStatisticData(res.data);
		} catch (e) {
			dispatch(workflows.actions.setError(e as string));
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
		loadData().then();
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
	const saveChecked = async (checkList: string[]) => {
		try {
			await axiosCreate.patch('workflows/checked', {
				ids: checkList,
			});
			await loadData();
		} catch (e) {
			dispatch(workflows.actions.setError(e as string));
		}
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
							checkSelected={saveChecked}
							rows={statisticData}
							showSpecificWorkflows={showSpecificWorkflows}
							setSortByField={setSortByField}
							setSortDirection={setSortDirection}
							sortByField={sortByField}
							sortDirection={sortDirection}
						/>
					</Box>
				</Box>

			</Box>
		</>
	);
}

export default AllWorkflowsStatComponent;