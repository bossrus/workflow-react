import { Box, Typography } from '@mui/material';
import { IModification } from '@/interfaces/modification.interface.ts';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';

interface IOneModificationProps {
	changeEditedModification: (id: string) => void;
	deleteModification: (id: string) => void;
	modification: IModification;
	currentModification: string | undefined;
}

function OneModificationComponent({
									  currentModification,
									  changeEditedModification,
									  deleteModification,
									  modification: { _id, title },
								  }: IOneModificationProps) {
	const disabled = currentModification === _id;
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

			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
			>
				<DeleteButtonComponent id={_id} dis={disabled} onClickHere={deleteModification} />
				<EditButtonComponent id={_id} dis={disabled} onClickHere={changeEditedModification} />
			</Box>
		</Box>
	);
}

export default OneModificationComponent;