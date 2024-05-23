import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneDepartmentDepartmentsComponent
	from '@/components/settings/departments/oneDepartment.departments.component.tsx';
import { useEffect, useMemo, useState } from 'react';
import { IDepartment } from '@/interfaces/department.interface.ts';
import EditDepartmentFormComponent
	from '@/components/settings/departments/editDepartmentForm.departments.component.tsx';
import { useNavigate } from 'react-router-dom';


function DepartmentsComponents() {
	const { departmentsArray, me } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}

	}, [me]);


	const [sortedDepartments, setSortedDepartments] = useState<IDepartment[]>([]);

	const sortDepartments = useMemo(() => {
		return [...departmentsArray].sort((a, b) => {
			const numA = isNaN(Number(a.numberInWorkflow)) ? Infinity : +a.numberInWorkflow;
			const numB = isNaN(Number(b.numberInWorkflow)) ? Infinity : +b.numberInWorkflow;
			return numA - numB;
		});
	}, [departmentsArray]);

	useEffect(() => {
		setSortedDepartments(sortDepartments);
	}, [sortDepartments]);

	return (
		<>
			<Box display="flex" flexDirection="column" height="100%">
				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'align-top'}>
							<Box display="flex" flexWrap="wrap" flexGrow={1} overflow="auto" p={2}
								 sx={{ height: '100%', alignContent: 'flex-start' }}>
								{
									sortedDepartments.map((department) =>
										<Box
											key={department._id}
											flexBasis={0}
											flexGrow={1}
											minWidth={250}>
											<OneDepartmentDepartmentsComponent
												department={department}
											/>
										</Box>,
									)
								}
							</Box>
						</td>
					</tr>
					</tbody>
				</table>
				<EditDepartmentFormComponent />
			</Box>
		</>
	);
}

export default DepartmentsComponents;