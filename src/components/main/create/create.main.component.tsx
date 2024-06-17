import { Box, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useRef, useState } from 'react';
import { getIDByTitle } from '@/_services/getIDByTitle.service.ts';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IWorkflowsKeys, IWorkflowUpdate } from '@/interfaces/workflow.interface.ts';
import { useDispatch } from 'react-redux';
import { patchOne } from '@/store/_shared.thunks.ts';
import { TAppDispatch, workflows } from '@/store/_store.ts';
import { useNavigate, useParams } from 'react-router-dom';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import { FALSE_COLOR } from '@/_constants/colors.ts';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';
import OutlinedSmallButtonComponent from '@/components/_shared/outlined.smallButton.component.tsx';

function CreateMainComponent() {
	const {
		departmentsArray, firmsArray, modificationsArray, typesOfWorkArray, me,
	} = useReduxSelectors();

	const navigate = useNavigate();

	useEffect(() => {
		if (Object.keys(me).length <= 0) return;
		if (!me.canStartStopWorks)
			navigate('/main');
	}, [me.canStartStopWorks]);

	const { workflowsObject } = useWorksSelectors();

	const typeNewOrderId = useRef('');
	useEffect(() => {
		typeNewOrderId.current = getIDByTitle(typesOfWorkArray, 'Новый заказ');
	}, [typesOfWorkArray]);

	const [workState, setWorkState] = useState<IWorkflowUpdate>({
		firm: '',
		modification: '',
		title: '',
		mainId: '',
		type: typeNewOrderId.current,
		countPages: 1,
		countPictures: 1,
		urgency: 50000,
		currentDepartment: '',
		setToStat: true,
		description: '',
	});

	const workStateRef = useRef(workState);


	useEffect(() => {
		if (!departmentsArray || departmentsArray.length === 0) return;
		changeField('currentDepartment', departmentsArray[0]._id);
	}, [departmentsArray]);

	const [canAutoConvert, setCanAutoConvert] = useState(false);
	const [namesToShortList, setNamesToShortList] = useState<IWorkflowUpdate[] | null>(null);


	const [canSave, setCanSave] = useState(false);

	const [showAnotherName, setShowAnotherName] = useState(false);

	const { id } = useParams();

	const calculateCanSave = (list: IWorkflowUpdate[] | null): boolean => {
		let result: boolean = false;
		const isCoincidence = list?.some(item => item.title?.toLowerCase() === workStateRef.current.title?.toLowerCase());
		const isNotNewOrder = workStateRef.current.type !== typeNewOrderId.current;

		const {
			firm,
			modification,
			title,
			type,
			countPages,
			countPictures,
			urgency,
			currentDepartment,
			setToStat,
			description,
			mainId,
		} = workStateRef.current;


		if (id) {
			const work = workflowsObject[id];
			if (!work) return false;
			result = firm != work.firm ||
				modification != work.modification ||
				title != work.title ||
				(type != typeNewOrderId.current ? mainId != work.mainId : false) ||
				type != work.type ||
				countPages != work.countPages ||
				countPictures != work.countPictures ||
				urgency != work.urgency ||
				currentDepartment != work.currentDepartment ||
				setToStat != work.setToStat ||
				description != work.description;
		} else {
			result = firm !== '' &&
				modification !== '' &&
				title !== '' &&
				type !== '' &&
				countPages !== 0 &&
				countPictures !== 0 &&
				currentDepartment !== '' &&
				description !== '';
		}
		result = (result && (isNotNewOrder || !isCoincidence));
		return result;
	};

	const makeCanSave = (list: IWorkflowUpdate[] | null) => {
		const result = calculateCanSave(list);
		setCanSave(result);
	};

	useEffect(() => {
		makeCanSave(namesToShortList);
		workStateRef.current = workState;
	}, [workState]);

	const tagsMappings = {
		'[<FRM>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			firm: getIDByTitle(firmsArray, value),
		}),
		'[<MDFCTR>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			modification: getIDByTitle(modificationsArray, value),
		}),
		'[<NM>]': (value: string, state: IWorkflowUpdate) => ({ ...state, title: value }),
		'[<DPRT>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			currentDepartment: getIDByTitle(departmentsArray, value),
		}),
		'[<DSCRPTN>]': (value: string, state: IWorkflowUpdate) => ({ ...state, description: value }),
		'[<CNTPGS>]': (value: string, state: IWorkflowUpdate) => ({ ...state, countPages: Number(value) }),
		'[<SRCHNST>]': (value: string, state: IWorkflowUpdate) => ({ ...state, urgency: Number(value) }),
		'[<CNTPCTRS>]': (value: string, state: IWorkflowUpdate) => ({ ...state, countPictures: Number(value) }),
		'[<TOSTAT>]': (value: string, state: IWorkflowUpdate) => ({ ...state, setToStat: value === 'on' }),
		'[<TP>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			type: getIDByTitle(typesOfWorkArray, value),
		}),
	};

	const convertText = (allDescription: string | undefined) => {
		if (!allDescription || !canAutoConvert) return null;
		let newState = { ...workState };
		for (const [key, getNewState] of Object.entries(tagsMappings)) {
			const tempTxt = allDescription.split(key);
			if (tempTxt.length === 3) {
				newState = getNewState(tempTxt[1], newState);
			} else {
				return null;
			}
		}
		setWorkState(newState);
	};


	const getCoincidenceLevel = (original: string, newStr: string) => {
		let count = 0;
		for (let len = 1; len <= original.length; len++) {
			for (let i = 0; i <= original.length - len; i++) {
				const searchString = original.substring(i, i + len);
				if (newStr.toLowerCase().includes(searchString.toLowerCase())) {
					const occurrences = newStr.split(searchString).length - 1;
					count += Math.pow(occurrences, searchString.length);
				}
				if (searchString.length > newStr.length) {
					return count;
				}
			}
		}
		return count;
	};

	const removeCurrentIdFromArray = (arr: IWorkflowUpdate[]) => {
		return arr.filter(item => item._id !== id);
	};

	const setShortList = (data: IWorkflowUpdate[], currentType: string) => {
		if (workState.firm == '' || workState.modification == '') return;
		const dataWithoutCurrentWorkflow = removeCurrentIdFromArray(data);
		if (dataWithoutCurrentWorkflow.length > 0) {
			for (const element of dataWithoutCurrentWorkflow) {
				//В данном случае urgency используется как степень совпадения.
				// Просто лениво создавать новое поле, которое нужно только в одном месте
				element.urgency = getCoincidenceLevel(element.title!, workState.title!);
			}
			dataWithoutCurrentWorkflow.sort((a, b) => b.urgency! - a.urgency!);
		}
		const newList = dataWithoutCurrentWorkflow.length > 0 ? dataWithoutCurrentWorkflow : null;
		if (newList) {
			changeField('mainId', newList[0]._id as string);
		}
		const firstItem = newList
			? newList.length > 0
				? newList[0]._id!
				: ''
			: '';

		const newState: IWorkflowUpdate = {
			...workState,
			mainId: firstItem,
		};
		if (!newList && workState.type != typeNewOrderId.current) {
			newState.type = typeNewOrderId.current;
		}

		setNamesToShortList(newList);
		setWorkState(newState);
		setShowAnotherNameHandler(currentType);
	};

	const isShortListLoadAttemptedRef = useRef(false);

	useEffect(() => {
		const fetchData = async () => {
			let currentType = workState.type as string;
			const result = await axiosCreate.post('workflows/in_this_modification', {
				firm: workState.firm,
				modification: workState.modification,
			});
			if (result.data == null || result.data.length === 0) {
				currentType = typeNewOrderId.current;
				setWorkState({ ...workState, type: currentType });
			}
			isShortListLoadAttemptedRef.current = true;
			setShortList(result.data, currentType);
			makeCanSave(result.data);
		};

		if (workState.firm !== '' && workState.modification !== '') {
			fetchData().then();
		}
	}, [workState.firm, workState.modification]);

	const prevTypeRef = useRef<string | undefined>(undefined);

	useEffect(() => {
		if (!workState.type || !isShortListLoadAttemptedRef.current) return;

		let currentType = workState.type;

		if ((!namesToShortList || namesToShortList.length === 0) && currentType !== typeNewOrderId.current) {
			dispatch(workflows.actions.setError({
				status: 404,
				message: `В выбранном номере выбранного журнала нет материалов. Тип «${getTitleByID(typesOfWorkArrayRef.current, currentType)}» делать не к чему.`,
			}));

			const newState = { ...workState, type: typeNewOrderId.current };
			setWorkState(newState);
		}
		if (currentType === typeNewOrderId.current && prevTypeRef.current !== typeNewOrderId.current) {
			if (namesToShortList) {
				setShortList(namesToShortList, currentType);
			}
		}
		prevTypeRef.current = currentType;
		setShowAnotherNameHandler(currentType);
	}, [workState.type]);


	useEffect(() => {
		if (workState.firm !== '' && workState.modification !== '' && namesToShortList && namesToShortList.length > 0) {
			setShortList(namesToShortList, workState.type as string);
		}
	}, [workState.title]);

	const setShowAnotherNameHandler = (currentType: string) => {

		setShowAnotherName(currentType !== typeNewOrderId.current);
	};

	const dispatch = useDispatch<TAppDispatch>();

	const namesToShortListRef = useRef(namesToShortList);
	useEffect(() => {
		namesToShortListRef.current = namesToShortList;
	}, [namesToShortList]);

	const getTitleFromShortList = (id: string) => {
		return namesToShortListRef.current?.find(obj => obj._id === id)?.title;
	};

	const workflowsObjectRef = useRef(workflowsObject);
	useEffect(() => {
		workflowsObjectRef.current = workflowsObject;
	}, [workflowsObject]);

	const typesOfWorkArrayRef = useRef(typesOfWorkArray);
	useEffect(() => {
		typesOfWorkArrayRef.current = typesOfWorkArray;
	}, [typesOfWorkArray]);


	const saveWork = async () => {

		if (!calculateCanSave(namesToShortListRef.current)) return;

		const work: IWorkflowUpdate = id ? workflowsObjectRef.current[id] : {};

		const data: IWorkflowUpdate = { ...workStateRef.current };

		if (id) {
			data._id = id;
		}

		Object.keys(workStateRef.current).forEach(key => {
			if (id && work[key as keyof IWorkflowUpdate] === workStateRef.current[key as keyof IWorkflowUpdate]) {
				delete data[key as keyof IWorkflowUpdate];
			}
		});

		if (workStateRef.current.type != typeNewOrderId.current) {

			data.title = getTitleFromShortList(workStateRef.current.mainId!);

			if ((!id || work.mainId != workStateRef.current.mainId)) {
				data.mainId = workStateRef.current.mainId;
			}
		} else {
			delete data.mainId;
		}

		if (id) dispatch(workflows.actions.updateElement(data));
		dispatch(patchOne({ url: 'workflows', data }));

		clearFields();
	};

	const clearFields = () => {
		setWorkState({
			firm: '',
			modification: '',
			title: '',
			mainId: '',
			type: '',
			countPages: 1,
			countPictures: 1,
			urgency: 50000,
			currentDepartment: '',
			setToStat: true,
			description: '',
		});
		typeNewOrderId.current = '';
		setCanAutoConvert(false);
		setNamesToShortList(null);
		setCanSave(false);
		setShowAnotherName(false);
		if (id) navigate('/main');
	};

	const canConvertDescription = (allDescription: string | undefined) => {
		if (allDescription) {
			for (const key of Object.keys(tagsMappings)) {
				const tempTxt = allDescription.split(key);
				if (tempTxt.length !== 3) {
					return false;
				}
			}
		}
		return allDescription !== undefined && allDescription.length > 0;
	};

	const changeField = (name: IWorkflowsKeys, value: string | number | boolean) => {
		setWorkState({ ...workState, [name]: value });
	};

	const changeSwitcher = (checked: boolean) => changeField('setToStat', checked);

	useEffect(() => {
		setCanAutoConvert(canConvertDescription(workState.description));
	}, [workState.description]);

	useEffect(() => {
		if (!id || Object.keys(workflowsObject).length <= 0) return;
		const work = workflowsObject[id];
		if (!work) return;
		setWorkState({
			firm: work.firm,
			modification: work.modification,
			title: work.title,
			mainId: work.mainId ? work.mainId : '',
			type: work.type,
			countPages: work.countPages,
			countPictures: work.countPictures,
			urgency: work.urgency,
			currentDepartment: work.currentDepartment,
			setToStat: work.setToStat,
			description: work.description,
		});
	}, [id, workflowsObject]);

	const descriptionRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!event.key) return;

			if (event.key.toLowerCase() === 'escape') {
				clearFields();
			}
			if (!event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;

			if (event.key.toLowerCase() === 'enter') {
				saveWork().then();
			}

			if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'ф') {
				convertText(workState.description);
			}

			if (event.key.toLowerCase() === 'v' || event.key.toLowerCase() === 'м') {
				event.preventDefault();
				if (descriptionRef.current) {
					descriptionRef.current.focus();
					navigator.clipboard.readText().then((text) => {
						if (descriptionRef.current) {
							descriptionRef.current.value += text;
							setWorkState((prevState) => ({
								...prevState,
								description: prevState.description + text,
							}));
						}
					});
				}
			}

		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<Box
			className={'display-flex padding-y-2su height-100 box-sizing-border-box gap-2su'}
		>
			<Box
				className={'display-flex flex-direction-column flex-grow-1'}
			>
				<Box
					className={'display-flex flex-direction-column height-100 flex-grow-1'}
				>
					<table
						className={'table-container-pb10px'}
					>
						<tbody>
						<tr>
							<td
								className={'display-flex height-100 width-100 overflow-auto'}
							>
								<TextField
									className={'text-field-on-create '}
									inputRef={descriptionRef}
									id="description"
									label="Описание заказа (alt+V)"
									multiline
									value={workState.description}
									onChange={(e) => changeField('description', e.target.value)}
									autoFocus={true}
								/>
							</td>
						</tr>
						</tbody>
					</table>
				</Box>
				<Box>
					<ContainedSmallButtonComponent
						color={'success'}
						className={'width-100'}
						disabled={!canAutoConvert}
						onClick={() => convertText(workState.description)}
					>
						<span>Автоматическое заполнение полей <small
							style={{ color: 'gray' }}>(ALT+A)</small></span>
					</ContainedSmallButtonComponent>
				</Box>
			</Box>


			{/*ВТОРАЯ КОЛОНКА*/}
			{/*ВТОРАЯ КОЛОНКА*/}
			{/*ВТОРАЯ КОЛОНКА*/}


			<Box
				className={'min-width-250px display-flex flex-direction-column'}
			>
				<table
					className={'table-container-pb10px'}
				>
					<tbody>
					<tr>
						<td
							className={'display-flex height-100 width-100 overflow-auto flex-direction-column gap-2su'}
						>
							<FormControl variant="standard" fullWidth>
								<InputLabel id="firms">Клиент</InputLabel>
								<Select
									value={workState.firm}
									onChange={(event) => {
										changeField('firm', event.target.value);
									}}
									labelId="firms"
								>
									{firmsArray && firmsArray.length > 0 && (
										firmsArray.map((item) => {
											return (<MenuItem key={item._id} value={item._id}>
												{item.title}
											</MenuItem>);
										})
									)
									}
								</Select>
							</FormControl>
							<FormControl variant="standard" fullWidth>
								<InputLabel id="modifications">Номер журнала</InputLabel>
								<Select
									value={workState.modification}
									onChange={(event) => {
										changeField('modification', event.target.value);
									}}
									labelId="modifications"
								>
									{modificationsArray && modificationsArray.length > 0 && (
										modificationsArray.map((item) => {
											return (<MenuItem key={item._id} value={item._id}>
												{item.title}
											</MenuItem>);
										})
									)
									}
								</Select>
							</FormControl>
							<TextField
								id="title"
								label="Название заказа "
								variant="standard"
								value={workState.title}
								onChange={(e) => changeField('title', e.target.value)}
								className={`width-100 ${showAnotherName ? 'opacity-30' : ''}`}
							/>
							{
								namesToShortList &&
								namesToShortList.length > 0 &&
								typesOfWorkArray &&
								typesOfWorkArray.length > 0 &&
								workState.title &&
								workState.title.length > 0 &&
								<FormControl variant="standard" fullWidth>
									<Select
										className={`padding-left-5px ${showAnotherName ? '' : 'opacity-30'}`}
										value={workState.mainId}
										onChange={(event) => {
											changeField('mainId', event.target.value);
										}}
									>
										{
											namesToShortList.map((item) => {
												return (<MenuItem key={item._id} value={item._id}>
													{item.title}
												</MenuItem>);
											})
										}
									</Select>
								</FormControl>}
							<FormControl variant="standard" fullWidth>
								<InputLabel id="typesOfWork">Тип работы</InputLabel>
								<Select
									value={workState.type}
									onChange={(event) => {
										changeField('type', event.target.value);
									}}
									className={'padding-left-5px'}
									labelId="typesOfWork"
								>
									{typesOfWorkArray && typesOfWorkArray.length > 0 && (
										typesOfWorkArray.map((item) => {
											return (<MenuItem key={item._id} value={item._id}>
												{item.title}
											</MenuItem>);
										})
									)
									}
								</Select>
							</FormControl>
							<TextField
								className={'width-100'}
								id="countPages"
								label="Количество страниц"
								variant="standard"
								type={'number'}
								value={workState.countPages}
								onChange={(e) => changeField('countPages', +e.target.value)}
							/>
							<TextField
								className={'width-100'}
								id="countPictures"
								label="Количество картинок"
								variant="standard"
								type={'number'}
								value={workState.countPictures}
								onChange={(e) => changeField('countPictures', +e.target.value)}
							/>
							<TextField
								className={'width-100'}
								id="urgency"
								label="Срочность"
								variant="standard"
								type={'number'}
								value={workState.urgency}
								onChange={(e) => changeField('urgency', +e.target.value)}
							/>
							<FormControl variant="standard" fullWidth>
								<InputLabel id="departments">Работа в отдел</InputLabel>
								<Select
									value={workState.currentDepartment}
									onChange={(event) => {
										changeField('currentDepartment', event.target.value);
									}}
									sx={{ pl: '5px' }}
									labelId="departments"
								>
									{departmentsArray && departmentsArray.length > 0 && (
										departmentsArray.map((item) => {
											if (item.isUsedInWorkflow)
												return (<MenuItem key={item._id} value={item._id}>
													{item.title}
												</MenuItem>);
										})
									)
									}
								</Select>
							</FormControl>
							<FormGroup>
								<SwitchButtonComponent
									mode={'usual'}
									changeChecked={changeSwitcher}
									checkState={workState.setToStat as boolean}
									falseBackgroundColor={FALSE_COLOR}
									falseTitle={'Не заносить в статистику'}
									trueBackgroundColor={'green'}
									trueTitle={'Заносить в статистику'}
								/>
							</FormGroup>
						</td>
					</tr>
					</tbody>
				</table>
				<Box
					className={'display-flex flex-direction-column'}
				>
					<ContainedSmallButtonComponent
						disabled={!canSave}
						onClick={() => saveWork()}
						color={id ? 'success' : 'primary'}
					>
						{
							id
								? <span>Сохранить правку <small className={'color-white'}>(ALT+Enter)</small></span>
								:
								<span>Создать новое задание <small className={'color-white'}>(ALT+Enter)</small></span>
						}
					</ContainedSmallButtonComponent>
					<OutlinedSmallButtonComponent
						onClick={() => clearFields()}
						color={'warning'}
					>

						{
							id
								? <span>Отменить правку <small className={'color-my-gray'}>(ESC)</small></span>
								: <span>Сбросить форму <small className={'color-my-gray'}>(ESC)</small></span>
						}
					</OutlinedSmallButtonComponent>
				</Box>
			</Box>
		</Box>
	);
}

export default CreateMainComponent;