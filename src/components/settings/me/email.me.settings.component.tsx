import { Box, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { validateEmail } from '@/_services/emailValidation.service.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { useDispatch } from 'react-redux';
import { TAppDispatch } from '@/store/_store.ts';
import axiosCreate from '@/_api/axiosCreate.ts';
import { changeMeEmail } from '@/store/me.slice.ts';
import { patchOne } from '@/store/_shared.thunks.ts';
import SwitchButtonComponent from '@/components/_shared/switchButton.component.tsx';
import { FALSE_COLOR } from '@/_constants/colors.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

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

	const changeSubscribe = (isCanSendLetters: boolean) => {
		setCanSendLetters(isCanSendLetters);
		const newMe: Partial<IUser> = { _id: me._id, isSendLetterAboutNewWorks: isCanSendLetters };
		dispatch(patchOne({ url: 'users/me', data: newMe }));
	};

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
				className={'width-100'}
				id="email"
				label="электронная почта"
				variant="standard"
			/>
			{(!me.emailConfirmed || me.email !== email) && (
				<>
					{email && me.email === email && (
						<Typography
							variant="caption"
							className={'text-align-center color-my-gray display-flex line-height-1 margin-top-05su'}
						>
							<i>
								мы&nbsp;послали вам&nbsp;письмо.<br />
								для&nbsp;подтверждения почтового ящика необходимо пройти по&nbsp;ссылке из&nbsp;письма
							</i>
						</Typography>
					)}
					<ContainedSmallButtonComponent
						className={'width-100'}
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
					</ContainedSmallButtonComponent>
				</>
			)}
			{me.emailConfirmed &&
				<Box className={'padding-top-1su width-100 height-100'}>
					<SwitchButtonComponent
						checkState={canSendLetters}
						changeChecked={changeSubscribe}
						mode={'usual'}
						falseTitle={'Не присылать мне никаких сообщений на почту'}
						trueTitle={'Присылать сообщения о появлении новых работ в моём отделе'}
						falseBackgroundColor={FALSE_COLOR}
						trueBackgroundColor={'green'}
					/>
				</Box>
			}
		</Box>
	);
};

export default EmailSettingsComponent;