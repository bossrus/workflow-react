import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import { assignColor } from '@/_constants/urgencyColors.ts';
import WorkInfoComponent from '@/components/_shared/workInfo.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { publishWorkflowThunk } from '@/store/workflows.thunks.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';
import OutlinedSmallButtonComponent from '@/components/_shared/outlinedSmallButtonComponent.tsx';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

function NotPublishedMainComponent() {
	const {
		typesOfWorkObject,
		departmentsObject,
		firmsObject,
		modificationsObject,
		usersObject,
		me,
	} = useReduxSelectors();

	const navigate = useNavigate();

	useEffect(() => {
		if (Object.keys(me).length <= 0) return;
		if (!me.canStartStopWorks)
			navigate('/main');
	}, [me.canStartStopWorks]);

	const { workflowsNotPublishedObject } = useWorksSelectors();

	const [checks, setChecks] = useState<Record<string, boolean>>({});
	const [myChecks, setMyChecks] = useState<Record<string, boolean>>({});

	const [colors, setColors] = useState<Record<string, string>>({});
	useEffect(() => {
		if (!workflowsNotPublishedObject) return;
		const keys = Object.keys(workflowsNotPublishedObject);
		if (keys.length <= 0) return;
		const allChecks: Record<string, boolean> = {};
		const allMyChecks: Record<string, boolean> = {};
		const newColors: Record<string, string> = {};
		keys.map((key) => {
			allChecks[key] = false;
			newColors[key] = assignColor(workflowsNotPublishedObject[key].urgency);
			if (me._id === workflowsNotPublishedObject[key].whoAddThisWorkflow) {
				allMyChecks[key] = false;
			}
		});
		setChecks(allChecks);
		setMyChecks(allMyChecks);
		setColors(newColors);
	}, [workflowsNotPublishedObject]);

	const changeChecked = (id: string) => {
		setChecks({ ...checks, [id]: !checks[id] });
		if (myChecks[id] !== undefined)
			setMyChecks({ ...myChecks, [id]: !myChecks[id] });
		setAllTrue();
	};

	const [allTrueChecks, setAllTrueChecks] = useState(false);
	const [allMyTrueChecks, setAllMyTrueChecks] = useState(false);
	const [anyTrueChecks, setAnyTrueChecks] = useState(false);

	useEffect(() => {
		setAllTrue();
	}, [checks, myChecks]);
	const setAllTrue = () => {
		const myTrue = !!Object.values(myChecks).length && Object.values(myChecks).every(value => value);
		const allTrue = !!Object.values(checks).length && Object.values(checks).every(value => value);
		const anyTrue = !!Object.values(checks).length && Object.values(checks).some(value => value);
		setAllMyTrueChecks(myTrue);
		setAllTrueChecks(allTrue);
		setAnyTrueChecks(anyTrue);
	};

	const myChecksRef = useRef(myChecks);
	useEffect(() => {
		myChecksRef.current = myChecks;
	}, [myChecks]);

	const checksRef = useRef(checks);
	useEffect(() => {
		checksRef.current = checks;
	}, [checks]);

	const allMyTrueChecksRef = useRef(allMyTrueChecks);
	useEffect(() => {
		allMyTrueChecksRef.current = allMyTrueChecks;
	}, [allMyTrueChecks]);

	const allTrueChecksRef = useRef(allTrueChecks);
	useEffect(() => {
		allTrueChecksRef.current = allTrueChecks;
	}, [allTrueChecks]);

	const checkUncheckMyWorks = () => {

		console.log(checksRef.current);
		const allMyChecks: Record<string, boolean> = {};
		const allChecks: Record<string, boolean> = JSON.parse(JSON.stringify(checksRef.current));
		Object.keys(myChecksRef.current).map((key) => {
			allMyChecks[key] = !allMyTrueChecksRef.current;
			allChecks[key] = !allMyTrueChecksRef.current;
		}, {});

		setMyChecks(allMyChecks);
		setChecks(allChecks);
	};


	const checkUncheckAllWorks = () => {
		const allMyChecks: Record<string, boolean> = Object.keys(myChecksRef.current).reduce((acc, key) => ({
			...acc,
			[key]: !allTrueChecksRef.current,
		}), {});
		const allChecks: Record<string, boolean> = Object.keys(checksRef.current).reduce((acc, key) => ({
			...acc,
			[key]: !allTrueChecksRef.current,
		}), {});

		setMyChecks(allMyChecks);
		setChecks(allChecks);
		setAllTrue();
	};

	const dispatch = useDispatch<TAppDispatch>();

	async function publishWorks() {
		if (Object.keys(checksRef.current).length <= 0) return;
		const data: string[] = Object.entries(checksRef.current)
			.reduce<string[]>((acc, [key, value]) => (value ? [...acc, key] : acc), []);
		if (data.length <= 0) return;
		dispatch(publishWorkflowThunk({ ids: data }));
		navigate(`/main/`);
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!event.altKey || event.shiftKey || event.ctrlKey || event.metaKey) return;

			if (event.key.toLowerCase() === 'enter') {
				publishWorks().then();
			}

			if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'ф') {
				checkUncheckAllWorks();
			}
			if (event.key.toLowerCase() === 'y' || event.key.toLowerCase() === 'н') {
				checkUncheckMyWorks();
			}

		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const canShowPage = () => {
		return workflowsNotPublishedObject &&
			firmsObject &&
			usersObject &&
			checks &&
			Object.keys(workflowsNotPublishedObject).length > 0 &&
			Object.keys(firmsObject).length > 0 &&
			Object.keys(usersObject).length > 0 &&
			Object.keys(checks).length > 0;
	};

	return (
		<>
			{
				canShowPage() &&
				<Box
					className={'height-100 padding-y-2su box-sizing-border-box width-100 display-flex flex-direction-column'}
				>
					<Box
						className={'display-flex flex-direction-column height-100 border-radius-2su box-sizing-border-box shadow-inner background'}
					>
						<table className={'table-container'}>
							<tbody>
							<tr>
								<td className={'vertical-align-top'}>
									<Box
										className={'flex-grow-1 padding-1su display-flex gap-1su overflow-auto flex-direction-column height-100'}
									>
										{
											Object.keys(workflowsNotPublishedObject).length > 0 &&
											Object.keys(workflowsNotPublishedObject).map((key) => (
												<WorkInfoComponent
													key={key}
													idProps={key}
													colorProps={colors[key]}
													checkedProps={checks[key]}
													workflowTitle={getTitleByID(workflowsNotPublishedObject, key)}
													workflowFirmTitle={getTitleByID(firmsObject, workflowsNotPublishedObject[key].firm)}
													workflowModificationTitle={getTitleByID(modificationsObject, workflowsNotPublishedObject[key].modification)}
													workflowTypeTitle={getTitleByID(typesOfWorkObject, workflowsNotPublishedObject[key].type)}
													workflowDepartmentTitle={getTitleByID(departmentsObject, workflowsNotPublishedObject[key].currentDepartment)}
													workflowCountPictures={workflowsNotPublishedObject[key].countPictures}
													workflowCountPages={workflowsNotPublishedObject[key].countPages}
													workflowDescription={workflowsNotPublishedObject[key].description}
													changeChecked={() => changeChecked(key)}
													creator={usersObject[workflowsNotPublishedObject[key].whoAddThisWorkflow] ? usersObject[workflowsNotPublishedObject[key].whoAddThisWorkflow].name : 'тютю'}
												/>
											))
										}
									</Box>
								</td>
							</tr>
							</tbody>
						</table>
						<Box
							className={'display-flex flex-direction-row width-100 box-sizing-border-box gap-2su padding-2su align-items-center flex-wrap'}
						>
							<OutlinedSmallButtonComponent
								color={'inherit'}
								onClick={checkUncheckAllWorks}
							>
								<span>{allTrueChecks ? 'Снять выделение со всех работ' : 'Выделить все работы'} <small
									className={'color-my-gray'}>(ALT+A)</small></span>
							</OutlinedSmallButtonComponent>
							{
								Object.keys(myChecks).length > 0 &&
								<OutlinedSmallButtonComponent
									color={'inherit'}
									onClick={checkUncheckMyWorks}
								>
									<span>{
										allMyTrueChecks
											? 'Снять выделение со всех ваших работ'
											: 'Выделить все ваши работы'
									} <small
										className={'color-my-gray'}>(ALT+Y)</small>
									</span>
								</OutlinedSmallButtonComponent>
							}
							<ContainedSmallButtonComponent
								color={'success'}
								disabled={!anyTrueChecks}
								onClick={publishWorks}
							>
								<span>Опубликовать выделенные работы <small
									className={'color-my-light-gray'}>(ALT+ENTER)</small></span>
							</ContainedSmallButtonComponent>
						</Box>
					</Box>
				</Box>}
		</>
	);
}

export default NotPublishedMainComponent;