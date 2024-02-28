import LoginComponent from '@/components/login/login.component.tsx';
import mainDepartmentsComponents from '@/components/settings/departments/_mainDepartments.component.tsx';
import mainTypesOfWorkComponents from '@/components/settings/typesOfWork/_mainTypesOfWork.component.tsx';

const routes = [
	{
		path: '/settings/departments',
		Component: mainDepartmentsComponents,
	},
	{
		path: '/settings/types-of-work',
		Component: mainTypesOfWorkComponents,
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
