import { FormControlLabel, FormGroup, Typography } from '@mui/material';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ReactElement } from 'react';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import '@/scss/main.scss';

interface IProps {
	checkState: boolean;
	changeChecked: (result: boolean) => void;
	trueBackgroundColor: string;
	falseBackgroundColor: string;
	trueTitle: string;
	falseTitle: string;
	mode: 'usual' | 'sound';
}

const stylesIcon = 'width-20px';

const stylesSwitch = 'width-32px height-32px box-sizing-border-box';

interface IIconConfig {
	checked: ReactElement;
	unchecked: ReactElement;
}

const icons: Record<IProps['mode'], IIconConfig> = {
	usual: {
		checked: <CancelOutlinedIcon className={`color-black ${stylesIcon}`} />,
		unchecked: <CheckCircleOutlineIcon className={`color-white ${stylesIcon}`} />,
	},
	sound:
		{
			unchecked: <VolumeOffIcon className={`color-black ${stylesIcon}`} />,
			checked: <VolumeUpIcon className={`color-white ${stylesIcon}`} />,
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
						className={'margin-1su'}
						icon={
							<SwitchStyledIcon
								className={stylesSwitch}
								sx={{ backgroundColor: falseBackgroundColor }}>
								{icons[mode].unchecked}
							</SwitchStyledIcon>
						}
						checkedIcon={
							<SwitchStyledIcon
								className={stylesSwitch}
								sx={{ backgroundColor: trueBackgroundColor }}>
								{icons[mode].checked}
							</SwitchStyledIcon>
						}
					/>
				}
				label={
					<Typography
						className={'text-warp font-weight-bold'}
						sx={{ color: checkState ? trueBackgroundColor : falseBackgroundColor }}>
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