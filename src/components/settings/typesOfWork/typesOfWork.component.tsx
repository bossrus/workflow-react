import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneTypeOfWorkTypesOfWorkComponent
	from '@/components/settings/typesOfWork/oneTypeOfWork.typesOfWork.component.tsx';
import EditTypeOfWorkFormTypesOfWorkComponent
	from '@/components/settings/typesOfWork/editTypeOfWorkForm.typesOfWork.component.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function MainTypesOfWorkComponents() {
	const { typesOfWorkArray: typesOfWork, me } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}

	}, [me]);

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%">
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'vertical-align-top'}>
							<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
								 sx={{ height: '100%', alignContent: 'flex-start' }}>
								{
									typesOfWork.map((typeOfWork) =>
										<Box
											key={typeOfWork._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
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