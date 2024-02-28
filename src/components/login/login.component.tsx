import { Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MouseEvent, useEffect, useState } from 'react';
import { createOne } from '@/store/_api.slice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { TAppDispatch, TAppState } from '@/store/_store.ts';
import { clearMeError, selectMe, selectMeError } from '@/store/me.slice.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { setAuth } from '@/_security/auth.ts';
import { useNavigate } from 'react-router-dom';

function LoginComponent() {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [wasTry, setWasTry] = useState(false);

	const loginData = useSelector<TAppState>((state) =>
		selectMe(state),
	) as IUser;

	useEffect(() => {
		dispatch(clearMeError());
	}, []);

	const loginError = useSelector<TAppState>((state) =>
		selectMeError(state),
	) as string;

	const dispatch = useDispatch<TAppDispatch>();

	async function handleClickLoginButton() {
		setWasTry(true);
		dispatch(createOne({
			url: 'users/login', data: {
				login,
				password,
			},
		}));
	}

	const navigate = useNavigate();
	useEffect(() => {
		if (Object.keys(loginData).length > 0) {
			setAuth(loginData._id, loginData.loginToken as string);
			navigate('/');
		}
	}, [loginData]);

	const [showError, setShowError] = useState(false);

	useEffect(() => {
		if (wasTry && loginError !== undefined) {
			setShowError(true);
			setTimeout(() => setShowError(false), 4000);
		}
	}, [loginError]);

	return (
		<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={'100%'}
			 height={'100%'}>
			<Card elevation={10}
				  className={`border-round-1em ${showError ? 'error-border' : ''}`}>
				<CardContent>
					<Typography variant="h5" component="h2" sx={{ mb: '1em' }}>
						Добро пожаловать!
					</Typography>
					<TextField
						label="Логин"
						id="login-small"
						size="small"
						variant="standard"
						fullWidth
						value={login}
						onChange={(e) => setLogin(e.target.value)}
					/>
					<TextField
						label="Пароль"
						id="standard-adornment-password"
						type={showPassword ? 'text' : 'password'}
						variant="standard"
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
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
					<Button variant="contained" color="primary" sx={{ mt: '2em' }} fullWidth
							onClick={handleClickLoginButton}>
						Войти
					</Button>
				</CardContent>
			</Card>
			<Card className={`errorCard ${showError ? 'show' : ''}`}>
				<CardContent>
					<Typography variant="h6" sx={{ m: 'auto' }}>
						Неверный пользователь или пароль
					</Typography>
				</CardContent>
			</Card>


		</Box>
	);
}

export default LoginComponent;