import { FormControlLabel, Switch, Typography } from '@mui/material';

interface IElement {
	_id: string,
	title: string,
}

type ReadonlyTuple = readonly IElement[];

interface IProps {
	list: ReadonlyTuple | IElement[],
	usingElements: string[],
	changeUsingElements: (newUserDepartments: string[]) => void,
}


function CheckListUsersComponent({ list, usingElements, changeUsingElements }: IProps) {

	return (<>
			{
				list.map((department) => {
					return (
						<FormControlLabel
							style={{ flexGrow: 1 }}
							key={department._id}
							value={usingElements.includes(department._id)}
							control={<Switch
								size={'small'}
								sx={{ ml: 1 }}
								checked={usingElements.includes(department._id)}
								onChange={(event) => {
									if (event.target.checked) {
										changeUsingElements([...usingElements, department._id]);
									} else {
										changeUsingElements(usingElements.filter((id) => id !== department._id));
									}
								}}
							/>}
							label={
								<Typography
									className={usingElements.includes(department._id) ? 'text-bold' : 'text-gray'}>
									{department.title}
								</Typography>
							}
						/>
					);
				})
			}
		</>
	);
}

export default CheckListUsersComponent;