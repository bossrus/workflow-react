import LoginComponent from '@/components/login/login.component.tsx';
import mainDepartmentsComponents from '@/components/settings/departments/_mainDepartmentsComponent.tsx';

const routes = [
	{
		path: '/settings/departments',
		Component: mainDepartmentsComponents,
	},
	{
		path: '/settings',
		Component: mainDepartmentsComponents, //TODO сделать по умолчанию "о бо мне"
	},
	{
		path: '/login',
		Component: LoginComponent,
	},

];

export default routes;
