import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

import { Store } from 'redux';
import { myStore } from './store/_store.ts';
import { Provider } from 'react-redux';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './scss/main.scss';

const rootElement = document.getElementById('root');

export const Root = ({ myStore }: { myStore: Store }) => (
	<Provider store={myStore}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);

createRoot(rootElement!).render(<Root myStore={myStore} />);

//TODO редактирование
//TODO не забыть очистку переменных после добавления задания
//TODO отображение заказов (предварительно сделать несколько в разные отделы) сделать
//TODO приглашения присоединиться сделать {без стора ?? хз}
//TODO флеш оповещения сделать {без стора ?? хз}
//TODO лампочка при отключении сокета