import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect, useRef, useState } from 'react';
import ModalAppComponent from '@/components/app/modal.app.component.tsx';
import axiosCreate from '@/_api/axiosCreate.ts';
import { useDispatch } from 'react-redux';
import { invites, TAppDispatch, workflows } from '@/store/_store.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import axios from 'axios';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';
import { FALSE_COLOR } from '@/_constants/colors.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';
import OutlinedSmallButtonComponent from '@/components/_shared/outlinedSmallButtonComponent.tsx';


interface IOrderElement {
	idWorkflow: string;
	title: string;
	description: string;
}

interface IOrders {
	[key: string]: IOrderElement;
}

const InvitesAppComponent = () => {

	const {
		inviteToJoin,
		usersObject,
		firmsObject,
		typesOfWorkObject,
		modificationsObject,
		departmentsObject,
	} = useReduxSelectors();

	const {
		workflowsObject,
	} = useWorksSelectors();

	const [checks, setChecks] = useState<Record<string, boolean>>({});

	const [orders, setOrders] = useState<IOrders>({});

	const handleSwitchChange = (key: string, checked: boolean) => {
		setChecks((prevChecks) => ({
			...prevChecks,
			[key]: checked,
		}));
	};

	useEffect(() => {
		if (Object.keys(inviteToJoin).length <= 0 ||
			Object.keys(workflowsObject).length <= 0 ||
			Object.keys(usersObject).length <= 0 ||
			Object.keys(firmsObject).length <= 0 ||
			Object.keys(typesOfWorkObject).length <= 0) return;

		const newOrders: IOrders = {};
		const newChecks: Record<string, boolean> = {};

		for (const order of Object.values(inviteToJoin)) {

			const workflow = workflowsObject[order.workflow];

			if (workflow && newOrders[order.workflow] === undefined && order.department === workflow.currentDepartment) {

				newChecks[order.workflow] = true;
				const description = getTitleByID(firmsObject, workflow.firm)
					+ ' №'
					+ getTitleByID(modificationsObject, workflow.modification)
					+ ', '
					+ getTitleByID(typesOfWorkObject, workflow.type)
					+ ', '
					+ getTitleByID(departmentsObject, order.department);

				newOrders[order.workflow] = {
					idWorkflow: order.workflow,
					title: getTitleByID(workflowsObject, order.workflow),
					description: description,
				};
			}
		}
		setOrders(newOrders);
		setChecks(newChecks);
	}, [inviteToJoin,
		workflowsObject,
		usersObject,
		firmsObject,
		typesOfWorkObject]);

	const checksRef = useRef(checks);
	useEffect(() => {
		checksRef.current = checks;
	}, [checks]);

	const dispatch = useDispatch<TAppDispatch>();
	const takeWorks = (mode: 'all' | 'nothing' | 'byChecks' = 'byChecks') => {
		const data: string[] = [];
		if (mode === 'byChecks' || mode === 'all') {
			for (let key in checksRef.current) {
				if (checksRef.current[key] || mode === 'all') {
					data.push(key);
				}
			}
		}
		(async () => {
			try {
				if (data.length > 0) {
					await axiosCreate.patch('/workflows/take', { ids: data });
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const errorMessage = error.response?.data;
					dispatch(workflows.actions.setError(errorMessage));
				} else {
					dispatch(workflows.actions.setError('An unexpected error occurred'));
				}
			}
			await axiosCreate.delete('/invites', {});
		})();
		dispatch(invites.actions.clearAll());
		setChecks({});
		setOrders({});
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				takeWorks('all');
			}
			if (event.key === 'Escape') {
				takeWorks('nothing');
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<>
			{
				Object.keys(orders).length > 0 &&
				<ModalAppComponent>
					<h2
						className={'margin-top-0 text-align-center'}
					>Вас приглашают присоединиться к
						заказ{Object.keys(orders).length == 1 ? 'у' : 'ам'}:</h2>
					<Box
						className={'display-flex flex-direction-column height-100 width-100'}
					>
						{
							Object.entries(orders).map(([key, value]) => (
								<Box
									key={key}
									className={'display-flex flex-direction-row width-100 flex-wrap gap-1su align-items-center'}
								>
									<Box>
										<strong>{value.title}</strong>
									</Box>
									<Box
										className={'flex-grow-1'}
									>
										<small>
											(<i>
											{value.description}
										</i>)
										</small>
									</Box>
									<Box
										className={'scale-08 margin-right-minus30px'}
									>
										<SwitchButtonComponent
											checkState={checks[key]}
											changeChecked={(checked) => handleSwitchChange(key, checked)}
											trueBackgroundColor={'green'}
											falseBackgroundColor={FALSE_COLOR}
											trueTitle={'Присоединиться'}
											falseTitle={'Отказаться'}
											mode={'usual'}
										/>
									</Box>
								</Box>
							))
						}

					</Box>
					<OutlinedSmallButtonComponent
						className={'width-100 margin-bottom-5px'}
						onClick={() => takeWorks('byChecks')}
						color={'success'}
					>
						Ok
					</OutlinedSmallButtonComponent>
					<small>
						<strong>
							[ENTER]
						</strong>
						{' — '}
						<i>
						<span className={'color-green'}>
							одобрить
						</span> присоединение ко всем заказам, вне зависимости от переключателей
						</i>
						<br />
						<strong>
							[ESC]
						</strong>
						{' — '}
						<i>
							<span className={'color-red'}>
								отменить
							</span> присоединение ко всем заказам, вне зависимости от
							переключателей
						</i>
					</small>
				</ModalAppComponent>
			}
		</>
	);
};

export default InvitesAppComponent;