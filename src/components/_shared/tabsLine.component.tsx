import { Tab, Tabs } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
	tabs: { label: string, url: string }[],
	section: string,
	chapter: string,
}

function TabsLineComponent({ section, chapter, tabs }: IProps) {
	const activeTab = tabs.findIndex(tab => tab.url === chapter);
	const navigate = useNavigate();

	const logNewTab = (_event: SyntheticEvent, newValue: number) => {
		navigate(`/${section}/${tabs[newValue]['url']}`);
	};
	return (
		<Tabs
			value={activeTab}
			onChange={logNewTab}
			variant="scrollable"
			scrollButtons="auto"
			allowScrollButtonsMobile
			aria-label="scrollable auto tabs example"
			sx={{ minHeight: '33px! important', pt: 2 }}
		>
			{
				tabs.map((tab) => (
					<Tab
						className={'down-shadow my-tabs'}
						sx={{ borderRadius: 3 }}
						key={tab.url}
						label={tab.label}
					/>
				))
			}
		</Tabs>
	);
}

export default TabsLineComponent;