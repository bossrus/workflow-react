import { FormControlLabel, FormGroup, Typography } from '@mui/material';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FALSE_COLOR } from '@/_constants/colors.ts';

interface IProps {
	switchLabel: string;
	valueChecked: boolean;
	changeChecked: (checked: boolean) => void;
}

function SwitchComponent({ switchLabel, valueChecked, changeChecked }: IProps) {

	return (
		<FormGroup>
			<FormControlLabel
				control={
					<MaterialUISwitch
						sx={{ m: 1 }}
						icon={
							<SwitchStyledIcon
								sx={{ backgroundColor: FALSE_COLOR }}
							>
								<CancelOutlinedIcon
									sx={{ color: 'black' }}
								/>
							</SwitchStyledIcon>
						}
						checkedIcon={
							<SwitchStyledIcon
								sx={{ backgroundColor: 'green' }}
							>
								<CheckCircleOutlineIcon
									sx={{ color: 'white' }}
								/>
							</SwitchStyledIcon>
						}
					/>
				}
				label={<Typography
					sx={{
						fontWeight: 'bold',
						color: valueChecked ? 'green' : FALSE_COLOR,
					}}
				>
					{switchLabel}
				</Typography>}
				checked={valueChecked}
				onChange={(_event, checked) => changeChecked(checked)}
			/>
		</FormGroup>
	)
		;
}

export default SwitchComponent;