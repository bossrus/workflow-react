import { Box } from '@mui/material';
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
import TitleWithCaptionSettingsComponent from '@/components/settings/_shared/titleWithCaption.settings.component.tsx';

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
			className={`border-radius-10px display-flex padding-1su margin-2su ${disabled ? 'in-depth' : 'shadow'}`}
		>
			<Box
				className={'flex-grow-1 padding-1su'}
			>
				<TitleWithCaptionSettingsComponent
					caption={'название'}
					title={title}
				/>
				<TitleWithCaptionSettingsComponent
					caption={'базовый приоритет'}
					title={basicPriority.toString()}
				/>
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