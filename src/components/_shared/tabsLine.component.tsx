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

	const goToNewTab = (_event: SyntheticEvent, newValue: number) => {
		navigate(`/${section}/${tabs[newValue].url}`);
	};

	useEffect(() => {
		const newHotKeys: IHotkey[] = [];
		const newTabs: ITabs[] = [];
		for (const tab of tabs) {
			if (showTab(tab.access)) {
				newTabs.push(tab);
				newHotKeys.push({ letter: [(newHotKeys.length + 1).toString()], path: `/${section}/${tab.url}` });
			}
		}
		setHotkeys(newHotKeys);
		setResultTabs(newTabs);
	}, [tabs, me]);

	useHotkeysNavigation(hotkeys);

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
			sx={{ minHeight: '33px !important', pt: 2 }}
		>
			{resultTabs.map(({ label, badge, count }, index) => (
				<Tab
					key={index}
					className="down-shadow my-tabs"
					sx={{ borderRadius: 3 }}
					label={
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<span>
								<span className={activeTab !== index ? 'text-black' : ''}>{label}</span>
								{' '}
								<small className={'text-gray'}>(ALT&nbsp;+&nbsp;{index + 1})</small>
							</span>
							{count ? (
								<Box
									sx={{
										bgcolor: badge ? assignColor(badge) : 'white',
										borderRadius: '50%',
										display: 'inline-flex',
										alignItems: 'center',
										ml: 1,
										p: '3px',
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