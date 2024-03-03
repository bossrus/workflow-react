import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';

interface IProps {
	operation: string;
	bd: string,
	id: string;
	version: number;
}

export const wsReactions = ({ operation, bd, id, version }: IProps) => {
	const {
		modificationsObject,
		firmsObject,
		typesOfWorkObject,
		departmentsObject,
		usersObject,
	} = useReduxSelectors();

};