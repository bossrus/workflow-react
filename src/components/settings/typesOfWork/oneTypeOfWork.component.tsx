import { Box, Typography } from '@mui/material';
import { ITypeOfWork } from '@/interfaces/worktype.interface.ts';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';

interface IOneTypeOfWorkProps {
	changeEditedTypeOfWork: (id: string) => void;
	deleteTypeOfWork: (id: string) => void;
	typeOfWork: ITypeOfWork;
	currentTypeOfWork: string | undefined;
}

// {title, 	numberInWorkflow,	isUsedInWorkflow}
function OneTypeOfWorkComponent({
									currentTypeOfWork,
									changeEditedTypeOfWork,
									deleteTypeOfWork,
									typeOfWork: { _id, title },
								}: IOneTypeOfWorkProps) {
	const disabled = currentTypeOfWork === _id;
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

			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
				// p={1}
			>
				<DeleteButtonComponent id={_id} dis={disabled} onClickHere={deleteTypeOfWork} />
				<EditButtonComponent id={_id} dis={disabled} onClickHere={changeEditedTypeOfWork} />
			</Box>
		</Box>
	);
}

export default OneTypeOfWorkComponent;