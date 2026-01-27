import Head from "next/head";

export default function Frame() {
  return (
    <>
      <Head>
        {/* Required Farcaster Frame tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://days-since-iquit.vercel.app/frame-image.png" />
        <meta property="fc:frame:button:1" content="Open Days Since I Quit" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://days-since-iquit.vercel.app" />

        {/* Optional but good */}
        <meta property="og:title" content="Days Since I Quit" />
        <meta property="og:description" content="Onchain habit tracker built for Base" />
      </Head>
    </>
  );
}
