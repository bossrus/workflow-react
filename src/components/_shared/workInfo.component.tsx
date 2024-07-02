import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ReactNode, useEffect, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useNavigate } from 'react-router-dom';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';

interface IProps {
	idProps: string,
	colorProps: string,
	checkedProps?: boolean;
	changeChecked?: (id: string) => void,
	creator?: string,
	workflowTitle: string,
	workflowFirmTitle: string,
	workflowModificationTitle: string,
	workflowTypeTitle: string,
	workflowDepartmentTitle?: string,
	workflowCountPictures: number,
	workflowCountPages: number,
	workflowDescription: string,
	workflowAdditionalInformationToDepartment?: string,
	workflowShowDepartment?: boolean,
	children?: ReactNode;
}

function WorkInfoComponent({
							   idProps,
							   colorProps,
							   checkedProps,
							   changeChecked,
							   creator,
							   workflowTitle,
							   workflowFirmTitle,
							   workflowModificationTitle,
							   workflowTypeTitle,
							   workflowDepartmentTitle,
							   workflowCountPictures,
							   workflowCountPages,
							   workflowDescription,
							   workflowAdditionalInformationToDepartment,
							   workflowShowDepartment = true,
							   children,
						   }: IProps) {
	const [showDescription, setShowDescription] = useState(false);
	const { me, states: { deleteMessage } } = useReduxSelectors();

	const navigate = useNavigate();
	const editWorkflow = (id: string) => {
		navigate(`/main/create/${id}`);
	};

	const changeShowDescr = () => {
		setShowDescription(!showDescription);
	};

	const dispatch = useDispatch<TAppDispatch>();
	const marker = 'заказ';

	const deleteWorkflow = useDeleteRecord(idProps, marker, `${workflowTitle} <small><small><i>(${workflowFirmTitle} №${workflowModificationTitle}, ${workflowTypeTitle})</i></small></small>`);

	useEffect(() => {
		if (isNotValidDeleteMessage(deleteMessage, marker, idProps)) return;
		if (deleteMessage!.result) {
			dispatch(deleteOne({ url: 'workflows', id: idProps }));
		}
		dispatch(setState({ deleteMessage: undefined }));
	}, [deleteMessage]);

	return (
		<>
			<Box
				className={'display-flex flex-direction-column border-radius-2su border-color-my-gray-light background-color-white text-align-center width-100'}
			>
				<Box
					bgcolor={colorProps}
					className={'display-flex flex-direction-row width-100 box-shadow padding-1su border-radius-2su box-sizing-border-box gap-2su align-items-center flex-wrap'}
				>
					<Box>
						{
							changeChecked !== undefined &&
							checkedProps !== undefined &&
							<Checkbox
								checked={checkedProps}
								onChange={() => changeChecked(idProps)}
							/>
						}
						{creator}
					</Box>
					<Box
						className={'flex-grow-1 cursor-pointer'}
						onClick={() => changeShowDescr()}
					>
						<strong>{workflowTitle}</strong>
					</Box>
					<Box
						className={'flex-grow-1'}
					>
						<Box>
							{workflowFirmTitle}
						</Box>
						<Box>
							№ {workflowModificationTitle}
						</Box>
					</Box>
					<Box
						className={'flex-grow-1'}
					>
						<Box>
							<i>{workflowTypeTitle}</i>
						</Box>
						<Box>
							{workflowCountPictures} tif, {workflowCountPages} стр.
						</Box>
					</Box>
					{
						workflowShowDepartment &&
						<Box
							className={'flex-grow-1'}
						>
							{
								workflowAdditionalInformationToDepartment &&
								<Box>
									{workflowAdditionalInformationToDepartment}
								</Box>
							}
							<Box>
								<i>отдел «{workflowDepartmentTitle}»</i>
							</Box>
						</Box>}
					{
						me.canStartStopWorks &&
						<Box
							className={'align-items-end'}
						>
							<RoundButtonComponent
								mode={'edit'}
								id={idProps}
								dis={false}
								onClickHere={editWorkflow} />
							<RoundButtonComponent
								mode={'delete'}
								id={idProps}
								dis={false}
								onClickHere={deleteWorkflow}
							/>
						</Box>
					}
					<Box>
						{children}
					</Box>
				</Box>
				{showDescription &&
					<Box
						className={'padding-1su text-align-left'}
					>
						<small>
							<pre className={'text-warp'}>
								<small>
									{workflowDescription}
								</small>
							</pre>
						</small>
					</Box>
				}
			</Box>
		</>
	);
}

export default WorkInfoComponent;