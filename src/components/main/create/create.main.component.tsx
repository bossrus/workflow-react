import { Box, Button, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';
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

	const [workState, setWorkState] = useState<IWorkflowUpdate>({
		firm: '',
		modification: '',
		title: '',
		mainId: '',
		type: getIDByTitle(typesOfWorkArray, 'Новый заказ'),
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
		if (id) {
			const work = workflowsObject[id];
			if (!work) return false;
			const newType = getIDByTitle(typesOfWorkArray, 'Новый заказ');
			result = workState.firm != work.firm ||
				workState.modification != work.modification ||
				workState.title != work.title ||
				(workState.type != newType ? workState.mainId != work.mainId : false) ||
				workState.type != work.type ||
				workState.countPages != work.countPages ||
				workState.countPictures != work.countPictures ||
				workState.urgency != work.urgency ||
				workState.currentDepartment != work.currentDepartment ||
				workState.setToStat != work.setToStat ||
				workState.description != work.description;
		} else {
			const isCoincidence = list?.some(item => item.title?.toLowerCase() === workState.title?.toLowerCase());
			const index = typesOfWorkArray.findIndex(obj => obj._id === workState.type);
			const isNotNewOrder = index !== -1 && workState.title!.length > 0 && typesOfWorkArray[index].title !== 'Новый заказ';
			const isFormFilled = workState.firm !== '' &&
				workState.modification !== '' &&
				workState.title !== '' &&
				workState.type !== '' &&
				workState.countPages !== 0 &&
				workState.countPictures !== 0 &&
				workState.currentDepartment !== '' &&
				workState.description !== '';
			result = (isNotNewOrder || !isCoincidence) && isFormFilled;
		}
		return result;
	};

	const makeCanSave = (list: IWorkflowUpdate[] | null) => {
		setCanSave(calculateCanSave(list));
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

	const setShortList = (data: IWorkflowUpdate[], currentType: string) => {
		if (workState.firm == '' || workState.modification == '') return;
		if (data.length > 0) {
			for (const element of data) {
				//В данном случае urgency используется как степень совпадения.
				// Просто лениво создавать новое поле, которое нужно только в одном месте
				element.urgency = getCoincidenceLevel(element.title!, workState.title!);
			}
			data.sort((a, b) => b.urgency! - a.urgency!);
		}
		const newList = data.length > 0 ? data : null;
		if (newList) {
			changeField('mainId', newList[0].mainId as string);
		}
		setNamesToShortList(newList);
		const firstItem = data.length > 0 ? data[0]._id! : '';
		const newOrderId = getIDByTitle(typesOfWorkArray, 'Новый заказ');
		const newState: IWorkflowUpdate = {
			...workState,
			mainId: firstItem,
		};
		if (!newList && workState.type != newOrderId) {
			newState.type = newOrderId;
		}

		setWorkState(newState);
		setShowAnotherNameHandler(currentType);
	};

	useEffect(() => {
		const fetchData = async () => {
			let currentType = workState.type as string;
			const result = await axiosCreate.post('workflows/in_this_modification', {
				firm: workState.firm,
				modification: workState.modification,
			});
			if (result.data == null || result.data.length === 0) {
				currentType = getIDByTitle(typesOfWorkArray, 'Новый заказ');
				const newState = { ...workState, type: currentType };
				setWorkState(newState);
			}
			setShortList(result.data, currentType);
			makeCanSave(result.data);
		};

		if (workState.firm !== '' && workState.modification !== '') {
			fetchData().then();
		}
	}, [workState.firm, workState.modification]);

	useEffect(() => {
		let currentType = workState.type as string;
		if (!namesToShortList || namesToShortList.length === 0) {
			currentType = getIDByTitle(typesOfWorkArray, 'Новый заказ');
			const newState = { ...workState, type: currentType };
			setWorkState(newState);
		}
		setShowAnotherNameHandler(currentType);
	}, [workState.type]);

	useEffect(() => {
		if (workState.firm !== '' && workState.modification !== '' && namesToShortList && namesToShortList.length > 0) {
			setShortList(namesToShortList, workState.type as string);
		}
	}, [workState.title]);

	const setShowAnotherNameHandler = (currentType: string) => {

		const index = typesOfWorkArray.findIndex(obj => obj._id === currentType);
		if (index !== -1) {
			setShowAnotherName(typesOfWorkArray[index].title != 'Новый заказ');
		}
	};

	const dispatch = useDispatch<TAppDispatch>();

	const namesToShortListRef = useRef(namesToShortList);
	useEffect(() => {
		namesToShortListRef.current = namesToShortList;
	}, [namesToShortList]);

	const getTitleFromShortList = (id: string) => {
		return namesToShortListRef.current?.find(obj => obj._id === id)?.title;
	};

	const saveWork = async () => {
		const currentTypeIndex = typesOfWorkArray.findIndex(obj => obj._id === workStateRef.current.type);
		const IdOfNewOrderType = getIDByTitle(typesOfWorkArray, 'Новый заказ');
		const work: IWorkflowUpdate = id ? workflowsObject[id] : {};
		const data: IWorkflowUpdate = id ? { _id: id } : {};
		if (!id || work.firm != workStateRef.current.firm) data.firm = workStateRef.current.firm;
		if (!id || work.modification != workStateRef.current.modification) data.modification = workStateRef.current.modification;
		if (!id || work.title != workStateRef.current.title) data.title = workStateRef.current.title;
		if (!id || work.type != workStateRef.current.type) data.type = workStateRef.current.type;
		if (!id || work.countPages != workStateRef.current.countPages) data.countPages = workStateRef.current.countPages;
		if (!id || work.countPictures != workStateRef.current.countPictures) data.countPictures = workStateRef.current.countPictures;
		if (!id || work.urgency != workStateRef.current.urgency) data.urgency = workStateRef.current.urgency;
		if (!id || work.currentDepartment != workStateRef.current.currentDepartment) data.currentDepartment = workStateRef.current.currentDepartment;
		if (!id || work.setToStat != workStateRef.current.setToStat) data.setToStat = workStateRef.current.setToStat;
		if (!id || work.description != workStateRef.current.description) data.description = workStateRef.current.description;
		if ((!id || work.mainId != workStateRef.current.mainId) && typesOfWorkArray[currentTypeIndex].title != 'Новый заказ') data.mainId = workStateRef.current.mainId;
		if (!id && workStateRef.current.type != IdOfNewOrderType) data.title = getTitleFromShortList(workStateRef.current.mainId!);

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
		setCanAutoConvert(false);
		setNamesToShortList(null);
		setCanSave(false);
		setShowAnotherName(false);
		if (id) navigate('/main');
	};

	useEffect(() => {
		setShowAnotherNameHandler(workState.type as string);
	}, [workState.type]);

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
		<Box display="flex" py={2} height="100%" boxSizing={'border-box'} gap={2}>
			<Box display={'flex'} flexDirection={'column'} flexGrow={1}>
				<Box display="flex" flexDirection="column" height={'100%!important'} flexGrow={1}>
					<table
						className={'table-container-pb10'}
					>
						<tbody>
						<tr>
							<td style={{
								display: 'flex',
								height: '100%',
								width: '100%',
								overflow: 'auto',
							}}>
								<TextField
									fullWidth
									className={'in-depth'}
									sx={{
										display: 'flex',
										flexGrow: 1,
										borderRadius: '1em',
										border: 'none',
										'& .MuiInputBase-root': {
											border: 'none',
											borderRadius: '1em!important',
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
										},
										'& textarea': {
											overflow: 'auto!important',
										},
									}}
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
					<Button
						variant="contained"
						size="small"
						fullWidth
						sx={{ borderRadius: '10px' }}
						color={'success'}
						className={'up-shadow'}
						disabled={!canAutoConvert}
						onClick={() => convertText(workState.description)}
					>
						<span>Автоматическое заполнение полей <small
							style={{ color: 'gray' }}>(ALT+A)</small></span>
					</Button>
				</Box>
			</Box>


			{/*ВТОРАЯ КОЛОНКА*/}
			{/*ВТОРАЯ КОЛОНКА*/}
			{/*ВТОРАЯ КОЛОНКА*/}


			<Box minWidth={250} display={'flex'} flexDirection={'column'} pt={1}>
				<table
					className={'table-container-pb10'}
				>
					<tbody>
					<tr>
						<td style={{
							display: 'flex',
							height: '100%',
							width: '100%',
							overflow: 'auto',
							flexDirection: 'column',
							gap: '2em',
						}}>
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
								fullWidth
								id="title"
								label="Название заказа "
								variant="standard"
								value={workState.title}
								onChange={(e) => changeField('title', e.target.value)}
								className={`${showAnotherName ? 'inactive' : ''}`}
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
										className={`${showAnotherName ? '' : 'inactive'}`}
										value={workState.mainId}
										onChange={(event) => {
											changeField('mainId', event.target.value);
										}}
										sx={{ pl: '5px' }}
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
									sx={{ pl: '5px' }}
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
								fullWidth
								id="countPages"
								label="Количество страниц"
								variant="standard"
								type={'number'}
								value={workState.countPages}
								onChange={(e) => changeField('countPages', +e.target.value)}
							/>
							<TextField
								fullWidth
								id="countPictures"
								label="Количество картинок"
								variant="standard"
								type={'number'}
								value={workState.countPictures}
								onChange={(e) => changeField('countPictures', +e.target.value)}
							/>
							<TextField
								fullWidth
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
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					<Button
						variant="contained"
						size="small"
						fullWidth
						disabled={!canSave}
						sx={{ borderRadius: '10px' }}
						onClick={() => saveWork()}
						color={id ? 'success' : 'primary'}
					>
						{
							id
								? <span>Сохранить правку <small style={{ color: 'white' }}>(ALT+Enter)</small></span>
								:
								<span>Создать новое задание <small style={{ color: 'white' }}>(ALT+Enter)</small></span>
						}
					</Button>
					<Button
						variant="outlined"
						size="small"
						fullWidth
						sx={{ borderRadius: '10px' }}
						onClick={() => clearFields()}
						color={'warning'}
					>

						{
							id
								? <span>Отменить правку <small style={{ color: 'gray' }}>(ESC)</small></span>
								: <span>Сбросить форму <small style={{ color: 'gray' }}>(ESC)</small></span>
						}
					</Button></Box>
			</Box>
		</Box>
	);
}

export default CreateMainComponent;