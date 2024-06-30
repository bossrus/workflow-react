import { Box } from '@mui/material';
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
import TitleWithCaptionSettingsComponent from '@/components/settings/_shared/titleWithCaption.settings.component.tsx';

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
			className={`border-radius-10px display-flex padding-1su margin-2su ${disabled ? 'in-depth' : 'shadow'}`}
		>
			<Box
				className={'flex-grow-1 padding-1su'}
			>
				<TitleWithCaptionSettingsComponent caption={'название'} title={title} />
			</Box>
			<Box
				className={'display-flex flex-direction-column justify-content-space-between'}
			>
				<RoundButtonComponent mode={'delete'} id={_id} dis={disabled} onClickHere={deleteTypeOfWork} />
				<RoundButtonComponent mode={'edit'} id={_id} dis={disabled} onClickHere={changeEditedTypeOfWork} />
			</Box>
		</Box>
	);
}

export default OneTypeOfWorkTypesOfWorkComponent;