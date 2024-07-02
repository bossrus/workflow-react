import { Box, Typography } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { IDepartment } from '@/interfaces/department.interface.ts';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useEffect } from 'react';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';
import LabelWithCaptionSettingsComponent from '@/components/settings/_shared/titleWithCaption.settings.component.tsx';

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
			className={`display-flex padding-1su margin-2su border-radius-10px ${disabled ? 'in-depth' : 'shadow'}`}
		>
			<Box
				className={'flex-grow-1 padding-1su'}
			>
				<LabelWithCaptionSettingsComponent
					caption={'название'}
					title={title}
				/>
				{
					isUsedInWorkflow && (<>
						<Box
							className={'display-flex align-items-center'}
						>
							<Typography
								variant="body1"
								className={'padding-5px-0'}
							>
								принимает участие в технологической цепочке
							</Typography>
							<CheckBoxOutlinedIcon
								className={'color-my-green width-auto height-32px'}
							/>
						</Box>
						<LabelWithCaptionSettingsComponent
							title={numberInWorkflow}
							caption={'номер в технологической цепочке'}
						/>
					</>)
				}
			</Box>
			<Box
				className={'display-flex flex-direction-column justify-content-space-between'}
			>
				<RoundButtonComponent mode={'delete'} id={_id} dis={disabled} onClickHere={deleteDepartment} />
				<RoundButtonComponent mode={'edit'} id={_id} dis={disabled} onClickHere={changeEditedDepartment} />
			</Box>
		</Box>
	);
};

export default OneDepartmentDepartmentsComponent;