import { Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';

interface IProps {
	work_id: string;
}

function WorkMyMainComponent({ work_id }: IProps) {

	const { me, workflowsPublishedObject } = useReduxSelectors();

	const navigate = useNavigate();
	const dispatch = useDispatch<TAppDispatch>();

	useEffect(() => {

	}, [workflowsPublishedObject]);

	return (
		<>
			{workflowsPublishedObject[work_id] &&
				<Box display="flex" flexDirection="row" height="100%" boxShadow={3} borderRadius={2}
					 bgcolor={'white'} p={2} boxSizing={'border-box'}>
					<Box flexGrow={1}>
						<textarea
							style={{
								boxSizing: 'border-box',
								height: '100%',
								width: '100%',
								resize: 'none',
								border: 'none',
								paddingRight: '20px',
								overflow: 'auto',
							}}
							value={workflowsPublishedObject[work_id].description}
						>
						</textarea>

					</Box>
					<Box bgcolor={'lightblue'}>
						<h1>
							{workflowsPublishedObject[work_id].title}
						</h1>

					</Box>
				</Box>
			}
		</>
	);
}

export default WorkMyMainComponent;