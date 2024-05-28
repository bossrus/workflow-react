// src/_hooks/useDeleteRecord.hook.ts
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { setState } from '@/store/_currentStates.slice.ts';

const useDeleteRecord = (_id: string, marker: string, title: string) => {
	const dispatch = useDispatch<TAppDispatch>();

	const deleteRecord = () => {
		dispatch(setState({
			flashMessage: 'delete',
			deleteMessage: { id: _id, message: `${marker}<br/>«${title}»`, result: undefined },
		}));
	};

	return deleteRecord;
};

export default useDeleteRecord;