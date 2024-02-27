import { FormControlLabel, FormGroup, IconButton, Tooltip, Typography } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { tooltipProps } from '@/scss/tooltipsProps.ts';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled';

interface IRightButtonsGroupProps {
	isSoundOn: boolean,
	changeSounds: (isSoundProps: boolean) => void,
	logout: () => void,

}

function rightButtonsGroupComponent(props: IRightButtonsGroupProps) {
	const { isSoundOn, changeSounds, logout } = props;

	const switchLabel = isSoundOn ? 'Звук включён' : 'Звук выключен';

	return (
		<>
			<FormGroup>
				<FormControlLabel
					control={
						<MaterialUISwitch
							sx={{ m: 1 }}
							icon={
								<SwitchStyledIcon
									sx={{ backgroundColor: 'red' }}
								>
									<VolumeOffIcon
										sx={{ color: 'black' }}
									/>
								</SwitchStyledIcon>
							}
							checkedIcon={
								<SwitchStyledIcon
									sx={{ backgroundColor: 'green' }}
								>
									<VolumeUpIcon
										sx={{ color: 'white' }}
									/>
								</SwitchStyledIcon>
							}
						/>
					}
					label={<Typography
						sx={{
							fontWeight: 'bold',
							color: isSoundOn ? 'green' : 'red',
						}}
					>
						{switchLabel}
					</Typography>}
					checked={isSoundOn}
					onChange={(_event, checked) => changeSounds(checked)}
				/>
			</FormGroup>
			<Tooltip
				title={'Техподдержка'}
				arrow
				componentsProps={tooltipProps}
			>
				<IconButton
					color="primary"
					className={'up-shadow'}
				>
					<RateReviewIcon />
				</IconButton>
			</Tooltip>
			<Tooltip
				title={'Выход'}
				arrow
				componentsProps={tooltipProps}
			>
				<IconButton
					color="secondary"
					className={'up-shadow'}
					onClick={logout}
				>
					<MeetingRoomIcon />
				</IconButton>
			</Tooltip>
		</>
	);
}

export default rightButtonsGroupComponent;
