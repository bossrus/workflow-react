import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';

const PasswordSettingsComponent = () => {
	const { me, departmentsObject } = useReduxSelectors();

	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState('');

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
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
				sx={{ pt: 2 }}
				label="Пароль"
				id="password"
				type={showPassword ? 'text' : 'password'}
				variant="standard"
				fullWidth
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
			<Button
				variant="contained"
				size="small"
				fullWidth
				sx={{ mt: 2, borderRadius: '10px' }}
				color={'info'}
				disabled={password.length === 0}
				onClick={() => {
					changePassword(password);
					setPassword('');
					setShowPassword(false);
				}}
			>
				Обновить пароль
			</Button>
		</Box>
	);
};

export default PasswordSettingsComponent;