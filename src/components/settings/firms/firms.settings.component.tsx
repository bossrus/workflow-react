import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneFirmFirmsComponent from '@/components/settings/firms/oneFirm.firms.settings.component.tsx';
import EditFirmFormComponent from '@/components/settings/firms/editFirmForm.firms.settings.component.tsx';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function FirmsComponents() {
	const { firmsArray: firms, me } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}
		document.title = 'Клиенты';
	}, [me]);

	const sortedFirms = useMemo(() => {
		return [...firms].sort((a, b) => +a.basicPriority - +b.basicPriority);
	}, [firms]);

	return (
		<Box
			className={'display-flex flex-direction-column height-100'}
		>
			<table className={'table-container'}>
				<tbody>
				<tr>
					<td className={'vertical-align-top'}>
						<Box
							className={'padding-2su height-100 align-content-flex-start display-flex flex-wrap flex-grow-1 overflow-auto'}
						>
							{sortedFirms.map((firm) => (
								<Box
									key={firm._id}
									className={'flex-basis-0 flex-grow-1 min-width-250px'}
								>
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