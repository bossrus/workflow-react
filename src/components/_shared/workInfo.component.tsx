import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import EditButtonComponent from '@/components/_shared/editButton.component.tsx';
import { ReactNode, useState } from 'react';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useNavigate } from 'react-router-dom';

interface IProps {
	idProps: string,
	colorProps: string,
	checkedProps?: boolean;
	changeChecked?: (id: string) => void,
	creator?: string,
	workflowTitle: string,
	workflowFirmTitle: string,
	workflowModificationTitle: string,
	workflowTypeTitle: string,
	workflowDepartmentTitle?: string,
	workflowCountPictures: number,
	workflowCountPages: number,
	workflowDescription: string,
	workflowAdditionalInformationToDepartment?: string,
	workflowShowDepartment?: boolean,
	children?: ReactNode;
}

function WorkInfoComponent({
							   idProps,
							   colorProps,
							   checkedProps,
							   changeChecked,
							   creator,
							   workflowTitle,
							   workflowFirmTitle,
							   workflowModificationTitle,
							   workflowTypeTitle,
							   workflowDepartmentTitle,
							   workflowCountPictures,
							   workflowCountPages,
							   workflowDescription,
							   workflowAdditionalInformationToDepartment,
							   workflowShowDepartment = true,
							   children,
						   }: IProps) {
	const [showDescription, setShowDescription] = useState(false);
	const { me } = useReduxSelectors();


	// console.log('idProps', idProps);
	// console.log('colorProps', colorProps);
	// console.log('checkedProps', checkedProps);
	// console.log('changeChecked', changeChecked);
	// console.log('creator', creator);
	// console.log('workflowTitle', workflowTitle);
	// console.log('workflowFirmTitle', workflowFirmTitle);
	// console.log('workflowModificationTitle', workflowModificationTitle);
	// console.log('workflowTypeTitle', workflowTypeTitle);
	// console.log('workflowDepartmentTitle', workflowDepartmentTitle);
	// console.log('workflowCountPictures', workflowCountPictures);
	// console.log('workflowCountPages', workflowCountPages);
	// console.log('workflowDescription', workflowDescription);


	const navigate = useNavigate();
	const editWorkflow = (id: string) => {
		navigate(`/main/create/${id}`);
	};

	const setShowDescr = (show: boolean) => {
		console.log('типа вошли в проверку отображения');
		setShowDescription(show);
	};

	return (
		<>
			<Box display="flex"
				 flexDirection="column"
				 borderRadius={2}
				 border={1}
				 borderColor={'#cbcbcb'}
				 bgcolor={'#fefefe'}
				 onMouseOver={() => setShowDescr(true)}
				 onMouseOut={() => setShowDescr(false)}
				 textAlign={'center'}
			>
				<Box display="flex"
					 flexDirection="row"
					 width={'100%'}
					 boxShadow={2}
					 p={1}
					 bgcolor={colorProps}
					 borderRadius={2}
					 boxSizing={'border-box'}
					 gap={2}
					 alignItems={'center'}
					 flexWrap={'wrap'}
				>
					<Box>
						{
							changeChecked !== undefined &&
							checkedProps !== undefined &&
							<Checkbox checked={checkedProps}
									  onChange={() => changeChecked(idProps)} />
						}
						{creator}
					</Box>
					<Box flexGrow={1}>
						<strong>{workflowTitle}</strong>
					</Box>
					<Box flexGrow={1}>
						<Box>
							{workflowFirmTitle}
						</Box>
						<Box>
							№ {workflowModificationTitle}
						</Box>
					</Box>
					<Box flexGrow={1}>
						<Box>
							<i>{workflowTypeTitle}</i>
						</Box>
						<Box>
							{workflowCountPictures} tif, {workflowCountPages} стр.
						</Box>
					</Box>
					{
						workflowShowDepartment &&
						<Box flexGrow={1}>
							{
								workflowAdditionalInformationToDepartment &&
								<Box>
									{workflowAdditionalInformationToDepartment}
								</Box>
							}
							<Box>
								<i>отдел «{workflowDepartmentTitle}»</i>
							</Box>
						</Box>}
					{
						me.canStartStopWorks &&
						<Box alignItems={'end'}>
							<EditButtonComponent id={idProps}
												 dis={false}
												 onClickHere={editWorkflow} />
						</Box>
					}
					<Box>
						{children}
					</Box>
				</Box>
				{showDescription &&
					<Box p={1} textAlign={'left'}>
						<small>
							<pre className={'warp-text'}>
								<small>
									{workflowDescription}
								</small>
							</pre>
						</small>
					</Box>
				}
			</Box>
		</>
	);
}

export default WorkInfoComponent;