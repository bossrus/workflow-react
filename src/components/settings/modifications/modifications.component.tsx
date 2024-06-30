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
									modifications.map((modification) =>
										<Box
											key={modification._id}
											className={'flex-basis-0 flex-grow-1 min-width-250px'}
										>
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