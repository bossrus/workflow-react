import { styled, Switch } from '@mui/material';

export const SwitchStyledIcon = styled('div')(() => ({
	padding: '7px',
	borderRadius: '50%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}));
export const MaterialUISwitch = styled(Switch)(() => ({
	width: 62,
	height: 34,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: 1,
		padding: 0,
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: '#aab4be',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		width: 32,
		height: 32,
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: '#aab4be',
		borderRadius: 20 / 2,
	},
}));