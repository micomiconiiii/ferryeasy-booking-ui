import { BookingProvider } from '@/context/BookingContext';

function MyApp({ Component, pageProps }) {
  return (
    <BookingProvider>
      <Component {...pageProps} />
    </BookingProvider>
  );
}

export default MyApp;
