import { Box, Typography } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { IDepartment } from '@/interfaces/department.interface.ts';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useEffect } from 'react';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';

interface IOneDepartmentProps {
	department: IDepartment;
}

const OneDepartmentDepartmentsComponent = ({
											   department: { _id, title, numberInWorkflow, isUsedInWorkflow },
										   }: IOneDepartmentProps) => {

	const { currentDepartment, deleteMessage } = useReduxSelectors().states;

	const disabled = currentDepartment === _id;

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedDepartment = (id: string | undefined) => {
		dispatch(setState({ currentDepartment: id }));
	};

	const marker = 'отдел';

	const deleteDepartment = useDeleteRecord(_id, marker, title);

	useEffect(() => {
		if (isNotValidDeleteMessage(deleteMessage, marker, _id)) return;
		if (deleteMessage!.result) {
			dispatch(deleteOne({ url: 'departments', id: _id }));
		}
		dispatch(setState({ deleteMessage: undefined }));
	}, [deleteMessage]);

	return (
		<Box
			display="flex" p={1} m={2}
			className={`${disabled ? 'in-depth' : 'shadow'}`}
			borderRadius={'10px'}
		>
			<Box
				flexGrow={1}
				p={1}
			>
				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					название
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{title}
				</Typography>

				{
					isUsedInWorkflow && (<>
						<Box display="flex" alignItems="center">
							<Typography variant="body1" sx={{ p: '5px 0' }}>
								принимает участие в технологической цепочке
							</Typography>
							<CheckBoxOutlinedIcon
								sx={{ color: 'green', width: 'auto', height: '2em' }} />
						</Box>
						<Typography variant="caption" sx={{ color: '#989a9b' }}>
							номер в технологической цепочке
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
							{numberInWorkflow}
						</Typography>


					</>)
				}


			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
				// p={1}
			>
				<DeleteButtonComponent id={_id} dis={disabled} onClickHere={deleteDepartment} />
				<EditButtonComponent id={_id} dis={disabled} onClickHere={changeEditedDepartment} />
			</Box>
		</Box>
	);
};

export default OneDepartmentDepartmentsComponent;