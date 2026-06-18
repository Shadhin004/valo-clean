import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fi'
    ? 'Palvelumme | Kotisiivous, Toimistosiivous & Porrassiivous'
    : locale === 'sv'
    ? 'Våra Tjänster | Hemstädning, Kontorsstädning & Trappstädning'
    : 'Our Services | Residential, Commercial & Staircase Cleaning';
  const description = locale === 'fi'
    ? 'Tutustu monipuolisiin siivouspalveluihimme: kotisiivous, keittiön tehopuhdistus, muuttosiivous, porrassiivous, ikkunanpesu ja yrityssiivous.'
    : locale === 'sv'
    ? 'Upptäck våra städtjänster: hemstädning, köksrengöring, flyttstädning, trappstädning, fönsterputsning och företagsstädning.'
    : 'Discover our wide range of cleaning services: residential cleaning, kitchen deep cleaning, move-out cleaning, staircase cleaning, window washing, and office cleaning.';
  return { title, description };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // List of all 6 services with specific slugs
  const allServices = [
    {
      num: '01',
      slug: 'home-cleaning',
      title: dict.services.home_title,
      desc: dict.services.home_desc,
      icon: '/assets/img/icon/service-icon-1-1.svg',
      image: '/assets/img/service/home-cleaning.jpg',
    },
    {
      num: '02',
      slug: 'kitchen-cleaning',
      title: dict.services.kitchen_title,
      desc: dict.services.kitchen_desc,
      icon: '/assets/img/icon/service-icon-1-2.svg',
      image: '/assets/img/service/kitchen-cleaning.jpg',
    },
    {
      num: '03',
      slug: 'move-out-package',
      title: dict.services.moveout_title,
      desc: dict.services.moveout_desc,
      icon: '/assets/img/icon/service-icon-1-3.svg',
      image: '/assets/img/service/move-out-cleaning.jpg',
    },
    {
      num: '04',
      slug: 'staircase-cleaning',
      title: dict.services.staircase_title,
      desc: dict.services.staircase_desc,
      icon: '/assets/img/icon/service-icon-1-4.svg',
      image: '/assets/img/service/staircase-cleaning.jpg',
    },
    {
      num: '05',
      slug: 'commercial-cleaning',
      title: dict.services.office_title,
      desc: dict.services.office_desc,
      icon: '/assets/img/icon/service-icon-1-4.svg',
      image: '/assets/img/service/commercial-cleaning.jpg',
    },
    {
      num: '06',
      slug: 'window-cleaning',
      title: dict.services.window_title,
      desc: dict.services.window_desc,
      icon: '/assets/img/icon/service-icon-1-1.svg',
      image: '/assets/img/service/window-cleaning.jpg',
    },
  ];

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
          <h1 className="breadcumb-title text-white fw-bold mb-2">{dict.common.services}</h1>
          <ul className="breadcumb-menu text-white list-inline mb-0">
            <li className="list-inline-item">
              <Link href={`/${locale}`} className="text-white-50">{dict.common.home}</Link>
            </li>
            <li className="list-inline-item text-white-50 mx-2">/</li>
            <li className="list-inline-item text-white">{dict.common.services}</li>
          </ul>
        </div>
      </div>

      {/* Main Service List Area */}
      <section className="space py-5">
        <div className="container py-4">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-6">
              <div className="title-area">
                <span className="sec-subtitle text-success">{dict.services.subtitle}</span>
                <h2 className="sec-title fw-bold my-2">{dict.services.title}</h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {allServices.map((service, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="vs-service__style1 bg-white h-100 border rounded overflow-hidden shadow-sm hover-shadow transition">
                  <div className="vs-service__img position-relative" style={{ height: '220px' }}>
                    <Link href={`/${locale}/services/${service.slug}`}>
                      <img src={service.image} alt={service.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </Link>
                  </div>
                  <div className="vs-service__body p-4">
                    <div className="vs-service__header d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <p className="vs-service__subtitle mb-0 text-muted">{dict.services.subtitle} {service.num}</p>
                        <h4 className="vs-service__title h5 mb-0 mt-1">
                          <Link href={`/${locale}/services/${service.slug}`} className="text-dark hover-text-success" style={{ textDecoration: 'none' }}>
                            {service.title}
                          </Link>
                        </h4>
                      </div>
                      <div className="vs-service__icon bg-light p-2 rounded-circle" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={service.icon} alt="icon" style={{ width: '26px' }} />
                      </div>
                    </div>
                    <p className="vs-service__text text-muted mb-0">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking banner */}
      <section className="py-5 bg-light border-top text-center">
        <div className="container py-3">
          <h3 className="fw-bold mb-3">
            {locale === 'fi' ? 'Tarvitsetko Ammattitaitoista Siivoojaa?' : locale === 'sv' ? 'Behöver du professionell städhjälp?' : 'Need Professional Cleaning Assistance?'}
          </h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
            {locale === 'fi'
              ? 'Ota meihin yhteyttä jo tänään ja pyydä ilmainen arvio koti- tai toimistosiivouksesta.'
              : locale === 'sv'
              ? 'Kontakta oss idag för att få ett prisförslag för städning av ditt hem eller kontor.'
              : 'Get in touch with us today for a free price estimate on cleaning your home or commercial office space.'}
          </p>
          <Link href={`/${locale}/contact`} className="vs-btn2">
            {dict.common.get_pricing}
            <i className="far fa-long-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
