'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroCarouselProps {
  locale: string;
  dict: any;
}

export default function HeroCarousel({ locale, dict }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/assets/img/hero/hero-img-1-1.png',
      bgImage: '/assets/img/bg/hero-bg-1.jpg',
    },
    {
      image: '/assets/img/hero/hero-img-1-2.png',
      bgImage: '/assets/img/bg/hero-bg-1.jpg',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="vs-hero__layout1 overflow-hidden position-relative" style={{ minHeight: '650px' }}>
      {/* Background Image */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `url('${slides[currentSlide].bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          top: 0,
          left: 0,
          zIndex: 1,
          transition: 'background-image 0.8s ease-in-out',
        }}
      />

      <div className="main-container3 position-relative z-index" style={{ zIndex: 2 }}>
        <div className="row justify-content-end align-items-center" style={{ minHeight: '650px', paddingTop: '100px', paddingBottom: '50px' }}>
          
          {/* Hero Content */}
          <div className="col-lg-6 position-relative">
            <div className="vs-hero__content">
              <div className="vs-hero__subtitle wow animate__fadeInUp" style={{ visibility: 'visible' }}>
                <span className="icon">
                  <img src="/assets/img/icon/satisfaction-icon.svg" alt="Hero Icon" />
                </span>
                {dict.common.satisfaction}
              </div>
              <h1 className="vs-hero__title wow animate__fadeInUp" style={{ visibility: 'visible', textTransform: 'capitalize' }}>
                {dict.hero.title_part1} <span className="vs-hero__title--highlight">Nordo Clean</span> {dict.hero.title_part2}
              </h1>
              <p className="text-white mb-4 fs-5 wow animate__fadeInUp" style={{ visibility: 'visible', maxWidth: '550px' }}>
                {dict.hero.subtitle}
                <strong style={{ display: 'block', marginTop: '12px', color: '#00d084' }}>
                  {locale === 'fi' 
                    ? 'Laske tarkka hinta-arvio sekunneissa laskurillamme!' 
                    : locale === 'sv' 
                    ? 'Beräkna en exakt prisuppskattning på några sekunder!' 
                    : 'Calculate an exact price estimate in seconds!'}
                </strong>
              </p>
              <Link className="vs-btn2 wow animate__fadeInUp" style={{ visibility: 'visible' }} href={`/${locale}/calculator`}>
                {locale === 'fi' ? 'Laske hinta heti' : locale === 'sv' ? 'Beräkna pris direkt' : 'Check price instantly'}
                <i className="fas fa-calculator ms-2"></i>
              </Link>
              <span className="dot-shape"></span>
            </div>
            
            {/* Small shapes */}
            <span className="shape-mockup hero-shep2 moving d-none d-md-block" style={{ left: '-110px', bottom: '-30px' }}>
              <img src="/assets/img/shapes/clean1.png" alt="hero element" />
            </span>
          </div>

          {/* Hero Image slider */}
          <div className="col-lg-6">
            <div className="vs-hero__image position-relative d-flex justify-content-center">
              <div className="main-img" style={{ position: 'relative', width: '100%', height: '450px', maxWidth: '500px' }}>
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="slide-item position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      opacity: index === currentSlide ? 1 : 0,
                      transition: 'opacity 0.8s ease-in-out',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <img
                      src={slide.image}
                      alt="Hero Image"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Graphical Shapes behind hero image */}
              <span className="shape-mockup hero-shep3 custome-sheap1 d-none d-md-block" style={{ left: '-50px', bottom: 0, zIndex: -1 }}>
                <img src="/assets/img/shapes/hero-shep-1-1.svg" alt="shape" />
              </span>
              <span className="shape-mockup hero-shep4 custome-sheap1 d-none d-md-block" style={{ left: '-130px', bottom: 0, zIndex: -1 }}>
                <img src="/assets/img/shapes/hero-shep-1-2.svg" alt="shape" />
              </span>
              <span className="shape-mockup hero-shep5 spin d-lg-block d-none" style={{ left: '75px', top: '90px', zIndex: -1 }}>
                <img src="/assets/img/shapes/circle-1.png" alt="shape" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Background Bubbles */}
      <div className="bubbles d-lg-block d-none" style={{ zIndex: 1 }}>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      
      {/* Wave bottom shape */}
      <span className="shape-mockup d-none d-md-block" style={{ left: '0px', top: '60px', zIndex: 1 }}>
        <img src="/assets/img/shapes/hero-sheap3.png" alt="Hero element" />
      </span>
    </section>
  );
}
