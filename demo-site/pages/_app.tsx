import type { AppProps } from 'next/app';
import { DemoStateProvider } from '../context/DemoState';
import Toast from '../components/Toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DemoStateProvider>
      <Component {...pageProps} />
      <Toast />
    </DemoStateProvider>
  );
}

export default MyApp;
