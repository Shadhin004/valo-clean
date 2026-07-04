import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceCalculator from '@/components/PriceCalculator';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fi'
    ? 'Hinta-arviolaskuri | Nordo Clean - Siivouspalvelut'
    : locale === 'sv'
    ? 'Priskalkylator | Nordo Clean - Städning priser'
    : 'Price Calculator | Nordo Clean - Cleaning Estimates';

  const description = locale === 'fi'
    ? 'Laske arvioitu hinta kotisiivoukselle, toimistosiivoukselle tai muuttosiivoukselle heti. Täytä tiedot ja pyydä alustava tarjous sähköpostiisi.'
    : locale === 'sv'
    ? 'Beräkna det uppskattade priset för hemstädning, kontorsstädning eller flyttstädning direkt. Fyll i uppgifterna och få ett prisförslag.'
    : 'Get an instant estimated price for residential cleaning, office cleaning, or move-out cleaning. Receive a detailed proposal by email.';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nordoclean.fi';

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: `/${locale}/calculator`,
      siteName: 'Nordo Clean',
      images: [
        {
          url: '/assets/img/nordo-clean-logo.png',
          width: 1200,
          height: 630,
          alt: 'Nordo Clean Price Calculator',
        },
      ],
      locale: locale === 'fi' ? 'fi_FI' : locale === 'sv' ? 'sv_SE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/img/nordo-clean-logo.png'],
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict} />

      {/* Breadcrumb Area */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: "url('/assets/img/breadcumb/breadcumb-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0',
          position: 'relative',
        }}
      >
        <div className="container text-center position-relative z-index">
          <h1 className="breadcumb-title text-white fw-bold mb-2">{dict.calculator.title}</h1>
          <ul className="breadcumb-menu text-white list-inline mb-0">
            <li className="list-inline-item">
              <Link href={`/${locale}`} className="text-white-50">{dict.common.home}</Link>
            </li>
            <li className="list-inline-item text-white-50 mx-2">/</li>
            <li className="list-inline-item text-white">{dict.calculator.title}</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="py-5 bg-light">
        <div className="container py-4 text-center">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <span className="sec-subtitle text-success fw-bold text-uppercase">{dict.calculator.subtitle}</span>
              <h2 className="fw-bold my-3 text-dark">{dict.calculator.title}</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '15px' }}>
                {dict.calculator.desc}
              </p>
            </div>
          </div>

          <PriceCalculator locale={locale} dict={dict} />
        </div>
      </section>

      {/* FAQ Callout section */}
      <section className="py-5 bg-white text-center">
        <div className="container py-3">
          <h3 className="fw-bold mb-3">
            {locale === 'fi' ? 'Tarvitsetko räätälöidyn ratkaisun?' : locale === 'sv' ? 'Behöver du en skräddarsydd städlösning?' : 'Looking for a Custom Cleaning Plan?'}
          </h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
            {locale === 'fi'
              ? 'Jos kohteesi on erityisen suuri tai vaatii erityishuomiota, ota meihin suoraan yhteyttä ja laadimme sinulle räätälöidyn tarjouksen.'
              : locale === 'sv'
              ? 'Om ditt utrymme är särskilt stort eller kräver specialvård, kontakta oss direkt för ett anpassat prisförslag.'
              : 'If your space is exceptionally large or requires specialized maintenance, contact us directly and we will build a custom package for you.'}
          </p>
          <Link href={`/${locale}/contact`} className="vs-btn2">
            {dict.common.contact}
            <i className="far fa-long-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
