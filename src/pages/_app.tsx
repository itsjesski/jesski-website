import React, { useEffect } from 'react';

import { AppProps } from 'next/app';

import '../styles/main.css';
import '../styles/prism-a11y-dark.css';

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch common routes
    router.prefetch('/posts');
    router.prefetch('/games');
    router.prefetch('/art');
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
