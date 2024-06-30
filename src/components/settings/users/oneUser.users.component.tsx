import { Box, Typography } from '@mui/material';
import { IUser } from '@/interfaces/user.interface.ts';
import CheckedStringOneUserUsersComponent from '@/components/settings/users/checkedString.oneUser.users.component.tsx';
import RoundButtonComponent from '@/components/_shared/roundButton.component.tsx';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { setState } from '@/store/_currentStates.slice.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { getTitleByID } from '@/_services/getTitleByID.service.ts';
import TitleWithCaptionSettingsComponent from '@/components/settings/_shared/titleWithCaption.settings.component.tsx';

interface IOneUserProps {
	user: IUser;
	deleteUser: (id: string) => void;
}

function OneUserUsersComponent({
								   user: {
									   _id,
									   name,
									   departments,
									   canMakeModification,
									   canSeeStatistics,
									   isAdmin,
									   canStartStopWorks,
									   login,
								   },
								   deleteUser,
							   }: IOneUserProps) {

	const { departmentsObject: listOfDepartments, states: { currentUser } } = useReduxSelectors();

	const disabled = currentUser === _id;

	const dispatch = useDispatch<TAppDispatch>();

	const changeEditedUser = (id: string | undefined) => {
		dispatch(setState({
			currentUser: id,
		}));
	};


	return (
		<Box
			className={`border-radius-10px display-flex padding-1su margin-2su ${disabled ? 'in-depth' : 'shadow'}`}
		>
			<Box
				className={'flex-grow-1 padding-1su'}
			>
				<TitleWithCaptionSettingsComponent caption={'имя'} title={name} />
				<TitleWithCaptionSettingsComponent caption={'логин'} title={login} />

				<Typography
					variant="caption"
					className={'color-my-gray'}
				>
					входит в отдел{departments.length > 1 && 'ы'}:
				</Typography>
				{departments.map(department => (
					<Typography
						key={department}
						variant="h5"
						className={'font-weight-bold'}>
						{getTitleByID(listOfDepartments, department)}
					</Typography>
				))}
				<Box
					className={'padding-top-2su'}
				>
					{(canMakeModification || canSeeStatistics ||
							canStartStopWorks || isAdmin) &&
						<Typography
							variant="caption"
							className={'color-my-gray'}
						>
							дополнительные права:
						</Typography>}
					{
						canMakeModification && <CheckedStringOneUserUsersComponent title={'создать новые номера'} />
					}
					{
						canSeeStatistics && <CheckedStringOneUserUsersComponent title={'видеть статистику'} />
					}
					{
						canStartStopWorks &&
						<CheckedStringOneUserUsersComponent title={'начинать и завершать работу'} />
					}
					{
						isAdmin && <CheckedStringOneUserUsersComponent title={'администрировать'} />
					}
				</Box>


			</Box>
			<Box
				className={'display-flex flex-direction-column justify-content-space-between'}
			>
				<RoundButtonComponent mode={'delete'} id={_id} dis={disabled} onClickHere={deleteUser} />
				<RoundButtonComponent mode={'edit'} id={_id} dis={disabled} onClickHere={changeEditedUser} />
			</Box>
		</Box>
	);
}

export default OneUserUsersComponent;