import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneFirmFirmsComponent from '@/components/settings/firms/oneFirm.firms.component.tsx';
import EditFirmFormComponent from '@/components/settings/firms/editFirmForm.firms.component.tsx';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function FirmsComponents() {
	const { firmsArray: firms, me } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}

	}, [me]);

	const sortedFirms = useMemo(() => {
		return [...firms].sort((a, b) => +a.basicPriority - +b.basicPriority);
	}, [firms]);

	return (
		<Box display="flex" flexDirection="column" height="100%">
			<table className={'table-container'}>
				<tbody>
				<tr>
					<td className={'vertical-align-top'}>
						<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
							 sx={{ height: '100%', alignContent: 'flex-start' }}>
							{sortedFirms.map((firm) => (
								<Box key={firm._id} flexBasis={0} flexGrow={1} minWidth={250}>
									<OneFirmFirmsComponent firm={firm} />
								</Box>
							))}
						</Box>
					</td>
				</tr>
				</tbody>
			</table>
			<EditFirmFormComponent />
		</Box>
	);
}

export default FirmsComponents;