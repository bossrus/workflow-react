import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

const PasswordSettingsComponent = () => {
	const { me } = useReduxSelectors();

	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState('');

	const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const dispatch = useDispatch<TAppDispatch>();
	const changePassword = (password: string) => {
		const newUser: Partial<IUser> = { _id: me._id, password };
		dispatch(patchOne({ url: 'users/me', data: newUser }));
	};

	return (
		<Box>
			<TextField
				className={'padding-top-2su width-100'}
				label="Пароль"
				id="password"
				type={showPassword ? 'text' : 'password'}
				variant="standard"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => setShowPassword(!showPassword)}
								onMouseDown={handleMouseDownPassword}
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<ContainedSmallButtonComponent
				className={'width-100'}
				color={'info'}
				disabled={password.length === 0}
				onClick={() => {
					changePassword(password);
					setPassword('');
					setShowPassword(false);
				}}
			>
				Обновить пароль
			</ContainedSmallButtonComponent>
		</Box>
	);
};

export default PasswordSettingsComponent;