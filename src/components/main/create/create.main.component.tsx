import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormGroup,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect, useState } from 'react';
import { getIDByTitle } from '@/_services/getIDByTitle.service.ts';
import { IDepartment } from '@/interfaces/department.interface.ts';
import { ITypeOfWork } from '@/interfaces/worktype.interface.ts';
import { IModification } from '@/interfaces/modification.interface.ts';
import { IFirm } from '@/interfaces/firm.interface.ts';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IWorkflowsKeys, IWorkflowUpdate } from '@/interfaces/workflow.interface.ts';
import { useDispatch } from 'react-redux';
import { patchOne } from '@/store/_shared.thunks.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { useNavigate, useParams } from 'react-router-dom';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';

const FALSE_COLOR = '#92a38f';


// const TEST_DATA1 = 'в этом текстовом боксе нужно сделать «Выделить всё», скопировать в память, и целиком вставить в поле «Описание работы:» на сайте www.work-flow.site. Далее на сайте кликнуть по строке «Распознать текст» под полем «Описание работы».      [<NM>]Destinations D_ZP[<NM>][<SRCHNST>]50000[<SRCHNST>][<TP>]Досыл TIFF[<TP>][<TOSTAT>]on[<TOSTAT>][<FRM>]АЭРОФЛОТ[<FRM>][<DPRT>]Ретушь[<DPRT>][<CNTPGS>]2[<CNTPGS>][<MDFCTR>]0523[<MDFCTR>][<CNTPCTRS>]1[<CNTPCTRS>][<DSCRPTN>]название вёрстки «Destinations D_ZP.indd» количество картинок на обработку ≈ 1 название PDF с комментариями «Destinations D_ZP_comment_Mon_Mar_27_2023_15-21-10.pdf»  ------------ 1294910638-265_1.tif обрабатывать прям в цмике. не переделять ------------ 1294910638-265_1.tif шар вытравить на слой, потом только стёклам сделать прозрачность 70%[<DSCRPTN>]';
// const TEST_DATA1 = 'в этом текстовом боксе нужно сделать «Выделить всё», скопировать в память, и целиком вставить в поле «Описание работы:» на сайте www.work-flow.site. Далее на сайте кликнуть по строке «Распознать текст» под полем «Описание работы».      [<NM>]++obektiv_APR[<NM>][<SRCHNST>]50000[<SRCHNST>][<TP>]Новый заказ[<TP>][<TOSTAT>]on[<TOSTAT>][<FRM>]журнал S7[<FRM>][<DPRT>]Ретушь[<DPRT>][<CNTPGS>]2[<CNTPGS>][<MDFCTR>]0423[<MDFCTR>][<CNTPCTRS>]1[<CNTPCTRS>][<DSCRPTN>]количество картинок на обработку ≈ 1 название PDF с комментариями «++obektiv_APR_comment_Tue_Mar_14_2023_10-09-13.pdf» [<DSCRPTN>]';
// const TEST_DATA1 = 'в этом текстовом боксе нужв этом текстовом боксе нужно сделать «Выделить всё», скопировать в память, и целиком вставить в поле «Описание работы:» на сайте www.work-flow.site. Далее на сайте кликнуть по строке «Распознать текст» под полем «Описание работы».      [<NM>]ap04_Select_Techno_1pic[<NM>][<SRCHNST>]50000[<SRCHNST>][<TP>]Правка[<TP>][<TOSTAT>]on[<TOSTAT>][<FRM>]аэроПРЕМИУМ[<FRM>][<DPRT>]Ретушь[<DPRT>][<CNTPGS>]1[<CNTPGS>][<MDFCTR>]0423[<MDFCTR>][<CNTPCTRS>]undefined[<CNTPCTRS>][<DSCRPTN>]название вёрстки «ap04_Select_Techno_1pic.indd» название PDF с комментариями «ap04_Select_Techno_1pic_comment_Wed_Mar_01_2023_14-53-51.pdf»  ------------ Monolith right.tif убрать выбеливание фона, потом изначальный фон слегка уплотнить[<DSCRPTN>]';

