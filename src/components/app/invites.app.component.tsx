import { Box, Button } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import SwitchComponent from '@/components/_shared/switch.component.tsx';
import { useEffect, useRef, useState } from 'react';
import ModalAppComponent from '@/components/app/modal.app.component.tsx';
import axiosCreate from '@/_api/axiosCreate.ts';
import { useDispatch } from 'react-redux';
import { invites, TAppDispatch, workflows } from '@/store/_store.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import axios from 'axios';


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
		// console.log(inviteToJoin);
		for (const order of Object.values(inviteToJoin)) {
			if (newOrders[order.workflow] === undefined && order.department === workflowsObject[order.workflow].currentDepartment) {
				newChecks[order.workflow] = true;
				const description = firmsObject[workflowsObject[order.workflow].firm].title
					+ ' №'
					+ modificationsObject[workflowsObject[order.workflow].modification].title
					+ ', '
					+ typesOfWorkObject[workflowsObject[order.workflow].type].title
					+ ', '
					+ departmentsObject[order.department].title;

				newOrders[order.workflow] = {
					idWorkflow: order.workflow,
					title: workflowsObject[order.workflow].title,
					description: description,
				};
			}
		}
		setOrders(newOrders);
		setChecks(newChecks);
	}, [inviteToJoin]);

	const checksRef = useRef(checks);
	useEffect(() => {
		checksRef.current = checks;
	}, [checks]);

	const dispatch = useDispatch<TAppDispatch>();
	const takeWorks = (mode: 'all' | 'nothing' | 'byChecks' = 'byChecks') => {
		// console.log('взяли', mode);
		// console.log('\tchecks = ', checksRef.current);
		const data: string[] = [];
		if (mode === 'byChecks' || mode === 'all') {
			for (let key in checksRef.current) {
				if (checksRef.current[key] || mode === 'all') {
					data.push(key);
				}
			}
		}
		// console.log('bnjuj data = ', data);
		(async () => {
			try {
				if (data.length > 0) {
					await axiosCreate.patch('/workflows/take', { ids: data });
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					// Now TypeScript knows error is an AxiosError, allowing access to error.response
					const errorMessage = error.response?.data;
					dispatch(workflows.actions.setError(errorMessage));
				} else {
					// Handle non-Axios errors or provide a generic error message
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
					<h2 style={{ marginTop: 0, textAlign: 'center' }}>Вас приглашают присоединиться к
						заказ{Object.keys(orders).length == 1 ? 'у' : 'ам'}:</h2>
					<Box
						display="flex"
						flexDirection={'column'}
						height={'100%'}
						width={'100%'}
					>
						{
							Object.entries(orders).map(([key, value]) => (
								<Box
									display="flex"
									flexDirection={'row'}
									width={'100%'}
									flexWrap={'wrap'}
									key={key}
									gap={1}
									alignItems={'center'}
								>
									<Box>
										<strong>{value.title}</strong>
									</Box>
									<Box flexGrow={1}>
										<small>
											(<i>
											{value.description}
										</i>)
										</small>
									</Box>
									<Box className={'scale'} sx={{ mr: '-30px' }}>
										<SwitchComponent switchLabel={'Присоединиться'} valueChecked={checks[key]}
														 changeChecked={(checked) => handleSwitchChange(key, checked)}
										/>
									</Box>
								</Box>
							))
						}

					</Box>
					<Button
						variant="outlined"
						size="small"
						fullWidth
						sx={{ mt: 2, borderRadius: '10px' }}
						color={'success'}
						className={'up-shadow'}
						onClick={() => takeWorks('byChecks')}
					>
						Ок
					</Button>
					<small>
						<strong>
							[ENTER]
						</strong>
						{' — '}
						<i>
						<span className={'green-text'}>
							одобрить
						</span> присоединение ко всем заказам, вне зависимости от переключателей
						</i>
						<br />
						<strong>
							[ESC]
						</strong>
						{' — '}
						<i>
							<span className={'red-text'}>
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