import { FormGroup, IconButton, Tooltip } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { tooltipProps } from '@/scss/tooltipsProps.ts';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';

interface IRightButtonsGroupProps {
	isSoundOn: boolean,
	changeSounds: (isSoundProps: boolean) => void,
	logout: () => void,

}

function rightButtonsGroupComponent(props: IRightButtonsGroupProps) {
	const { isSoundOn, changeSounds, logout } = props;

	return (
		<>
			<FormGroup>
				<SwitchButtonComponent
					checkState={isSoundOn}
					changeChecked={changeSounds}
					trueBackgroundColor={'green'}
					falseBackgroundColor={'red'}
					trueTitle={'Звук включен'}
					falseTitle={'Звук выключен'}
					mode={'sound'}
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
