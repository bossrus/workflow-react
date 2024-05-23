import { Box, Button, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { validateEmail } from '@/_services/emailValidation.service.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import axiosCreate from '@/_api/axiosCreate.ts';
import { changeMeEmail } from '@/store/me.slice.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import SwitchButtonComponent
	from '@/components/_shared/switchButton.component.tsx';
import { FALSE_COLOR } from '@/_constants/colors.ts';

const EmailSettingsComponent = () => {

	const { me } = useReduxSelectors();
	const [email, setEmail] = useState('');

	const [canSendLetters, setCanSendLetters] = useState(false);

	const dispatch = useDispatch<TAppDispatch>();

	const changeEmail = async () => {
		const newUser: Partial<IUser> = { _id: me._id };
		if (email) newUser.email = email;
		await axiosCreate.patch('users/email', newUser);
		dispatch(changeMeEmail({ id: me._id!, email }));
	};

	const changeSubscribe = useCallback((isCanSendLetters: boolean) => {
		setCanSendLetters(isCanSendLetters);
		const newMe: Partial<IUser> = { _id: me._id, isSendLetterAboutNewWorks: isCanSendLetters };
		dispatch(patchOne({ url: 'users/me', data: newMe }));
	}, [me._id, dispatch]);

	const [disableButton, setDisableButton] = useState(false);

	useEffect(() => {
		setDisableButton(!validateEmail(email) && !(email === '' && me.email !== email));
	}, [email]);

	useEffect(() => {
		if (me.email) setEmail(me.email);
		setCanSendLetters(me.isSendLetterAboutNewWorks as boolean);
	}, [me.email]);

	return (
		<Box>
			<TextField
				type={'email'}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				id="email"
				label="электронная почта"
				variant="standard"
			/>
			{(!me.emailConfirmed || me.email !== email) && email && (
				<>
					{email && me.email === email && (
						<Typography variant="caption" sx={{ textAlign: 'center', color: '#989a9b' }}>
							<i>
								мы послали вам письмо.<br />
								для подтверждения почтового ящика необходимо пройти по ссылке из письма
							</i>
						</Typography>
					)}
					<Button
						variant="contained"
						size="small"
						fullWidth
						sx={{ mt: 2, borderRadius: '10px' }}
						color={'info'}
						disabled={disableButton}
						onClick={changeEmail}
					>
						{!me.email
							? 'Добавить почту'
							: me.email === email
								? 'Выслать повторное письмо со ссылкой'
								: email === ''
									? 'Стереть почту'
									: 'Сменить почту'}
					</Button>
				</>
			)}
			{me.emailConfirmed &&
				<SwitchButtonComponent
					checkState={canSendLetters}
					changeChecked={changeSubscribe}
					mode={'usual'}
					falseTitle={'Не присылать мне никаких сообщений на почту'}
					trueTitle={'Присылать сообщения о появлении новых работ в моём отделе'}
					falseBackgroundColor={FALSE_COLOR}
					trueBackgroundColor={'green'}
				/>}
		</Box>
	);
};

export default EmailSettingsComponent;