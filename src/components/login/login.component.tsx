import { Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MouseEvent, useEffect, useState } from 'react';
import { createOne } from '@/store/_shared.thunks.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import { clearMeError } from '@/store/me.slice.ts';
import { setAuth } from '@/_security/auth.ts';
import { useNavigate } from 'react-router-dom';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { clearErrors } from '@/_hooks/errors.hook.ts';

function LoginComponent() {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [wasTry, setWasTry] = useState(false);

	const { me: loginData, meError: loginError } = useReduxSelectors();

	useEffect(() => {
		clearErrors(dispatch);
		dispatch(clearMeError());
	}, []);

	const dispatch = useDispatch<TAppDispatch>();

	async function clickLoginButton() {
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
			(async () => {
				await setAuth(loginData._id!, loginData.loginToken as string);
			})();
			navigate('/');
		}
	}, [loginData]);

	const [showError, setShowError] = useState('');

	useEffect(() => {
		console.log('loginError = ', loginError);
		if (wasTry && loginError) {
			setShowError(loginError.message);
			setTimeout(() => {
				setShowError('');
				setWasTry(false);
			}, 4000);
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
							onClick={clickLoginButton}>
						Войти
					</Button>
				</CardContent>
			</Card>
			<Card className={`errorCard ${showError !== '' ? 'show' : ''}`}>
				<CardContent>
					<Typography variant="h6" sx={{ m: 'auto' }}>
						{showError}
					</Typography>
				</CardContent>
			</Card>


		</Box>
	);
}

export default LoginComponent;