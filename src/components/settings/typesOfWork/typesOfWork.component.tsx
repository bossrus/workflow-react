import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneTypeOfWorkTypesOfWorkComponent
	from '@/components/settings/typesOfWork/oneTypeOfWork.typesOfWork.component.tsx';
import EditTypeOfWorkFormTypesOfWorkComponent
	from '@/components/settings/typesOfWork/editTypeOfWorkForm.typesOfWork.component.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setState } from '@/store/_currentStates.slice.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';

function MainTypesOfWorkComponents() {
	const { typesOfWorkArray: typesOfWork, me } = useReduxSelectors();

	const navigate = useNavigate();
	const dispatch = useDispatch<TAppDispatch>();
	
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}
		document.title = 'Типы работ';
		return () => {
			dispatch(setState({ currentTypeOfWork: undefined }));
		};
	}, [me]);

	return (
		<>
			<Box
				className={'display-flex flex-direction-column height-100'}
			>
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'vertical-align-top'}>
							<Box
								className={'display-flex flex-wrap flex-grow-1 overflow-auto padding-2su height-100 align-content-flex-start'}
							>
								{
									typesOfWork.map((typeOfWork) =>
										<Box
											key={typeOfWork._id}
											className={'flex-basis-0 flex-grow-1 min-width-250px'}
										>
											<OneTypeOfWorkTypesOfWorkComponent
												typeOfWork={typeOfWork}
											/>
										</Box>,
									)
								}
							</Box>
						</td>
					</tr>
					</tbody>
				</table>
				<EditTypeOfWorkFormTypesOfWorkComponent />
			</Box>
		</>
	);
}

export default MainTypesOfWorkComponents;