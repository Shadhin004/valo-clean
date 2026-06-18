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
    ? 'Valo-Clean | Laadukkaat Siivouspalvelut Kotiin ja Toimistoon Helsinki' 
    : locale === 'sv' 
    ? 'Valo-Clean | Premium Städtjänster för Hem och Kontor i Helsingfors' 
    : 'Valo-Clean | Premium Cleaning Services for Home & Office Helsinki';
  const description = locale === 'fi'
    ? 'Valo-Clean tarjoaa luotettavaa kotisiivousta, toimistosiivousta ja porrassiivousta pääkaupunkiseudulla. Pyydä ilmainen tarjous jo tänään!'
    : locale === 'sv'
    ? 'Valo-Clean erbjuder professionell hemstädning, kontorsstädning och trappstädning i Helsingfors. Kontakta oss för en fri offert idag!'
    : 'Valo-Clean offers professional residential cleaning, office cleaning, and staircase cleaning in Helsinki. Request a free estimate today!';
  return { title, description };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Services data
  const services = [
    {
      num: '01',
      title: dict.services.home_title,
      desc: dict.services.home_desc,
      icon: '/assets/img/icon/service-icon-1-1.svg',
      image: '/assets/img/service/home-cleaning.jpg',
    },
    {
      num: '02',
      title: dict.services.kitchen_title,
      desc: dict.services.kitchen_desc,
      icon: '/assets/img/icon/service-icon-1-2.svg',
      image: '/assets/img/service/kitchen-cleaning.jpg',
    },
    {
      num: '03',
      title: dict.services.moveout_title,
      desc: dict.services.moveout_desc,
      icon: '/assets/img/icon/service-icon-1-3.svg',
      image: '/assets/img/service/move-out-cleaning.jpg',
    },
    {
      num: '04',
      title: dict.services.staircase_title,
      desc: dict.services.staircase_desc,
      icon: '/assets/img/icon/service-icon-1-4.svg',
      image: '/assets/img/service/staircase-cleaning.jpg',
    },
  ];

  // Team data
  const team = [
    { name: 'Albert K.', role: dict.team.member_role, img: '/assets/img/team/team-img-1-1.png' },
    { name: 'Emilia S.', role: dict.team.member_role, img: '/assets/img/team/team-img-1-2.png' },
    { name: 'Mikko L.', role: dict.team.member_role, img: '/assets/img/team/team-img-1-3.png' },
    { name: 'Sanni H.', role: dict.team.member_role, img: '/assets/img/team/team-img-1-4.png' },
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
                <div className="play-video me-4 mb-3 mb-sm-0">
                  <a
                    href="https://www.youtube.com/watch?v=moYayPRgaY0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="play-btn2"
                  >
                    <i className="fas fa-play"></i>
                  </a>
                </div>
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
                    <CounterWrapper targetCount={950} title={dict.stats.happy_clients} icon="/assets/img/icon/counter-icon-1-1.svg" />
                  </div>
                  <div className="col-sm-6 col-md-3 text-center">
                    <CounterWrapper targetCount={45} title={dict.stats.awards} icon="/assets/img/icon/counter-icon-1-2.svg" />
                  </div>
                  <div className="col-sm-6 col-md-3 text-center">
                    <CounterWrapper targetCount={400} title={dict.stats.projects} icon="/assets/img/icon/counter-icon-1-3.svg" />
                  </div>
                  <div className="col-sm-6 col-md-3 text-center">
                    <CounterWrapper targetCount={100} title={dict.stats.members} icon="/assets/img/icon/counter-icon-1-4.svg" />
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
                    <img src="/assets/img/about/author-img.jpg" alt="author" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
                    <div>
                      <h6 className="mb-0">Markus K.</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Co-founder</p>
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
                    <img src={service.image} alt={service.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="vs-service__body p-4">
                    <div className="vs-service__header d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <p className="vs-service__subtitle mb-0 text-muted">{dict.services.subtitle} {service.num}</p>
                        <h4 className="vs-service__title h6 mb-0 mt-1">{service.title}</h4>
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

      {/* Client Logos / Trust Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="row g-4 align-items-center justify-content-center text-center">
            <div className="col-xl-3 text-xl-start">
              <h5 className="mb-1 text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '14px' }}>
                {dict.common.satisfaction}
              </h5>
              <h4 className="fw-bold">{locale === 'fi' ? 'Luottokumppanimme' : locale === 'sv' ? 'Våra Partners' : 'Our Trusted Partners'}</h4>
            </div>
            <div className="col-xl-9">
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-4 align-items-center justify-content-center">
                {['brand-1.png', 'brand-2.png', 'brand-3.png', 'brand-4.png', 'brand-5.png'].map((brand, idx) => (
                  <div key={idx} className="col d-flex justify-content-center">
                    <img
                      src={`/assets/img/brand/${brand}`}
                      alt={`Brand ${idx + 1}`}
                      className="img-fluid"
                      style={{ maxHeight: '40px', opacity: 0.7, filter: 'grayscale(100%)' }}
                    />
                  </div>
                ))}
              </div>
            </div>
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
                <div className="vs-team__style1 text-center bg-white border rounded p-4 h-100 shadow-sm">
                  <div className="vs-team__img mx-auto mb-3" style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%' }}>
                    <img src={member.img} alt={member.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <h4 className="h6 mb-1">{member.name}</h4>
                  <p className="text-success small mb-3">{member.role}</p>
                  <div className="d-flex justify-content-center gap-2">
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
