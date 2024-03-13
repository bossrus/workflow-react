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
import { getIDByTitle } from '@/_services/getIDByTitle.ts';
import { IDepartment } from '@/interfaces/department.interface.ts';
import { ITypeOfWork } from '@/interfaces/worktype.interface.ts';
import { IModification } from '@/interfaces/modification.interface.ts';
import { IFirm } from '@/interfaces/firm.interface.ts';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IWorkflowUpdate } from '@/interfaces/workflow.interface.ts';
import { useDispatch } from 'react-redux';
import { patchOne } from '@/store/_shared.thunks.ts';
import { TAppDispatch } from '@/store/_store.ts';

const FALSE_COLOR = '#92a38f';

// const TEST_DATA1 = 'в этом текстовом боксе нужно сделать «Выделить всё», скопировать в память, и целиком вставить в поле «Описание работы:» на сайте www.work-flow.site. Далее на сайте кликнуть по строке «Распознать текст» под полем «Описание работы».      [<NM>]Destinations D_ZP[<NM>][<SRCHNST>]50000[<SRCHNST>][<TP>]Досыл TIFF[<TP>][<TOSTAT>]on[<TOSTAT>][<FRM>]АЭРОФЛОТ[<FRM>][<DPRT>]Ретушь[<DPRT>][<CNTPGS>]2[<CNTPGS>][<MDFCTR>]0523[<MDFCTR>][<CNTPCTRS>]1[<CNTPCTRS>][<DSCRPTN>]название вёрстки «Destinations D_ZP.indd» количество картинок на обработку ≈ 1 название PDF с комментариями «Destinations D_ZP_comment_Mon_Mar_27_2023_15-21-10.pdf»  ------------ 1294910638-265_1.tif обрабатывать прям в цмике. не переделять ------------ 1294910638-265_1.tif шар вытравить на слой, потом только стёклам сделать прозрачность 70%[<DSCRPTN>]';
// const TEST_DATA1 = 'в этом текстовом боксе нужно сделать «Выделить всё», скопировать в память, и целиком вставить в поле «Описание работы:» на сайте www.work-flow.site. Далее на сайте кликнуть по строке «Распознать текст» под полем «Описание работы».      [<NM>]++obektiv_APR[<NM>][<SRCHNST>]50000[<SRCHNST>][<TP>]Новый заказ[<TP>][<TOSTAT>]on[<TOSTAT>][<FRM>]журнал S7[<FRM>][<DPRT>]Ретушь[<DPRT>][<CNTPGS>]2[<CNTPGS>][<MDFCTR>]0423[<MDFCTR>][<CNTPCTRS>]1[<CNTPCTRS>][<DSCRPTN>]количество картинок на обработку ≈ 1 название PDF с комментариями «++obektiv_APR_comment_Tue_Mar_14_2023_10-09-13.pdf» [<DSCRPTN>]';
const TEST_DATA1 = 'в этом текстовом боксе нужв этом текстовом боксе нужно сделать «Выделить всё», скопировать в память, и целиком вставить в поле «Описание работы:» на сайте www.work-flow.site. Далее на сайте кликнуть по строке «Распознать текст» под полем «Описание работы».      [<NM>]ap04_Select_Techno_1pic[<NM>][<SRCHNST>]50000[<SRCHNST>][<TP>]Правка[<TP>][<TOSTAT>]on[<TOSTAT>][<FRM>]аэроПРЕМИУМ[<FRM>][<DPRT>]Ретушь[<DPRT>][<CNTPGS>]1[<CNTPGS>][<MDFCTR>]0423[<MDFCTR>][<CNTPCTRS>]undefined[<CNTPCTRS>][<DSCRPTN>]название вёрстки «ap04_Select_Techno_1pic.indd» название PDF с комментариями «ap04_Select_Techno_1pic_comment_Wed_Mar_01_2023_14-53-51.pdf»  ------------ Monolith right.tif убрать выбеливание фона, потом изначальный фон слегка уплотнить[<DSCRPTN>]';

