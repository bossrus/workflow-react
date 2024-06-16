import { Button } from '@mui/material';
import { ReactNode } from 'react';

interface IProps {
	variant: 'text' | 'outlined' | 'contained';
	color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
	disabled: boolean;
	onClick: () => void;
	children: ReactNode;
	className: string;

}

const smallButtonComponent = ({ className, variant, color, disabled, onClick, children }: IProps) => {
	return (
		<Button
			variant={variant}
			size="small"
			className={`small-button ${className}`}
			color={color}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</Button>
	);
};

export default smallButtonComponent;