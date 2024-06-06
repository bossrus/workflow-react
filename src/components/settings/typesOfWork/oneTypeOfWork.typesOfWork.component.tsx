import { Box, Typography } from '@mui/material';
import { ITypeOfWork } from '@/interfaces/worktype.interface.ts';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';
import { useEffect } from 'react';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';

interface IOneTypeOfWorkProps {
	typeOfWork: ITypeOfWork;
}

function OneTypeOfWorkTypesOfWorkComponent({
											   typeOfWork: { _id, title },
										   }: IOneTypeOfWorkProps) {

	const { currentTypeOfWork, deleteMessage } = useReduxSelectors().states;
	const disabled = currentTypeOfWork === _id;

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedTypeOfWork = (id: string | undefined) => {
		dispatch(setState({
			currentTypeOfWork: id,
		}));
	};

	const marker = 'тип заказа';

	const deleteTypeOfWork = useDeleteRecord(_id, marker, title);

	useEffect(() => {
		if (isNotValidDeleteMessage(deleteMessage, marker, _id)) return;
		if (deleteMessage!.result) {
			dispatch(deleteOne({ url: 'typesOfWork', id: _id }));
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

			</Box>
			<Box display="flex" flexDirection="column" justifyContent="space-between"
			>
				<RoundButtonComponent mode={'delete'} id={_id} dis={disabled} onClickHere={deleteTypeOfWork} />
				<RoundButtonComponent mode={'edit'} id={_id} dis={disabled} onClickHere={changeEditedTypeOfWork} />
			</Box>
		</Box>
	);
}

export default OneTypeOfWorkTypesOfWorkComponent;