import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import UserInfoComponent from './subcomponents/userInfo.me.settings.component';
import EmailSettingsComponent from '@/components/settings/me/subcomponents/email.me.settings.component.tsx';
import PasswordSettingsComponent from '@/components/settings/me/subcomponents/password.me.settings.component.tsx';
import { FC } from 'react';

const MeSettingsComponent: FC = () => {

	const { me, departmentsObject } = useReduxSelectors();

	return (
		<>
			{Object.keys(me).length > 0 && Object.keys(departmentsObject).length > 0 && (
				<Box display="flex" flexDirection="column" height="100%" boxSizing={'border-box'}>
					<table className={'table-container'}>
						<tbody>
						<tr>
							<td>

								<Box
									display={'-webkit-box'}
									justifyContent={'center'}
									p={5}
									borderRadius={2}
									overflow={'auto'}
									height={'100%'}
									boxSizing={'border-box'}
								>
									<Box style={{ width: '70%' }}>
										<UserInfoComponent />
										<Box className={'shadow'} bgcolor={'white'} borderRadius={2} p={2} mt={2}>
											<EmailSettingsComponent />
										</Box>
										<Box className={'shadow'} bgcolor={'white'} borderRadius={2} p={2} mt={2}>
											<PasswordSettingsComponent />
										</Box></Box>
								</Box>
							</td>
						</tr>
						</tbody>
					</table>
				</Box>
			)}
		</>
	);
};

export default MeSettingsComponent;