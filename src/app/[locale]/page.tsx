import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';

// Simple client wrapper for counters to support animated count up
import CounterWrapper from '@/components/CounterWrapper';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fi' 
    ? 'Nordo Clean | Laadukkaat siivouspalvelut kotiin ja toimistoon Mustasaari & Vaasa' 
    : locale === 'sv' 
    ? 'Nordo Clean | Premium städtjänster för hem och kontor i Korsholm & Vasa' 
    : 'Nordo Clean | Premium cleaning services for home & office Mustasaari & Vaasa';
  const description = locale === 'fi'
    ? 'Nordo Clean tarjoaa luotettavaa kotisiivousta, toimistosiivousta ja porrassiivousta Mustasaaren ja Vaasan alueella. Pyydä ilmainen tarjous jo tänään!'
    : locale === 'sv'
    ? 'Nordo Clean erbjuder professionell hemstädning, kontorsstädning och trappstädning i Korsholm och Vasa. Kontakta oss för en fri offert idag!'
    : 'Nordo Clean offers professional residential cleaning, office cleaning, and staircase cleaning in Mustasaari and Vaasa. Request a free estimate today!';
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nordoclean.fi';

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'Nordo Clean',
      images: [
        {
          url: '/assets/img/nordo-clean-logo.png',
          width: 1200,
          height: 630,
          alt: 'Nordo Clean',
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

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Services data
  const services = [
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
  ];

  // Team data
  const team: { name: string; role: string; img: string; phone?: string }[] = [
    { name: 'Emma Rosenlund', role: dict.team.founder_role, phone: '+358 40 521 8220', img: '/assets/img/team/emma-rosenlund.png' },
    { name: 'Tanveer Khan', role: dict.team.manager_role, phone: '+358 31 722 5412', img: '/assets/img/team/tanveer-khan.png' },
    { name: 'Albert K.', role: dict.team.member_role, img: '/assets/img/team/team-img-1-3.png' },
    { name: 'Emilia S.', role: dict.team.member_role, img: '/assets/img/team/team-img-1-4.png' },
  ];

  return (
    <>
      <Header locale={locale} dict={dict} />
      
      {/* Hero Slider */}
      <HeroCarousel locale={locale} dict={dict} />

      {/* Counter/Achievements Section */}
      <div className="vs-counter__layout1 position-relative py-5">
        <div className="main-container4">
          <div className="row align-items-center justify-content-sm-center g-4">
            <div className="col-md-auto">
              <div className="vs-counter__inner d-flex align-items-center flex-wrap">
                <div className="vs-counter__content">
                  <div className="title-area title-anime">
                    <span className="sec-subtitle justify-content-center">{dict.about.subtitle}</span>
                    <h2 className="sec-title text-uppercase" style={{ fontSize: '24px' }}>
                      {locale === 'fi' ? 'SYVÄPUHDISTUSTA KAUPUNGISSASI' : locale === 'sv' ? 'DJUPRENGÖRING I DIN STAD' : 'DEEP CLEANING IN YOUR CITY'}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="counter-style1">
                <div className="row g-4 justify-content-lg-between justify-content-center align-items-center">
                  <div className="col-sm-6 col-md-3 text-center">
                    <div className="media-style my-2">
                      <div className="media-inner d-flex align-items-center justify-content-center flex-column flex-sm-row">
                        <span className="counter-icon mb-2 mb-sm-0 me-sm-3">
                          <img src="/assets/img/icon/counter-icon-1-1.svg" alt="icon" style={{ width: '45px' }} />
                        </span>
                        <div className="media-counter text-center text-sm-start">
                          <h4 className="media-title h6 mb-1 fw-bold text-white">{dict.stats.title_1}</h4>
                          <p className="media-text text-muted mb-0 small">{dict.stats.desc_1}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3 text-center">
                    <div className="media-style my-2">
                      <div className="media-inner d-flex align-items-center justify-content-center flex-column flex-sm-row">
                        <span className="counter-icon mb-2 mb-sm-0 me-sm-3">
                          <img src="/assets/img/icon/counter-icon-1-2.svg" alt="icon" style={{ width: '45px' }} />
                        </span>
                        <div className="media-counter text-center text-sm-start">
                          <h4 className="media-title h6 mb-1 fw-bold text-white">{dict.stats.title_2}</h4>
                          <p className="media-text text-muted mb-0 small">{dict.stats.desc_2}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3 text-center">
                    <div className="media-style my-2">
                      <div className="media-inner d-flex align-items-center justify-content-center flex-column flex-sm-row">
                        <span className="counter-icon mb-2 mb-sm-0 me-sm-3">
                          <img src="/assets/img/icon/counter-icon-1-3.svg" alt="icon" style={{ width: '45px' }} />
                        </span>
                        <div className="media-counter text-center text-sm-start">
                          <h4 className="media-title h6 mb-1 fw-bold text-white">{dict.stats.title_3}</h4>
                          <p className="media-text text-muted mb-0 small">{dict.stats.desc_3}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3 text-center">
                    <div className="media-style my-2">
                      <div className="media-inner d-flex align-items-center justify-content-center flex-column flex-sm-row">
                        <span className="counter-icon mb-2 mb-sm-0 me-sm-3">
                          <img src="/assets/img/icon/counter-icon-1-4.svg" alt="icon" style={{ width: '45px' }} />
                        </span>
                        <div className="media-counter text-center text-sm-start">
                          <h4 className="media-title h6 mb-1 fw-bold text-white">{dict.stats.title_4}</h4>
                          <p className="media-text text-muted mb-0 small">{dict.stats.desc_4}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Summary Section */}
      <section className="about-layout1 space-top py-5">
        <div className="container">
          <div className="row gx-60 g-5 align-items-center justify-content-center">
            <div className="col-xl-6">
              <div className="img-box1 position-relative">
                <div className="img1">
                  <img src="/assets/img/about/about-main.jpg" alt="About Image 1" className="img-fluid rounded" />
                </div>
                <div className="img2" style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '60%', border: '8px solid white', borderRadius: '8px' }}>
                  <img src="/assets/img/about/about-detail.jpg" alt="About Image 2" className="img-fluid rounded" />
                </div>
                <div className="img-icon d-none d-md-block" style={{ position: 'absolute', left: '-30px', top: '-30px' }}>
                  <img src="/assets/img/icon/about-icon1.svg" alt="icon" />
                </div>
              </div>
            </div>
            
            <div className="col-xl-6">
              <div className="about-content">
                <div className="title-area">
                  <span className="sec-subtitle left-shape">{dict.about.subtitle}</span>
                  <h2 className="sec-title">{dict.about.title}</h2>
                  <p className="about-text mt-3">{dict.about.desc}</p>
                </div>
                
                <div className="about-box1 d-flex flex-wrap gap-4 my-4">
                  <div className="about-item p-3 border rounded bg-light flex-grow-1" style={{ minWidth: '200px' }}>
                    <span className="item-icon mb-2 d-block">
                      <img src="/assets/img/icon/about-icon2.svg" alt="icon" />
                    </span>
                    <h5 className="item-title">{dict.about.house_title}</h5>
                    <p className="item-text text-muted mb-0">{dict.about.house_desc}</p>
                  </div>
                  <div className="about-item p-3 border rounded bg-light flex-grow-1" style={{ minWidth: '200px' }}>
                    <span className="item-icon mb-2 d-block">
                      <img src="/assets/img/icon/about-icon3.svg" alt="icon" />
                    </span>
                    <h5 className="item-title">{dict.about.living_title}</h5>
                    <p className="item-text text-muted mb-0">{dict.about.living_desc}</p>
                  </div>
                </div>

                <div className="about-inner d-flex align-items-center flex-wrap gap-4 mt-4">
                  <Link className="vs-btn2" href={`/${locale}/about`}>
                    {dict.common.read_more}
                    <i className="far fa-long-arrow-right ms-2"></i>
                  </Link>
                  <div className="author-box d-flex align-items-center">
                    <img src="/assets/img/team/emma-rosenlund.png" alt="author" className="rounded-circle me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    <div>
                      <h6 className="mb-0">Emma Rosenlund</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                        {dict.team.founder_role} | <a href="tel:+358405218220" className="text-muted hover-text-success" style={{ textDecoration: 'none' }}>+358 40 521 8220</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="about-notice p-3 border-start border-4 border-success mt-4 bg-light">
                  <p className="notice-text mb-0 fw-semibold text-success">{dict.about.notice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="vs-service__layout1 space py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-6">
              <div className="title-area">
                <span className="sec-subtitle">{dict.services.subtitle}</span>
                <h2 className="sec-title">{dict.services.title}</h2>
              </div>
            </div>
          </div>
          
          <div className="row g-4 justify-content-center">
            {services.map((service, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="vs-service__style1 bg-white h-100 border rounded overflow-hidden shadow-sm hover-shadow transition">
                  <div className="vs-service__img position-relative" style={{ height: '200px' }}>
                    <Link href={`/${locale}/services/${service.slug}`}>
                      <img src={service.image} alt={service.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </Link>
                  </div>
                  <div className="vs-service__body p-4">
                    <div className="vs-service__header d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <p className="vs-service__subtitle mb-0 text-muted">{dict.services.subtitle} {service.num}</p>
                        <h4 className="vs-service__title h6 mb-0 mt-1">
                          <Link href={`/${locale}/services/${service.slug}`} className="text-dark hover-text-success" style={{ textDecoration: 'none' }}>
                            {service.title}
                          </Link>
                        </h4>
                      </div>
                      <div className="vs-service__icon bg-light p-2 rounded-circle" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={service.icon} alt="icon" style={{ width: '24px' }} />
                      </div>
                    </div>
                    <p className="vs-service__text text-muted mb-0">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link href={`/${locale}/services`} className="vs-btn2">
              {dict.common.discover_more}
              <i className="far fa-long-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section className="space py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-6">
              <div className="title-area">
                <span className="sec-subtitle">{dict.team.subtitle}</span>
                <h2 className="sec-title">{dict.team.title}</h2>
              </div>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {team.map((member, index) => (
              <div key={index} className="col-lg-3 col-sm-6">
                <div className="vs-team__style1 text-center bg-white border rounded p-4 h-100 shadow-sm d-flex flex-column justify-content-between">
                  <div>
                    <div className="vs-team__img mx-auto mb-3" style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%' }}>
                      <img src={member.img} alt={member.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                    <h4 className="h6 mb-1">{member.name}</h4>
                    <p className="text-success small mb-1">{member.role}</p>
                    {member.phone && (
                      <p className="text-muted small mb-3">
                        <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="text-muted hover-text-success" style={{ textDecoration: 'none' }}>
                          <i className="fa-solid fa-phone me-1"></i> {member.phone}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <a href="#" className="text-muted"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="text-muted"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#" className="text-muted"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
