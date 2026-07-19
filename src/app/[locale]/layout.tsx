import type { Metadata } from 'next';
import '@/app/globals.css'; // Standard next.js global overrides

export const metadata: Metadata = {
  title: 'Nordo Clean | Siivouspalvelut',
  description: 'Premium cleaning services for your home and office.',
  verification: {
    google: 'WYh1u1BH04DsYFssGjD8LMY0E54kVpPi5miFrp1lC4Q',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&family=Poppins:wght@400;500;600;700;800&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />

        {/* Template CSS Styles from public assets */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
