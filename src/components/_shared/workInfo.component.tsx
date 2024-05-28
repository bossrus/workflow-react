import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import { ReactNode, useEffect, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useNavigate } from 'react-router-dom';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';

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

	const setShowDescr = (show: boolean) => {
		setShowDescription(show);
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
			<Box display="flex"
				 flexDirection="column"
				 borderRadius={2}
				 border={1}
				 borderColor={'#cbcbcb'}
				 bgcolor={'#fefefe'}
				 onMouseOver={() => setShowDescr(true)}
				 onMouseOut={() => setShowDescr(false)}
				 textAlign={'center'}
			>
				<Box display="flex"
					 flexDirection="row"
					 width={'100%'}
					 boxShadow={2}
					 p={1}
					 bgcolor={colorProps}
					 borderRadius={2}
					 boxSizing={'border-box'}
					 gap={2}
					 alignItems={'center'}
					 flexWrap={'wrap'}
				>
					<Box>
						{
							changeChecked !== undefined &&
							checkedProps !== undefined &&
							<Checkbox checked={checkedProps}
									  onChange={() => changeChecked(idProps)} />
						}
						{creator}
					</Box>
					<Box flexGrow={1}>
						<strong>{workflowTitle}</strong>
					</Box>
					<Box flexGrow={1}>
						<Box>
							{workflowFirmTitle}
						</Box>
						<Box>
							№ {workflowModificationTitle}
						</Box>
					</Box>
					<Box flexGrow={1}>
						<Box>
							<i>{workflowTypeTitle}</i>
						</Box>
						<Box>
							{workflowCountPictures} tif, {workflowCountPages} стр.
						</Box>
					</Box>
					{
						workflowShowDepartment &&
						<Box flexGrow={1}>
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
						<Box alignItems={'end'}>
							<EditButtonComponent id={idProps}
												 dis={false}
												 onClickHere={editWorkflow} />
							<DeleteButtonComponent
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
					<Box p={1} textAlign={'left'}>
						<small>
							<pre className={'warp-text'}>
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