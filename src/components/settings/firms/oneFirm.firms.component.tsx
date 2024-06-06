import { Box, Typography } from '@mui/material';
import { IFirm } from '@/interfaces/firm.interface.ts';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect } from 'react';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';

interface IOneFirmProps {
	firm: IFirm;
}

function OneFirmFirmsComponent({
								   firm: { _id, title, basicPriority },
							   }: IOneFirmProps) {
	const { currentFirm, deleteMessage } = useReduxSelectors().states;

	const disabled = currentFirm === _id;
	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedFirm = (id: string | undefined) => {
		dispatch(setState({
			currentFirm: id,
		}));
	};

	const marker = 'отдел';

	const deleteFirm = useDeleteRecord(_id, marker, title);

	useEffect(() => {
		if (isNotValidDeleteMessage(deleteMessage, marker, _id)) return;
		if (deleteMessage!.result) {
			dispatch(deleteOne({ url: 'firms', id: _id }));
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

				<Typography variant="caption" sx={{ color: '#989a9b' }}>
					базовый приоритет
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{basicPriority}
				</Typography>


			</Box>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
			>
				<RoundButtonComponent mode={'delete'} id={_id} dis={disabled} onClickHere={deleteFirm} />
				<RoundButtonComponent mode={'edit'} id={_id} dis={disabled} onClickHere={changeEditedFirm} />
			</Box>
		</Box>
	);
}

export default OneFirmFirmsComponent;