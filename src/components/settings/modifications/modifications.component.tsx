import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneModificationModificationsComponent
	from '@/components/settings/modifications/oneModification.modifications.component.tsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditModificationFormModificationsComponent
	from '@/components/settings/modifications/editModificationForm.modifications.component.tsx';

function ModificationsComponents() {
	const { modificationsArray: modifications, me } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin && !me.canMakeModification) {
			navigate('/settings/me');
		}

	}, [me]);

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%">
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'align-top'}>
							<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
								 sx={{ height: '100%', alignContent: 'flex-start' }}>
								{
									modifications.map((modification) =>
										<Box
											key={modification._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
											<OneModificationModificationsComponent
												modification={modification}
											/>
										</Box>,
									)
								}
							</Box>
						</td>
					</tr>
					</tbody>
				</table>
				<EditModificationFormModificationsComponent />
			</Box>
		</>
	);
}

export default ModificationsComponents;