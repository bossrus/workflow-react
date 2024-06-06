import { FormGroup } from '@mui/material';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';

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

			{/*//а нужна ли поддержка? :)*/}

			{/*<RoundButtonComponent*/}
			{/*	id={''}*/}
			{/*	dis={false}*/}
			{/*	onClickHere={logout}*/}
			{/*	mode={'support'}*/}
			{/*/>*/}
			<RoundButtonComponent
				id={''}
				dis={false}
				onClickHere={logout}
				mode={'exit'}
			/>
		</>
	);
}

export default rightButtonsGroupComponent;
