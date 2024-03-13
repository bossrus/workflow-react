import LoginComponent from '@/components/login/login.component.tsx';
import settingsComponent from '@/components/settings/settings.component.tsx';
import MainComponent from '@/components/main/main.component.tsx';

const routes = [
	{
		path: '/settings/:path?',
		Component: settingsComponent,
	},
	{
		path: '/login',
		Component: LoginComponent,
	},
	{
		path: '/main/:path?',
		Component: MainComponent,
	},
	{
		path: '/',
		Component: MainComponent,
	},

];

export default routes;
