import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { NextSeo } from 'next-seo'

import { googleTagManagerId } from '../utils/gtm';
import GoogleTagManager, {
  GoogleTagManagerId,
} from '../components/GoogleTagManager';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleTagManager
        googleTagManagerId={googleTagManagerId as GoogleTagManagerId}
      />
      <NextSeo
        title="AIプロットメーカー"
        description="ChatGPTを利用して物語のプロットをお手軽作成"
        canonical="https://ai-plot-maker.vercel.app/"
        openGraph={{
          url: "https://ai-plot-maker.vercel.app/",
          title: "AIプロットメーカー",
          description: "ChatGPTを利用して物語のプロットをお手軽作成",
          images: [
            {
              url: "https://ai-plot-maker.vercel.app/vercel.svg",
              width: 1024,
              height: 235,
              alt: "AIプロットメーカー",
              type: "image/svg+xml",
            }
          ],
          siteName: "AIプロットメーカー",
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
