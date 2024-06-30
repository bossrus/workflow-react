interface IProps {
	title: string;
	hotkey: string;
}

const TitleWithHotkeyComponent = ({ title, hotkey }: IProps) => (
	<span>{title} <small
		className={'color-my-light-gray'}>({hotkey})</small></span>
);

export default TitleWithHotkeyComponent;