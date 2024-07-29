import { Box, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignColor } from '@/_constants/urgencyColors.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { IUserKeys } from '@/interfaces/user.interface.ts';
import { IHotkey, ITabs } from '@/interfaces/appSupport.interface.ts';
import useHotkeysNavigation from '@/_hooks/useHotkeysNavigation.tsx';

interface IProps {
	tabs: ITabs[],
	section: string,
	chapter: string,
}

function TabsLineComponent({ section, chapter, tabs }: IProps) {
	const { me } = useReduxSelectors();
	const index = tabs.findIndex(tab => tab.url === chapter);
	const activeTab = index >= 0 ? index : 0;
	const navigate = useNavigate();

	const [hotkeys, setHotkeys] = useState<IHotkey[]>([]);
	const [resultTabs, setResultTabs] = useState<ITabs[]>([]);

	const [notNeedHotkeys, setNotNeedHotkeys] = useState(false);

	const goToNewTab = (_event: SyntheticEvent, newValue: number) => {
		navigate(`/${section}/${tabs[newValue].url}`);
	};

	useEffect(() => {
		const newHotKeys: IHotkey[] = [];
		const newTabs: ITabs[] = [];
		for (const tab of tabs) {
			if (showTab(tab.access)) {
				newTabs.push(tab);
				newHotKeys.push({
					letter: [(newHotKeys.length + 1).toString(), '¡™£¢∞§¶•ªº'[newHotKeys.length]],
					path: `/${section}/${tab.url}`,
				});
			}
		}
		const splitResult = newHotKeys[0].path.split('/main/my/');
		setNotNeedHotkeys(splitResult.length > 1);
		setHotkeys(newHotKeys);
		setResultTabs(newTabs);
	}, [tabs, me]);

	useHotkeysNavigation(hotkeys, notNeedHotkeys);

	const showTab = (access?: IUserKeys[]) => {
		if (!access) {
			return true;
		}
		for (const role of access) {
			if (me[role]) {
				return true;
			}
		}
		return false;
	};
	return (
		<Tabs
			value={activeTab}
			onChange={goToNewTab}
			variant="scrollable"
			scrollButtons="auto"
			allowScrollButtonsMobile
			aria-label="scrollable auto tabs example"
			className={'min-height-33px padding-top-2su'}
		>
			{resultTabs.map(({ label, badge, count }, index) => (
				<Tab
					key={index}
					className="down-shadow my-tabs border-radius-3su"
					label={
						<Box
							className={'display-flex align-items-center'}
						>
							<span>
								<span className={activeTab !== index ? 'color-black' : ''}>{label}</span>
								{!notNeedHotkeys &&
									<>
										{' '}
										<small
											className={'color-my-gray'}
										>
											(ALT&nbsp;+&nbsp;{notNeedHotkeys && <>SHIFT&nbsp;+&nbsp;</>}{index + 1})
										</small>
									</>}
							</span>
							{count ? (
								<Box
									className={'border-radius-50 display-inline-flex align-items-center margin-left-1su padding-3px'}
									sx={{
										bgcolor: badge ? assignColor(badge) : 'white',
									}}
								>
									&nbsp;&nbsp;{count}&nbsp;&nbsp;
								</Box>
							) : null}
						</Box>
					}
				/>
			))}
		</Tabs>
	);
}

export default TabsLineComponent;