function CreateMainComponent() {
	const {
		departmentsArray, firmsArray, modificationsArray, typesOfWorkArray,
	} = useReduxSelectors();

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

	useEffect(() => {
		if (!departmentsArray || departmentsArray.length === 0) return;
		// console.log('изменение  юзефект списка отделоВ');
		changeField('currentDepartment', departmentsArray[0]._id);
	}, [departmentsArray]);

	const [canAutoConvert, setCanAutoConvert] = useState(false);
	const [namesToShortList, setNamesToShortList] = useState<IWorkflowUpdate[] | null>(null);


	const [canSave, setCanSave] = useState(false);
	const [showAnotherName, setShowAnotherName] = useState(false);

	const { id } = useParams();

	// console.log('в создании путь = ', id);

	useEffect(() => {
		// console.log('сменился workState = ', workState);
	}, [workState]);

	const makeCanSave = (list: IWorkflowUpdate[] | null) => {
		let result: boolean = false;
		if (id) {
			if (Object.keys(workflowsObject).length <= 0) return;
			const work = workflowsObject[id];
			if (work) {
				const newType = getIDByTitle<ITypeOfWork>(typesOfWorkArray, 'Новый заказ');
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
			}
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
		setCanSave(result);
	};

	useEffect(() => {
		makeCanSave(namesToShortList);
	}, [workState]);

	const tagsMappings = {
		'[<FRM>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			firm: getIDByTitle<IFirm>(firmsArray, value),
		}),
		'[<MDFCTR>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			modification: getIDByTitle<IModification>(modificationsArray, value),
		}),
		'[<NM>]': (value: string, state: IWorkflowUpdate) => ({ ...state, title: value }),
		'[<DPRT>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			currentDepartment: getIDByTitle<IDepartment>(departmentsArray, value),
		}),
		'[<DSCRPTN>]': (value: string, state: IWorkflowUpdate) => ({ ...state, description: value }),
		'[<CNTPGS>]': (value: string, state: IWorkflowUpdate) => ({ ...state, countPages: Number(value) }),
		'[<SRCHNST>]': (value: string, state: IWorkflowUpdate) => ({ ...state, urgency: Number(value) }),
		'[<CNTPCTRS>]': (value: string, state: IWorkflowUpdate) => ({ ...state, countPictures: Number(value) }),
		'[<TOSTAT>]': (value: string, state: IWorkflowUpdate) => ({ ...state, setToStat: value === 'on' }),
		'[<TP>]': (value: string, state: IWorkflowUpdate) => ({
			...state,
			type: getIDByTitle<ITypeOfWork>(typesOfWorkArray, value),
		}),
	};

	const convertText = (allDescription: string | undefined) => {
		if (!allDescription) return null;
		let newState = { ...workState };
		for (const [key, getNewState] of Object.entries(tagsMappings)) {
			const tempTxt = allDescription.split(key);
			if (tempTxt.length === 3) {
				newState = getNewState(tempTxt[1], newState);
			} else {
				return null;
			}
		}
		// console.log('сменили workstate');
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
		// console.log('зашли во впиндюриваение списка', workState, 'data.length = ', data.length);
		if (workState.firm == '' || workState.modification == '') return;
		if (data.length > 0) {
			for (const element of data) {
				//в данном случае urgency используется как степень совпадения.
				// просто лениво создавать новое поле, которое нужно только в одном месте
				element.urgency = getCoincidenceLevel(element.title!, workState.title!);
			}
			data.sort((a, b) => b.urgency! - a.urgency!);
		}
		const newList = data.length > 0 ? data : null;
		// console.log('\t\tпиндюрим в шортлист', newList);
		setNamesToShortList(newList);
		const firstItem = data.length > 0 ? data[0]._id! : '';
		const newOrderId = getIDByTitle<ITypeOfWork>(typesOfWorkArray, 'Новый заказ');
		const newState: IWorkflowUpdate = {
			...workState,
			mainId: firstItem,
		};
		if (!newList && workState.type != newOrderId) {
			newState.type = newOrderId;
		}
		// console.log('сменили workstate');
		setWorkState(newState);
		setShowAnotherNameHandler(currentType);
	};

	useEffect(() => {
		// console.log('зашли в смену списка');
		if (workState.firm !== '' &&
			workState.modification !== '') {
			let currentType = workState.type as string;
			(async () => {
				const result = await axiosCreate.post('workflows/in_this_modification',
					{
						firm: workState.firm,
						modification: workState.modification,
					},
				);
				// console.log('\tполучили дату:', result.data);
				if (result.data == null || result.data.length === 0) {
					// console.log('\tзашли менять тип? с', workState.type);
					currentType = getIDByTitle<ITypeOfWork>(typesOfWorkArray, 'Новый заказ');
					const newState = { ...workState, type: currentType };
					// console.log('\tсменили на ', currentType);
					// console.log('сменили workstate');
					setWorkState(newState);
				}
				// console.log('\tфигачим список');
				setShortList(result.data, currentType);
				makeCanSave(result.data);
			})();
		}
	}, [workState.firm,
		workState.modification]);

	useEffect(() => {
		// console.log('шортлист = ', namesToShortList);
		let currentType = workState.type as string;
		if (!namesToShortList || namesToShortList.length === 0) {
			currentType = getIDByTitle<ITypeOfWork>(typesOfWorkArray, 'Новый заказ');
			const newState = { ...workState, type: currentType };
			// console.log('\tсменили на ', newState.type);
			// console.log('сменили workstate');
			setWorkState(newState);
		}
		setShowAnotherNameHandler(currentType);
	}, [workState.type]);

	useEffect(() => {
		// console.log('вроде как поменялось название?');
		if (workState.firm !== '' && workState.modification !== '' && namesToShortList && namesToShortList.length > 0) {
			setShortList(namesToShortList, workState.type as string);
		}
	}, [workState.title]);

	const setShowAnotherNameHandler = (currentType: string) => {
		// console.log('меняем видимость', currentType);

		const index = typesOfWorkArray.findIndex(obj => obj._id === currentType);
		if (index !== -1) {
			setShowAnotherName(typesOfWorkArray[index].title != 'Новый заказ');
		}
	};

	const dispatch = useDispatch<TAppDispatch>();
	const saveWork = async () => {
		// console.log('enter to save, id = ', id);
		if (id && Object.keys(workflowsObject).length <= 0) return;
		const currentTypeIndex = typesOfWorkArray.findIndex(obj => obj._id === workState.type);
		const IdOfNewOrderType = getIDByTitle<ITypeOfWork>(typesOfWorkArray, 'Новый заказ');
		const work: IWorkflowUpdate = id ? workflowsObject[id] : {};
		const data: IWorkflowUpdate = id ? { _id: id } : {};
		if (!id || work.firm != workState.firm) data.firm = workState.firm;
		if (!id || work.modification != workState.modification) data.modification = workState.modification;
		if (!id || work.title != workState.title) data.title = workState.title;
		if (!id || work.mainId != workState.mainId) if (typesOfWorkArray[currentTypeIndex].title != 'Новый заказ') data.mainId = workState.mainId;
		if (!id && workState.type != IdOfNewOrderType) data.title = workflowsObject[workState.mainId!].title;
		if (!id || work.type != workState.type) data.type = workState.type;
		if (!id || work.countPages != workState.countPages) data.countPages = workState.countPages;
		if (!id || work.countPictures != workState.countPictures) data.countPictures = workState.countPictures;
		if (!id || work.urgency != workState.urgency) data.urgency = workState.urgency;
		if (!id || work.currentDepartment != workState.currentDepartment) data.currentDepartment = workState.currentDepartment;
		if (!id || work.setToStat != workState.setToStat) data.setToStat = workState.setToStat;
		if (!id || work.description != workState.description) data.description = workState.description;
		// console.log('\tsave data:', data);
		dispatch(patchOne({ url: 'workflows', data }));
		// console.log('clear fields');
		clearFields();
	};

	const navigate = useNavigate();
	const clearFields = () => {
		// console.log('сменили workstate');
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
		// console.log('сменили workstate из ', name);
		setWorkState({ ...workState, [name]: value });
	};

	useEffect(() => {
		setCanAutoConvert(canConvertDescription(workState.description));
	}, [workState.description]);

	useEffect(() => {
		// console.log('мы сюда зашли. и i = ', id, ' Object.keys(workflowsObject).length = ', Object.keys(workflowsObject).length);
		if (!id || Object.keys(workflowsObject).length <= 0) return;
		const work = workflowsObject[id];
		// console.log('\t work = ', work);
		if (!work) return;
		const newState: IWorkflowUpdate = {
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
		};
		// console.log('\t newState = ', newState);
		setWorkState(newState);
	}, [workflowsObject]);

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
									id="description"
									label="Описание заказа"
									multiline
									value={workState.description}
									onChange={(e) => changeField('description', e.target.value)}
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
						Автоматическое заполнение полей
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
								// showAnotherName &&
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
								<FormControlLabel
									control={
										<MaterialUISwitch
											sx={{ m: 1 }}
											icon={
												<SwitchStyledIcon
													sx={{ backgroundColor: FALSE_COLOR }}
												>
													<CancelOutlinedIcon
														sx={{ color: 'black' }}
													/>
												</SwitchStyledIcon>
											}
											checkedIcon={
												<SwitchStyledIcon
													sx={{ backgroundColor: 'green' }}
												>
													<CheckCircleOutlineIcon
														sx={{ color: 'white' }}
													/>
												</SwitchStyledIcon>
											}
										/>
									}
									label={<Typography
										sx={{
											fontWeight: 'bold',
											color: workState.setToStat ? 'green' : FALSE_COLOR,
										}}
									>
										{workState.setToStat ? 'Заносить в статистику' : 'Не заносить в статистику'}
									</Typography>}
									checked={workState.setToStat}
									onChange={(_event, checked) => changeField('setToStat', checked)}
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
								? 'Сохранить правку'
								: 'Создать новое задание'
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
								? 'Отменить правку'
								: 'Сбросить форму'
						}
					</Button></Box>
			</Box>
		</Box>
	);
}

export default CreateMainComponent;