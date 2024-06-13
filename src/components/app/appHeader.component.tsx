import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import OnlineIconComponent from '@/components/app/onlineIcon.component.tsx';
import RightButtonsGroupComponent from '@/components/app/rightButtonsGroup.component.tsx';
import { IDepartmentsObject } from '@/interfaces/department.interface.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';

interface IAppHeaderProps {
	me: IUserUpdate,
	onlineUsers: string[],
	departments: IDepartmentsObject,
	isConnected: boolean,
	users: IUserObject,
	connectToWebsocket: () => void,
	changeMyDepartment: (newVal: string | null) => void,
	changeSounds: (isSoundProps: boolean) => void,
	logout: () => void,
}

function AppHeaderComponent(props: IAppHeaderProps) {
	const {
		onlineUsers,
		isConnected,
		users,
		connectToWebsocket,
		me,
		changeMyDepartment,
		departments,
		changeSounds,
		logout,
	} = props;
	return (
		<>
			{departments && me.name && Object.keys(departments).length > 0 &&
				(<Box
					className={'display-flex flex-direction-row align-items-center flex-wrap margin-bottom-20px'}
				>
					<Box
						className={'display-flex justify-content-flex-start align-items-center flex-wrap'}
					>
						<Box
							className={'margin-right-20px'}
						>
							<OnlineIconComponent
								isConnected={isConnected}
								onlineUsers={onlineUsers}
								users={users}
								connectToWebsocket={connectToWebsocket} />
						</Box>
						{me.name}
						<FormControl
							variant="standard"
							className={'margin-1su min-width-120px'}
						>
							<Select
								value={me.currentDepartment}
								onChange={(event) => {
									changeMyDepartment(event.target.value);
								}}
								className={'padding-left-5px'}
							>
								{me && me.departments && Object.keys(departments).length > 0 && (
									me.departments.map((item) => (
										<MenuItem key={item} value={item}>
											{getTitleByID(departments, item)}
										</MenuItem>
									))
								)
								}
							</Select>
						</FormControl>
					</Box>
					<Box
						className={'display-flex flex-grow-1 justify-content-center align-items-center'}
					>
					</Box>
					<Box
						className={'display-flex justify-content-flex-end align-items-center flex-wrap'}
					>
						<RightButtonsGroupComponent
							isSoundOn={me.isSoundOn as boolean}
							changeSounds={changeSounds}
							logout={() => logout()}
						/>
					</Box>
				</Box>)}
		</>
	);
}

export default AppHeaderComponent;
