import LoginComponent from '@/components/login/login.component.tsx';
import mainDepartmentsComponent from '@/components/settings/departments/_mainDepartments.component.tsx';
import mainTypesOfWorkComponent from '@/components/settings/typesOfWork/_mainTypesOfWork.component.tsx';
import mainModificationsComponent from '@/components/settings/modifications/_mainModifications.component.tsx';
import mainFirmsComponents from '@/components/settings/firms/_mainFirms.component.tsx';
import mainUsersComponents from '@/components/settings/users/_mainUsers.component.tsx';
import meSettingsComponent from '@/components/settings/me/meSettings.component.tsx';

const routes = [
	{
		path: '/settings/departments',
		Component: mainDepartmentsComponent,
	},
	{
		path: '/settings/types-of-work',
		Component: mainTypesOfWorkComponent,
	},
	{
		path: '/settings/modifications',
		Component: mainModificationsComponent,
	},
	{
		path: '/settings/firms',
		Component: mainFirmsComponents,
	},
	{
		path: '/settings/employees',
		Component: mainUsersComponents,
	},
	{
		path: '/settings/error',
		Component: meSettingsComponent,
	},
	{
		path: '/settings',
		Component: meSettingsComponent,
	},
	{
		path: '/login',
		Component: LoginComponent,
	},

];

export default routes;
