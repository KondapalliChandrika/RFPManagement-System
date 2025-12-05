import { Provider } from 'react-redux';
import store from './basemodules/redux/store';
import AppRouter from './basemodules/navigation/AppRouter';
import './basemodules/network/Interceptors';
import './assets/styles/global.css';

function App() {
    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    );
}

export default App;
