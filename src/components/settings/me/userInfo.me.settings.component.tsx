import { Box } from '@mui/material';
import RowUserInfoMeSettingsComponent
	from '@/components/settings/me/row.userInfo.me.settings.component.tsx';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';


const UserInfoComponent = () => {

	const { me, departmentsObject } = useReduxSelectors();

	const title = 'отдел' + (me.departments?.length as number > 1 ? 'ы' : '');

	return (
		<Box
			className={'shadow border-radius-10px padding-2su background-color-white'}
		>
			<RowUserInfoMeSettingsComponent title={'имя'}>
				{me.name}
			</RowUserInfoMeSettingsComponent>
			<RowUserInfoMeSettingsComponent title={'логин'}>
				{me.login}
			</RowUserInfoMeSettingsComponent>
			{me.departments && (
				<RowUserInfoMeSettingsComponent title={title}>
					{me.departments.map((department) => (
						<p style={{ margin: 0 }} key={department}>
							{getTitleByID(departmentsObject, department)}
						</p>
					))}
				</RowUserInfoMeSettingsComponent>
			)}
		</Box>
	);
};

export default UserInfoComponent;