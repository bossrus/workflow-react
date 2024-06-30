import { Box } from '@mui/material';
import { IModification } from '@/interfaces/modification.interface.ts';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useEffect } from 'react';
import { isNotValidDeleteMessage } from '@/_services/isValidDeleteMessage.ts';
import useDeleteRecord from '@/_hooks/useDeleteRecord.hook.ts';
import TitleWithCaptionSettingsComponent from '@/components/settings/_shared/titleWithCaption.settings.component.tsx';

interface IOneModificationProps {
	modification: IModification;
}

function OneModificationModificationsComponent({
												   modification: { _id, title },
											   }: IOneModificationProps) {
	const { currentModification, deleteMessage } = useReduxSelectors().states;

	const disabled = currentModification === _id;

	const dispatch = useDispatch<TAppDispatch>();


	const changeEditedModification = (id: string | undefined) => {
		dispatch(setState({
			currentModification: id,
		}));
	};

	const marker = 'номер издания';

	const deleteModification = useDeleteRecord(_id, marker, title);

	useEffect(() => {
		if (isNotValidDeleteMessage(deleteMessage, marker, _id)) return;
		if (deleteMessage!.result) {
			dispatch(deleteOne({ url: 'modifications', id: _id }));
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
				<TitleWithCaptionSettingsComponent caption={'название'} title={title} />
			</Box>
			<Box
				className={'display-flex flex-direction-column justify-content-space-between'}
			>
				<RoundButtonComponent mode={'delete'} id={_id} dis={disabled} onClickHere={deleteModification} />
				<RoundButtonComponent mode={'edit'} id={_id} dis={disabled} onClickHere={changeEditedModification} />
			</Box>
		</Box>
	);
}

export default OneModificationModificationsComponent;