import {
	Box,
	Button,
	FormControlLabel,
	FormGroup, IconButton,
	InputAdornment,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import RowInMeSettingsComponent from '@/components/settings/me/rowInMeSettings.component.tsx';
import { MouseEvent, useEffect, useState } from 'react';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IUserUpdate } from '@/interfaces/user.interface.ts';
import { TAppDispatch } from '@/store/_store.ts';
import { useDispatch } from 'react-redux';
import { changeMeEmail } from '@/store/me.slice.ts';
import { MaterialUISwitch, SwitchStyledIcon } from '@/scss/switchStyled.ts';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { patchOne } from '@/store/_shared.thunks.ts';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function MeSettingsComponent() {
	const { me, departmentsObject } = useReduxSelectors();
	const [email, setEmail] = useState('');
	const [disableButton, setDisableButton] = useState(false);
	const [canSendLetters, setCanSendLetters] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState('');

	const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const dispatch = useDispatch<TAppDispatch>();
	const changeEmail = async () => {
		const newUser: IUserUpdate = {
			_id: me._id,
			email,
		};
		await axiosCreate.patch('users/email', newUser);
		dispatch(changeMeEmail({
			id: me._id!,
			email,
		}));
	};

	const changeSubscribe = (isCanSendLetters: boolean) => {
		setCanSendLetters(isCanSendLetters);
		const newMe: IUserUpdate = {
			_id: me._id,
			isSendLetterAboutNewWorks: isCanSendLetters,
		};
		dispatch(patchOne({
			url: 'users/me',
			data: newMe,
		}));
	};

	const changePassword = () => {
		const newUser: IUserUpdate = {
			_id: me._id,
			password,
		};
		setPassword('');
		setShowPassword(false);

		dispatch(patchOne({
			url: 'users/me',
			data: newUser,
		}));
	};

	useEffect(() => {
		if (me.email) setEmail(me.email);
	}, [me.email]);

	const validateEmail = (email: string) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};


	useEffect(() => {
		setDisableButton(!validateEmail(email));
	}, [email]);

	const FALSE_COLOR = '#92a38f';

	const theme = useTheme();

	return (
		<>
			{
				Object.keys(me).length > 0 && Object.keys(departmentsObject).length > 0 &&
				(
					<Box display="flex" flexDirection="column" height="100%" pt={4}>
						<table className={'table-container'}>
							<tbody>
							<tr>
								<td className={'align-top justify-center'}>
									<Box
										className={'shadow'}
										borderRadius={'10px'}
										p={2}
									>
										<RowInMeSettingsComponent title={'имя'}>
											{me.name}
										</RowInMeSettingsComponent>
										<RowInMeSettingsComponent title={'логин'}>
											{me.login}
										</RowInMeSettingsComponent>
										{me.departments
											&& <Box pb={2}>
												<RowInMeSettingsComponent title={'отделы'}>
													{
														me.departments.map((department) => (
															<p style={{ margin: 0 }} key={department}>
																{departmentsObject[department].title}
															</p>
														))
													}
												</RowInMeSettingsComponent>
											</Box>
										}

										<TextField type={'email'}
												   value={email}
												   onChange={(e) => setEmail(e.target.value)}
												   fullWidth
												   id="email"
												   label="электронная почта"
												   inputProps={{
													   style: {
														   ...theme.typography.h5,
														   fontWeight: 'bold',
														   paddingLeft: '1em',
													   },
												   }}
												   variant="standard" />
										{(!me.emailConfirmed || me.email != email) && <>
											{me.email === email &&
												<Typography variant="h6" sx={{ textAlign: 'center', color: '#989a9b' }}>
													мы послали вам письмо.<br />
													для подтверждения почтового ящика необходимо пройти по ссылке из
													письма
												</Typography>
											}
											<Button
												variant="contained"
												size="small"
												fullWidth
												sx={{ mt: 2, borderRadius: '10px' }}
												color={'info'}
												className={'up-shadow'}
												disabled={disableButton}
												onClick={() => changeEmail()}
											>
												{!me.email
													? 'Добавить почту'
													: me.email === email
														? 'Выслать повторное письмо со ссылкой'
														: 'Сменить почту'
												}
											</Button>
										</>
										}
										{me.email && me.emailConfirmed && <>
											<FormGroup sx={{ pt: 2 }}>
												<FormControlLabel
													control={
														<MaterialUISwitch
															sx={{ m: 1 }}
															icon={
																<SwitchStyledIcon
																	sx={{ backgroundColor: FALSE_COLOR }}
																>
																	<CancelOutlinedIcon
																		sx={{ color: 'black' }}
																	/>
																</SwitchStyledIcon>
															}
															checkedIcon={
																<SwitchStyledIcon
																	sx={{ backgroundColor: 'green' }}
																>
																	<CheckCircleOutlineIcon
																		sx={{ color: 'white' }}
																	/>
																</SwitchStyledIcon>
															}
														/>
													}
													label={<Typography
														sx={{
															fontWeight: 'bold',
															color: canSendLetters ? 'green' : FALSE_COLOR,
														}}
													>
														{canSendLetters
															? 'Присылать сообщения о появлении новых работ в моём отделе'
															: 'Не присылать мне никаких сообщений на почту'}
													</Typography>}
													checked={canSendLetters}
													onChange={(_event, checked) => changeSubscribe(checked)}
												/>
											</FormGroup>
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
												className={'up-shadow'}
												disabled={password.length === 0}
												onClick={() => changePassword()}
											>
												Обновить пароль
											</Button>
										</>}
									</Box>
								</td>
							</tr>
							</tbody>
						</table>
					</Box>
				)
			}
		</>
	);
}

export default MeSettingsComponent;

