import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { assignColor } from '@/_constants/urgencyColors.ts';
import useWorksSelectors from '@/_hooks/useWorksSelectors.hook.ts';
import WorkInfoComponent from '@/components/_shared/workInfo.component.tsx';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';

function AllWorksMainComponent() {
	const {
		typesOfWorkObject,
		firmsObject,
		modificationsObject,
		usersObject,
		departmentsObject,
	} = useReduxSelectors();

	const {
		workflowsPublishedArray,
	} = useWorksSelectors();

	const [colors, setColors] = useState<Record<string, string>>({});


	useEffect(() => {
		const newColors: Record<string, string> = {};
		for (let work of workflowsPublishedArray) {
			newColors[work._id!] = assignColor(work.urgency);
		}
		setColors(newColors);
	}, [workflowsPublishedArray]);

	const canShow = useMemo(() => {
		return workflowsPublishedArray.length > 0 &&
			Object.keys(typesOfWorkObject).length > 0 &&
			Object.keys(firmsObject).length > 0 &&
			Object.keys(usersObject).length > 0;
	}, [workflowsPublishedArray, typesOfWorkObject, firmsObject, usersObject]);

	return (
		<>
			{
				canShow &&
				<Box height={'100%'} py={2} boxSizing={'border-box'} width={'100%'} display="flex"
					 flexDirection="column">
					<Box
						display="flex"
						flexDirection="column"
						height="100%"
						borderRadius={2}
						className={'shadow-inner background'}
						boxSizing={'border-box'}
					>
						<table className={'table-container'}>
							<tbody>
							<tr>
								<td className={'align-top'}>
									<Box flexGrow={1} p={1} display="flex" gap={1}
										 overflow="auto"
										 flexDirection="column"
										 height={'100%'}
									>
										{
											workflowsPublishedArray.length > 0 &&
											workflowsPublishedArray.map((wrk) => (
												<WorkInfoComponent
													key={wrk._id}
													idProps={wrk._id!}
													colorProps={colors[wrk._id!]}
													workflowTitle={wrk.title}
													workflowFirmTitle={getTitleByID(firmsObject, wrk.firm)}
													workflowModificationTitle={getTitleByID(modificationsObject, wrk.modification)}
													workflowTypeTitle={getTitleByID(typesOfWorkObject, wrk.type)}
													workflowDepartmentTitle={getTitleByID(departmentsObject, wrk.currentDepartment)}
													workflowCountPictures={wrk.countPictures}
													workflowCountPages={wrk.countPages}
													workflowDescription={wrk.description}
													workflowAdditionalInformationToDepartment={
														wrk.executors && wrk.executors?.length > 0
															? `над заказом работа${wrk.executors.length > 1 ? 'ют:' : 'ет'} ${wrk.executors.map(_id => usersObject[_id].name).join(', ')}`
															: 'заказ в очереди.'
													}
												/>
											))
										}
									</Box>
								</td>
							</tr>
							</tbody>
						</table>
					</Box>
				</Box>}
		</>
	);
}

export default AllWorksMainComponent;