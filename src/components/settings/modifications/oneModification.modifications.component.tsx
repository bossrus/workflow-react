import { Box, Typography } from '@mui/material';
import { IModification } from '@/interfaces/modification.interface.ts';
import DeleteButtonComponent from '@/components/_shared/deleteButton.component.tsx';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { deleteOne } from '@/store/_shared.thunks.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { setState } from '@/store/_currentStates.slice.ts';

interface IOneModificationProps {
	modification: IModification;
}

function OneModificationModificationsComponent({
												   modification: { _id, title },
											   }: IOneModificationProps) {
	const { states: { currentModification } } = useReduxSelectors();

	const disabled = currentModification === _id;

	const dispatch = useDispatch<TAppDispatch>();


	const changeEditedModification = (id: string | undefined) => {
		dispatch(setState({
			currentModification: id,
		}));
	};

	const deleteModification = (id: string) => {
		dispatch(deleteOne({ url: 'modifications', id }));
	};

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

export default OneModificationModificationsComponent;