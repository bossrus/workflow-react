import { Box, Typography } from '@mui/material';
import { IFirm } from '@/interfaces/firm.interface.ts';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';

interface IOneFirmProps {
	changeEditedFirm: (id: string) => void;
	deleteFirm: (id: string) => void;
	firm: IFirm;
	currentFirm: string | undefined;
}

function OneFirmComponent({
							  currentFirm,
							  changeEditedFirm,
							  deleteFirm,
							  firm: { _id, title, basicPriority },
						  }: IOneFirmProps) {
	const disabled = currentFirm === _id;
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

				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					базовый приоритет
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{basicPriority}
				</Typography>


			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
				// p={1}
			>
				<DeleteButtonComponent id={_id} dis={disabled} onClickHere={deleteFirm} />
				<EditButtonComponent id={_id} dis={disabled} onClickHere={changeEditedFirm} />
			</Box>
		</Box>
	);
}

export default OneFirmComponent;