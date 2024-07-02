import { Box } from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import OneDepartmentDepartmentsComponent
	from '@/components/settings/departments/oneDepartment.departments.settings.component.tsx';
import { useEffect, useMemo, useState } from 'react';
import { IDepartment } from '@/interfaces/department.interface.ts';
import EditDepartmentFormComponent
	from '@/components/settings/departments/editDepartmentForm.departments.settings.component.tsx';
import { useNavigate } from 'react-router-dom';


function DepartmentsComponents() {
	const { departmentsArray, me } = useReduxSelectors();

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(me).length > 0 && !me.isAdmin) {
			navigate('/settings/me');
		}
		document.title = 'Отделы';
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
			<Box
				className={'display-flex flex-direction-column height-100'}
			>

				<table className={'table-container'}>
					<tbody>
					<tr>
						<td className={'vertical-align-top'}>
							<Box
								className={'display-flex flex-wrap flex-grow-1 overflow-auto padding-2su height-100 align-content-flex-start'}
							>
								{
									sortedDepartments.map((department) =>
										<Box
											key={department._id}
											className={'flex-basis-0 flex-grow-1 min-width-250px'}
										>
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