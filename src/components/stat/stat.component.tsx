import { useParams } from 'react-router-dom';
import AllWorkflowsStatComponent from '@/components/stat/allWorkflows.stat.component.tsx';
import SpecificWorkflowStatComponent from '@/components/stat/specificWorkflow.stat.component.tsx';

export type ICheckboxNames = 'showChecked' | 'showUnchecked';

function StatComponent() {
	const { id: paramsId } = useParams();


	// console.log(paramsId);
	return (
		<>
			{
				paramsId !== undefined
					? <SpecificWorkflowStatComponent propsId={paramsId} />
					: <AllWorkflowsStatComponent />
			}
		</>
	);
}

export default StatComponent;