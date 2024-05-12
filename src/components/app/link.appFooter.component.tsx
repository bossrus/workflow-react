import { FC } from 'react';
import { IColors } from '@/interfaces/appSupport.interface.ts';

interface ILinkProps {
	goToUrl: (url: string) => void;
	color: IColors,
	title: string,
	link: string,
	letter: string,
}

const LinkAppFooterComponent: FC<ILinkProps> = ({
													goToUrl,
													color,
													title,
													link,
													letter,
												}) => {
	return (
		<>
			\ <strong
			className={'fake-link'}
			style={{ color: color }}
			onClick={() => goToUrl(link)}
		>{title}</strong> <small>
			(ALT+
			<strong>
				{letter}
			</strong>)
		</small> \
		</>
	);
};

export default LinkAppFooterComponent;