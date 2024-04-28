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


//TODO лампочка сокета на старте. если нет коннета — законнектить
//TODO лампочка при отключении сокета. если нет коннета — законнектить
//TOOO на инвайтах сделать по ескейпу отказ от всех инвайтов, по ентеру принятие всех