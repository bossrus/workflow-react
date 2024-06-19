import { Typography } from '@mui/material';

interface IProps {
	title: string;
	stronger: string;
}

const FormEditHeaderComponent = ({ title, stronger }: IProps) => (
	<Typography
		variant="h5"
		component="h2"
		color={'yellow'}
		className={'margin-bottom-1su background-color-edit-color border-radius-10px text-align-center opacity-50'}
	>
		{title} «<strong>{stronger}</strong>»
	</Typography>
);

export default FormEditHeaderComponent;