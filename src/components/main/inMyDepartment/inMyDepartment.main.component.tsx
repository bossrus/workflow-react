import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';

function InMyDepartmentMainComponent() {
	const { workflowsPublishedObject } = useReduxSelectors();
	return (
		<Box height={'100%'} py={2} boxSizing={'border-box'} width={'100%'} display="flex"
			 flexDirection="column">
			<Box
				display="flex"
				flexDirection="column"
				height="100%"
				boxShadow={3}
				borderRadius={2}
				bgcolor={'white'}
			>
				<Box flexGrow={1} overflow="auto" p={2}>
					{
						Object.keys(workflowsPublishedObject).length > 0 &&
						Object.keys(workflowsPublishedObject).map((key) => (
							<Box key={key}>
								workflow: {workflowsPublishedObject[key].title}
							</Box>
						))
					}
				</Box>
				<Box p={2}>Нижний блок</Box>
			</Box>
		</Box>
	);
}

export default InMyDepartmentMainComponent;