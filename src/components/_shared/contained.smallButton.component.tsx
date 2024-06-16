import { ReactNode } from 'react';
import SmallButtonComponent from '@/components/_shared/smallButton.component.tsx';

interface IProps {
	color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
	disabled?: boolean;
	onClick: () => void;
	children: ReactNode;
	className?: string;
}

const outlinedSmallButtonComponent = ({ color, disabled = false, onClick, children, className = '' }: IProps) => {
	return (
		<SmallButtonComponent
			variant={'contained'}
			color={color}
			disabled={disabled}
			onClick={onClick}
			className={className}
		>
			{children}
		</SmallButtonComponent>
	);
};

export default outlinedSmallButtonComponent;