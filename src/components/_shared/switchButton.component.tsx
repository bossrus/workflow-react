import { FormControlLabel, FormGroup, Typography } from '@mui/material';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FC, ReactElement } from 'react';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface SubscriptionSettingsComponentProps {
	checkState: boolean;
	changeChecked: (result: boolean) => void;
	trueBackgroundColor: string;
	falseBackgroundColor: string;
	trueTitle: string;
	falseTitle: string;
	mode: 'usual' | 'sound';
}

const SwitchButtonComponent: FC<SubscriptionSettingsComponentProps> = ({
																		   checkState,
																		   changeChecked,
																		   falseBackgroundColor,
																		   falseTitle,
																		   trueBackgroundColor,
																		   trueTitle,
																		   mode,
																	   }) => {
	const stylesIcon = {
		width: 20,
	};
	const stylesSwitch = {
		width: 32,
		height: 32,
		boxSizing: 'border-box',
	};

	const icons: Record<string, ReactElement> = {
		'usual': <MaterialUISwitch
			sx={{ m: 1 }}
			icon={
				<SwitchStyledIcon sx={{
					backgroundColor: falseBackgroundColor,
					...stylesSwitch,

				}}>
					<CancelOutlinedIcon sx={{ color: 'black', ...stylesIcon }} />
				</SwitchStyledIcon>
			}
			checkedIcon={
				<SwitchStyledIcon sx={{
					backgroundColor: trueBackgroundColor,
					...stylesSwitch,
				}}>
					<CheckCircleOutlineIcon sx={{ color: 'white', ...stylesIcon }} />
				</SwitchStyledIcon>
			}
		/>,
		'sound': <MaterialUISwitch
			sx={{ m: 1 }}
			icon={
				<SwitchStyledIcon
					sx={{
						backgroundColor: falseBackgroundColor,
						...stylesSwitch,
					}}
				>
					<VolumeOffIcon
						sx={{ color: 'black', ...stylesIcon }}
					/>
				</SwitchStyledIcon>
			}
			checkedIcon={
				<SwitchStyledIcon
					sx={{
						backgroundColor: trueBackgroundColor,
						...stylesSwitch,
					}}
				>
					<VolumeUpIcon
						sx={{ color: 'white', ...stylesIcon }}
					/>
				</SwitchStyledIcon>
			}
		/>,
	};
	return (
		<FormGroup
		>
			<FormControlLabel
				control={
					icons[mode]
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