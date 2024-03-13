import { Box, Typography } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { IDepartment } from '@/interfaces/department.interface.ts';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';

interface IOneDepartmentProps {
	changeEditedDepartment: (id: string) => void;
	deleteDepartment: (id: string) => void;
	department: IDepartment;
	currentDepartment: string | undefined;
}

// {title, 	numberInWorkflow,	isUsedInWorkflow}
function OneDepartmentComponent({
									currentDepartment,
									changeEditedDepartment,
									deleteDepartment,
									department: { _id, title, numberInWorkflow, isUsedInWorkflow },
								}: IOneDepartmentProps) {
	const disabled = currentDepartment === _id;
	return (
		<Box
			display="flex" p={1} m={2}
			// maxWidth={'300px'}
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
}

export default OneDepartmentComponent;