'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterProps {
  locale: string;
  dict: any;
}

export default function Footer({ locale, dict }: FooterProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Circle properties
  const CIRCLE_RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalHeight > 0) {
        const progress = (scrollPosition / totalHeight) * 100;
        setScrollProgress(progress);
      }

      if (scrollPosition > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const offset = CIRCUMFERENCE * (1 - scrollProgress / 100);

  const galleryImages = [
    '/assets/img/service/home-cleaning.jpg',
    '/assets/img/service/commercial-cleaning.jpg',
    '/assets/img/service/kitchen-cleaning.jpg',
    '/assets/img/service/move-out-cleaning.jpg',
    '/assets/img/service/staircase-cleaning.jpg',
    '/assets/img/service/window-cleaning.jpg',
  ];

  return (
    <>
      <footer className="footer-wrapper footer-layout1">
        {/* Main Widget Area */}
        <div
          className="widget-area position-relative"
          style={{
            backgroundImage: "url('/assets/img/bg/footer-bg-1-1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container">
            <div className="row g-4 justify-content-xl-center">
              {/* About Widget */}
              <div className="col-xl-4 col-md-6">
                <div className="widget footer-widget">
                  <div className="vs-widget-about">
                    <div className="footer-logo mb-4">
                      <Link href={`/${locale}`}>
                        <img src="/assets/img/logo-white.svg" alt="logo" style={{ maxHeight: '50px' }} />
                      </Link>
                    </div>
                    <p className="footer-text text-white-50">
                      {dict.about.desc}
                    </p>
                    <div className="contact-box my-4 d-flex align-items-center">
                      <span className="icon me-3">
                        <img src="/assets/img/icon/call-icon.svg" alt="icon" />
                      </span>
                      <div className="contact-content">
                        <h6 className="contact-title mb-0">
                          <a href="tel:+358405218220" className="text-white">+358 40 521 8220</a>
                        </h6>
                        <p className="contact-text text-white-50 mb-0">{dict.common.call_hours}</p>
                      </div>
                    </div>

                    <div className="social-style1">
                      <span className="social-title text-white">{dict.common.follow_us}</span>
                      <div className="social-icon d-inline-block ms-2">
                        <a href="#"><i className="fab fa-facebook-f text-white"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in text-white"></i></a>
                        <a href="#"><i className="fab fa-instagram text-white"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-xl-5 col-md-6">
                <div className="widget widget_categories footer-widget">
                  <h3 className="widget_title">{dict.common.services}</h3>
                  <ul>
                    <li>
                      <Link href={`/${locale}/services`}>{dict.services.home_title}</Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/services`}>{dict.services.kitchen_title}</Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/services`}>{dict.services.moveout_title}</Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/services`}>{dict.services.staircase_title}</Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/services`}>{dict.services.office_title}</Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/services`}>{dict.services.window_title}</Link>
                    </li>
                    <li className="mt-2">
                      <Link href={`/${locale}/calculator`} style={{ color: '#00d084', fontWeight: 'bold' }}>
                        <i className="fas fa-calculator me-2"></i>{dict.calculator.title}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="col-xl-3 col-md-6">
                <div className="widget footer-widget">
                  <h3 className="widget_title">Galleria</h3>
                  <div className="sidebar-gallery d-flex flex-wrap gap-2">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="gallery-thumb position-relative" style={{ width: '70px', height: '70px', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Wave line shape */}
          <div className="common-line shape-mockup d-none d-xxl-block" style={{ top: '-7px' }}>
            <img src="/assets/img/shapes/line-shep.png" alt="shapes" />
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright-wrap">
          <div className="container">
            <div className="row justify-content-xl-between justify-content-center align-items-center">
              <div className="col-auto">
                <p className="copyright-text mb-0">
                  <i className="fal fa-copyright me-1"></i>
                  {dict.common.copyright}
                </p>
              </div>
              <div className="col-auto mt-2 mt-xl-0">
                <div className="copyright-img">
                  <img src="/assets/img/default/payment-img.svg" alt="payment options" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll To Top Button */}
      <button
        className={`back-to-top ${isVisible ? 'show' : ''}`}
        id="backToTop"
        aria-label="Back to Top"
        onClick={scrollToTop}
        style={{
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'all 0.3s ease-in-out',
          zIndex: 99,
        }}
      >
        <span className="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r="40" style={{ fill: 'none', stroke: '#1a1a1a', strokeWidth: '6' }}></circle>
            <circle
              className="progress"
              cx="50"
              cy="50"
              r="40"
              style={{
                fill: 'none',
                stroke: '#00d084',
                strokeWidth: '6',
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: offset,
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            ></circle>
          </svg>
          <span className="progress-percentage" id="progressPercentage" style={{ fontSize: '12px', fontWeight: 'bold' }}>
            {Math.round(scrollProgress)}%
          </span>
        </span>
      </button>
    </>
  );
}
