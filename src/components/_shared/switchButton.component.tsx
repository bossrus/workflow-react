import { FormControlLabel, FormGroup, Typography } from '@mui/material';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ReactElement } from 'react';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface IProps {
	checkState: boolean;
	changeChecked: (result: boolean) => void;
	trueBackgroundColor: string;
	falseBackgroundColor: string;
	trueTitle: string;
	falseTitle: string;
	mode: 'usual' | 'sound';
}

const stylesIcon = {
	width: 20,
};

const stylesSwitch = {
	width: 32,
	height: 32,
	boxSizing: 'border-box',
};

interface IIconConfig {
	checked: ReactElement;
	unchecked: ReactElement;
}

const icons: Record<IProps['mode'], IIconConfig> = {
	usual: {
		checked: <CancelOutlinedIcon sx={{ color: 'black', ...stylesIcon }} />,
		unchecked: <CheckCircleOutlineIcon sx={{ color: 'white', ...stylesIcon }} />,
	},
	sound:
		{
			unchecked: <VolumeOffIcon sx={{ color: 'black', ...stylesIcon }} />,
			checked: <VolumeUpIcon sx={{ color: 'white', ...stylesIcon }} />,
		},
};
const SwitchButtonComponent = ({
								   checkState,
								   changeChecked,
								   falseBackgroundColor,
								   falseTitle,
								   trueBackgroundColor,
								   trueTitle,
								   mode,
							   }: IProps) => {
	return (
		<FormGroup
		>
			<FormControlLabel
				control={
					<MaterialUISwitch
						sx={{ m: 1 }}
						icon={
							<SwitchStyledIcon sx={{
								backgroundColor: falseBackgroundColor,
								...stylesSwitch,

							}}>
								{icons[mode].unchecked}
							</SwitchStyledIcon>
						}
						checkedIcon={
							<SwitchStyledIcon sx={{
								backgroundColor: trueBackgroundColor,
								...stylesSwitch,
							}}>
								{icons[mode].checked}
							</SwitchStyledIcon>
						}
					/>
				}
				label={
					<Typography
						sx={{ fontWeight: 'bold', color: checkState ? trueBackgroundColor : falseBackgroundColor }}>
						{checkState
							? trueTitle
							: falseTitle
						}
					</Typography>
				}
				checked={checkState}
				onChange={(_event, checked) => changeChecked(checked)}
			/>
		</FormGroup>
	);
};

export default SwitchButtonComponent;