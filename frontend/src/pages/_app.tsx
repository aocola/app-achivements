// pages/_app.tsx
import { ToastrProvider } from '@/components/common/toastr/ToastrProvider';
import store from '@/redux/store';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <ToastrProvider />
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