function CreateMainComponent() {
	const {
		departmentsArray, firmsArray, modificationsArray, typesOfWorkArray,
	} = useReduxSelectors();


	const [firm, setFirm] = useState('');
	const [modification, setModification] = useState('');
	const [title, setTitle] = useState('');
	const [idOriginal, setIdOriginal] = useState('');
	const [typeOfWork, setTypeOfWork] = useState('');
	const [countOfPages, setCountOfPages] = useState(0);
	const [countOfPictures, setCountOfPictures] = useState(0);
	const [urgency, setUrgency] = useState(50000);
	const [department, setDepartment] = useState('');
	const [saveToStat, setSaveToStat] = useState(true);
	const [description, setDescription] = useState(TEST_DATA1);
	const [canAutoConvert, setCanAutoConvert] = useState(false);
	const [namesToShortList, setNamesToShortList] = useState<IWorkflowUpdate[] | null>(null);


	const [canSave, setCanSave] = useState(false);
	const [showAnotherName, setShowAnotherName] = useState(false);

	const makeCanSave = (list: IWorkflowUpdate[] | null) => {
		console.log('можно ли сохранять?');
		console.log('namesToShortList = ', list);
		const isCoincidence = list?.some(item => item.title?.toLowerCase() === title.toLowerCase());
		const index = typesOfWorkArray.findIndex(obj => obj._id === typeOfWork);
		const isNotNewOrder = index !== -1 && title.length > 0 && typesOfWorkArray[index].title !== 'Новый заказ';
		const isFormFilled = firm !== '' &&
			modification !== '' &&
			title !== '' &&
			typeOfWork !== '' &&
			countOfPages !== 0 &&
			countOfPictures !== 0 &&
			department !== '' &&
			description !== '';
		console.log('\tisCoincidence = ', isCoincidence);
		console.log('\tisNotNewOrder = ', isNotNewOrder);
		console.log('\t(isFormFilled) = ', isFormFilled);
		console.log('\tidOriginal =', idOriginal);
		const result = (isNotNewOrder || !isCoincidence) && isFormFilled;
		console.log('\t\tитого = ', result);
		setCanSave(result);
	};

	useEffect(() => {
		makeCanSave(namesToShortList);
	}, [firm, modification, title, idOriginal, typeOfWork, countOfPages, countOfPictures, urgency, department, description]);

	const tagsMappings = {
		'[<FRM>]': (value: string) => setFirm(getIDByTitle<IFirm>(firmsArray, value)),
		'[<MDFCTR>]': (value: string) => setModification(getIDByTitle<IModification>(modificationsArray, value)),
		'[<NM>]': setTitle,
		'[<DPRT>]': (value: string) => setDepartment(getIDByTitle<IDepartment>(departmentsArray, value)),
		'[<DSCRPTN>]': setDescription,
		'[<CNTPGS>]': (value: string) => setCountOfPages(Number(value)),
		'[<SRCHNST>]': (value: string) => setUrgency(Number(value)),
		'[<CNTPCTRS>]': (value: string) => setCountOfPictures(Number(value)),
		'[<TOSTAT>]': (value: string) => setSaveToStat(value === 'on'),
		'[<TP>]': (value: string) => setTypeOfWork(getIDByTitle<ITypeOfWork>(typesOfWorkArray, value)),
	};

	const getCoincidenceLevel = (original: string, newStr: string) => {
		let count = 0;
		for (let len = 1; len <= original.length; len++) {
			for (let i = 0; i <= original.length - len; i++) {
				const X = original.substring(i, i + len);
				if (newStr.toLowerCase().includes(X.toLowerCase())) {
					const occurrences = newStr.split(X).length - 1;
					count += Math.pow(occurrences, X.length);
				}
				if (X.length > newStr.length) {
					return count;
				}
			}
		}
		return count;
	};

	const setShortList = (data: IWorkflowUpdate[]) => {
		if (firm == '' || modification == '' || title == '') return;
		if (data.length > 0) {
			for (const element of data) {
				//в данном случае urgency используется как степень совпадения.
				// просто лениво создавать новое поле, которое нужно только в одном месте
				element.urgency = getCoincidenceLevel(element.title!, title);
			}
			data.sort((a, b) => b.urgency! - a.urgency!);
		}
		setNamesToShortList(data.length > 0 ? data : null);
		const firstItem = data.length > 0 ? data[0]._id! : '';
		console.log('firstItem = ', firstItem);
		setIdOriginal(firstItem);
	};

	useEffect(() => {
		console.log('юзэффект перед запросом списка');
		if (firm !== '' &&
			modification !== '') {
			(async () => {
				console.log('запрос списка');
				const result = await axiosCreate.post('workflows/in_this_modification',
					{
						firm: firm,
						modification: modification,
					},
				);
				console.log('сохраняем шортлист', result.data);
				if (result.data == null || result.data.length === 0) {
					console.log('меняем тип на новый заказ');
					setTypeOfWork(getIDByTitle<ITypeOfWork>(typesOfWorkArray, 'Новый заказ'));
				}
				setShortList(result.data);
				setTimeout(() => {
					setShowAnotherNameHandler();
					makeCanSave(result.data);
				}, 0);
			})();
		}
	}, [firm,
		modification,
		typeOfWork]);

	useEffect(() => {
		if (firm !== '' && modification !== '' && namesToShortList && namesToShortList.length > 0) {
			setShortList(namesToShortList);
		}
	}, [title]);

	const setShowAnotherNameHandler = () => {
		const index = typesOfWorkArray.findIndex(obj => obj._id === typeOfWork);
		if (index !== -1) {
			setShowAnotherName(title.length > 0 && typesOfWorkArray[index].title != 'Новый заказ');
		}
	};

	const dispatch = useDispatch<TAppDispatch>();
	const saveWork = async () => {
		const index = typesOfWorkArray.findIndex(obj => obj._id === typeOfWork);

		const data: IWorkflowUpdate = {};
		data.firm = firm;
		data.modification = modification;
		data.title = title;
		if (typesOfWorkArray[index].title != 'Новый заказ') data.mainId = idOriginal;
		data.type = typeOfWork;
		data.countPages = countOfPages;
		data.countPictures = countOfPictures;
		data.urgency = urgency;
		data.currentDepartment = department;
		data.setToStat = saveToStat;
		data.description = description;
		dispatch(patchOne({ url: 'workflows', data }));
	};

	useEffect(() => {
		setShowAnotherNameHandler();
	}, [typeOfWork]);

	const convertText = (allDescription: string) => {
		setNamesToShortList(null);
		for (const [key, setValue] of Object.entries(tagsMappings)) {
			const tempTxt = allDescription.split(key);
			if (tempTxt.length === 3) {
				setValue(tempTxt[1]);
			} else {
				return null;
			}
		}
	};

	const canConvertDescription = (allDescription: string) => {
		for (const key of Object.keys(tagsMappings)) {
			const tempTxt = allDescription.split(key);
			if (tempTxt.length !== 3) {
				return false;
			}
		}
		return true;
	};

	useEffect(() => {
		setCanAutoConvert(canConvertDescription(description));
	}, [description]);

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
									value={description}
									onChange={(e) => setDescription(e.target.value)}
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
						onClick={() => convertText(description)}
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
									value={firm}
									onChange={(event) => {
										setFirm(event.target.value);
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
									value={modification}
									onChange={(event) => {
										setModification(event.target.value);
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
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className={`${showAnotherName ? 'inactive' : ''}`}
							/>
							{title.length > 0 &&
								<FormControl variant="standard" fullWidth>
									<Select
										className={`${showAnotherName ? '' : 'inactive'}`}
										value={idOriginal}
										onChange={(event) => {
											setIdOriginal(event.target.value);
										}}
										sx={{ pl: '5px' }}
									>
										{namesToShortList && typesOfWorkArray && typesOfWorkArray.length > 0 && (
											namesToShortList.map((item) => {
												return (<MenuItem key={item._id} value={item._id}>
													{item.title}
												</MenuItem>);
											})
										)
										}
									</Select>
								</FormControl>}
							<FormControl variant="standard" fullWidth>
								<InputLabel id="typesOfWork">Тип работы</InputLabel>
								<Select
									value={typeOfWork}
									onChange={(event) => {
										setTypeOfWork(event.target.value);
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
								value={countOfPages}
								onChange={(e) => setCountOfPages(+e.target.value)}
							/>
							<TextField
								fullWidth
								id="countPictures"
								label="Количество картинок"
								variant="standard"
								type={'number'}
								value={countOfPictures}
								onChange={(e) => setCountOfPictures(+e.target.value)}
							/>
							<TextField
								fullWidth
								id="urgency"
								label="Срочность"
								variant="standard"
								type={'number'}
								value={urgency}
								onChange={(e) => setUrgency(+e.target.value)}
							/>
							<FormControl variant="standard" fullWidth>
								<InputLabel id="departments">Работа в отдел</InputLabel>
								<Select
									value={department}
									onChange={(event) => {
										setDepartment(event.target.value);
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
											color: saveToStat ? 'green' : FALSE_COLOR,
										}}
									>
										{saveToStat ? 'Заносить в статистику' : 'Не заносить в статистику'}
									</Typography>}
									checked={saveToStat}
									onChange={(_event, checked) => setSaveToStat(checked)}
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
					>

						Создать новое задание / правку. разделить
					</Button>
					<Button
						variant="contained"
						size="small"
						fullWidth
						sx={{ borderRadius: '10px' }}>
						Очистить все поля
					</Button></Box>
			</Box>
		</Box>
	);
}

export default CreateMainComponent;