import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import UserInfoComponent from './userInfo.me.settings.component.tsx';
import EmailSettingsComponent from '@/components/settings/me/email.me.settings.component.tsx';
import PasswordSettingsComponent from '@/components/settings/me/password.me.settings.component.tsx';
import { FC, useEffect } from 'react';

const MeSettingsComponent: FC = () => {

	const { me, departmentsObject } = useReduxSelectors();
	useEffect(() => {
		document.title = 'Мои настройки';
	}, []);

	return (
		<>
			{Object.keys(me).length > 0 && Object.keys(departmentsObject).length > 0 && (
				<Box
					className={'display-flex flex-direction-column height-100 box-sizing-border-box'}
				>
					<table className={'table-container'}>
						<tbody>
						<tr>
							<td>

								<Box
									className={'margin-bottom-2su display-flex justify-content-center padding-5su border-radius-2su overflow-auto height-100 box-sizing-border-box'}
								>
									<Box
										className={'width-70'}
									>
										<UserInfoComponent />
										<Box
											className={'shadow background-color-white border-radius-2su padding-2su margin-top-2su'}
										>
											<EmailSettingsComponent />
										</Box>
										<Box
											className={'padding-2su margin-top-2su shadow background-color-white border-radius-2su'}
										>
											<PasswordSettingsComponent />
										</Box>
										<Box className={'height-32px'} />
									</Box>
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