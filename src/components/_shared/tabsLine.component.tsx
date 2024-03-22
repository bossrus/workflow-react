import { Box, Tab, Tabs } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignColor } from '@/_constants/urgencyColors.ts';

interface IProps {
	tabs: { label: string, url: string, badge?: number, count?: number }[],
	section: string,
	chapter: string,

}

function TabsLineComponent({ section, chapter, tabs }: IProps) {
	const index = tabs.findIndex(tab => tab.url === chapter);
	const activeTab = index >= 0 ? index : 0;
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
				tabs.map((tab, index) => (
					<Tab
						key={index}
						className={'down-shadow my-tabs'}
						sx={{
							borderRadius: 3,
						}}
						label={
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<span>{tab.label}</span>
								{tab.count ? (
									<Box
										sx={{
											bgcolor: (tab.badge ? assignColor(tab.badge) : 'white'),
											borderRadius: '50%',
											display: 'inline-flex',
											alignItems: 'center',
											ml: 1,
											p: '3px',
										}}
									>
										&nbsp;&nbsp;{tab.count}&nbsp;&nbsp;
									</Box>
								) : null}
							</Box>
						}
					/>
				))
			}
		</Tabs>
	);
}

export default TabsLineComponent;