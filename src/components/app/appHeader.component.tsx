import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { IUserObject, IUserUpdate } from '@/interfaces/user.interface.ts';
import OnlineIconComponent from '@/components/app/onlineIcon.component.tsx';
import RightButtonsGroupComponent from '@/components/app/rightButtonsGroup.component.tsx';
import { IDepartmentObject } from '@/interfaces/department.interface.ts';

interface IAppHeaderProps {
	me: IUserUpdate,
	onlineUsers: string[],
	departments: IDepartmentObject,
	isConnected: boolean,
	users: IUserObject,
	connectToWebsocket: () => void,
	changeMyDepartment: (newVal: string | null) => void,
	// changeMyDepartment: (event: ChangeEvent<HTMLSelectElement>) => void,
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
				(<Box display="flex" flexDirection="row" alignItems="center"
					  marginBottom={'20px'}>
					<Box display="flex" justifyContent="flex-start" alignItems="center">
						<Box marginRight={'20px'}>
							<OnlineIconComponent
								isConnected={isConnected}
								onlineUsers={onlineUsers}
								users={users}
								connectToWebsocket={connectToWebsocket} />
						</Box>
						{me.name} •
						<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
							<Select
								value={me.currentDepartment}
								onChange={(event) => {
									changeMyDepartment(event.target.value);
								}}
								sx={{ pl: '5px' }}

							>
								{me && me.departments && Object.keys(departments).length > 0 && (
									me.departments.map((item) => (
										<MenuItem key={item} value={item}>
											{departments[item]?.title}
										</MenuItem>
									))
								)
								}
							</Select>
						</FormControl>
						{/*<NativeSelect*/}
						{/*	sx={{ ml: '5px', pl: '5px' }}*/}
						{/*	onChange={changeMyDepartment}*/}
						{/*	value={me.currentDepartment}*/}
						{/*>*/}
						{/*	{*/}
						{/*		me && me.departments && Object.keys(departments).length > 0 && (*/}
						{/*			me.departments.map((item) => (*/}
						{/*				<option key={item} value={item}>*/}
						{/*					/!*{item}*!/*/}
						{/*					{departments[item]?.title}*/}
						{/*				</option>*/}
						{/*			))*/}
						{/*		)*/}
						{/*	}*/}
						{/*</NativeSelect>*/}

					</Box>
					<Box display="flex" flexGrow={1} justifyContent="center" alignItems="center">
					</Box>
					<Box display="flex" justifyContent="flex-end" alignItems="center">
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
