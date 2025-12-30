import storeData from '@/utils/storeData'
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

          <link rel="icon" type="image/png" href="/assets/icons/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg" />
          <link rel="shortcut icon" href="/assets/icons/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/logo-og.jpg" />
          <meta name="apple-mobile-web-app-title" content={storeData.title} />
          <link rel="manifest" href="/assets/icons/site.webmanifest" />

          <meta name="theme-color" content={storeData.secondaryColor} />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://agjoias.vercel.app/" />
          <meta property="og:title" content={storeData.title} />
          <meta property="og:description" content={storeData.description} />
          <meta property="og:image" content="https://agjoias.vercel.app/assets/icons/logo-og.jpg" />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="400" />
          <meta property="og:site_name" content={storeData.title} />

          {/* Twitter Cards */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={storeData.title} />
          <meta name="twitter:description" content={storeData.description} />
          <meta name="twitter:image" content="https://agjoias.vercel.app/assets/icons/logo-og.jpg" />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
