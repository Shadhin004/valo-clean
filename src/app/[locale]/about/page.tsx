import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CounterWrapper from '@/components/CounterWrapper';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
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
          <h1 className="breadcumb-title text-white fw-bold mb-2">{dict.common.about}</h1>
          <ul className="breadcumb-menu text-white list-inline mb-0">
            <li className="list-inline-item">
              <Link href={`/${locale}`} className="text-white-50">{dict.common.home}</Link>
            </li>
            <li className="list-inline-item text-white-50 mx-2">/</li>
            <li className="list-inline-item text-white">{dict.common.about}</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="about-layout1 py-5">
        <div className="container py-4">
          <div className="row gx-60 g-5 align-items-center">
            {/* Left Image gallery */}
            <div className="col-lg-6">
              <div className="img-box1 position-relative">
                <div className="img1">
                  <img src="/assets/img/about/about-main.jpg" alt="About" className="img-fluid rounded" />
                </div>
                <div className="img2" style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '60%', border: '8px solid white', borderRadius: '8px' }}>
                  <img src="/assets/img/about/about-detail.jpg" alt="About Detail" className="img-fluid rounded" />
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div className="col-lg-6">
              <div className="about-content">
                <span className="sec-subtitle left-shape text-success font-weight-bold">{dict.about.subtitle}</span>
                <h2 className="sec-title fw-bold my-3">{dict.about.title}</h2>
                <p className="about-text text-muted my-4">{dict.about.desc}</p>

                {/* Features */}
                <div className="row g-4 mt-2">
                  <div className="col-sm-6">
                    <div className="p-3 border rounded bg-light">
                      <div className="mb-2">
                        <img src="/assets/img/icon/about-icon2.svg" alt="Icon" style={{ width: '40px' }} />
                      </div>
                      <h5 className="h6 fw-bold">{dict.about.house_title}</h5>
                      <p className="small text-muted mb-0">{dict.about.house_desc}</p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 border rounded bg-light">
                      <div className="mb-2">
                        <img src="/assets/img/icon/about-icon3.svg" alt="Icon" style={{ width: '40px' }} />
                      </div>
                      <h5 className="h6 fw-bold">{dict.about.living_title}</h5>
                      <p className="small text-muted mb-0">{dict.about.living_desc}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-light border-start border-success border-4 rounded-end">
                  <p className="mb-0 fw-semibold text-dark">{dict.about.notice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-sm-6 col-md-3">
              <CounterWrapper targetCount={950} title={dict.stats.happy_clients} icon="/assets/img/icon/counter-icon-1-1.svg" />
            </div>
            <div className="col-sm-6 col-md-3">
              <CounterWrapper targetCount={45} title={dict.stats.awards} icon="/assets/img/icon/counter-icon-1-2.svg" />
            </div>
            <div className="col-sm-6 col-md-3">
              <CounterWrapper targetCount={400} title={dict.stats.projects} icon="/assets/img/icon/counter-icon-1-3.svg" />
            </div>
            <div className="col-sm-6 col-md-3">
              <CounterWrapper targetCount={100} title={dict.stats.members} icon="/assets/img/icon/counter-icon-1-4.svg" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote Banner */}
      <section className="py-5 bg-white text-center">
        <div className="container py-4">
          <h2 className="fw-bold mb-3">{locale === 'fi' ? 'Valitse Luotettava Kotimainen Kumppani' : locale === 'sv' ? 'Välj En Pålitlig Partner' : 'Choose a Trusted Partner'}</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            {locale === 'fi'
              ? 'Tyytyväisyytesi on meille ensiarvoisen tärkeää. Räätälöimme siivouksemme vastaamaan toiveitasi.'
              : locale === 'sv'
              ? 'Din nöjdhet är vår prioritet. Vi skräddarsyr städningen efter dina behov.'
              : 'Your satisfaction is our priority. We customize our cleaning services to meet your requirements.'}
          </p>
          <Link href={`/${locale}/contact`} className="vs-btn2 mt-3">
            {dict.common.contact}
            <i className="far fa-long-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
