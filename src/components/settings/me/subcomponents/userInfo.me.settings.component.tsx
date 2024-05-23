import { Box } from '@mui/material';
import RowUserInfoMeSettingsComponent
	from '@/components/settings/me/subcomponents/row.userInfo.me.settings.component.tsx';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';


const UserInfoComponent = () => {

	const { me, departmentsObject } = useReduxSelectors();
	
	const title = 'отдел' + (me.departments?.length as number > 1 ? 'ы' : '');

	return (
		<Box className={'shadow'} borderRadius={'10px'} p={2} bgcolor={'white'}>
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
							{departmentsObject[department].title}
						</p>
					))}
				</RowUserInfoMeSettingsComponent>
			)}
		</Box>
	);
};

export default UserInfoComponent;