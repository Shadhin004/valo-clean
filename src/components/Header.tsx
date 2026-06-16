'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  locale: string;
  dict: any;
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle switching language path
  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/');
    // segments[0] is empty, segments[1] is current locale
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}`, label: dict.common.home },
    { href: `/${locale}/about`, label: dict.common.about },
    { href: `/${locale}/services`, label: dict.common.services },
    { href: `/${locale}/contact`, label: dict.common.contact },
  ];

  return (
    <>
      {/* Mobile Menu Wrapper */}
      <div className={`vs-menu-wrapper ${isMobileMenuOpen ? 'vs-body-visible' : ''}`} style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
        <div className="vs-menu-area text-center" style={{ left: isMobileMenuOpen ? '0' : '-100%' }}>
          <button className="vs-menu-toggle" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fal fa-times"></i>
          </button>
          <div className="mobile-logo my-4">
            <Link href={`/${locale}`}>
              <img src="/assets/img/logo.svg" alt="logo" style={{ maxWidth: '150px' }} />
            </Link>
          </div>
          <div className="vs-mobile-menu">
            <ul>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className={isActive ? 'active' : ''}>
                    <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-4">
            <span className="text-white d-block mb-2">{dict.common.follow_us}</span>
            <div className="social-icon">
              <a href="#" className="mx-1 text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="mx-1 text-white"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="mx-1 text-white"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Search Box */}
      <div className={`popup-search-box ${isSearchOpen ? 'show' : ''}`} style={{ display: isSearchOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
        <button className="searchClose" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
          <i className="fal fa-times"></i>
        </button>
        <div style={{ maxWidth: '600px', margin: '15% auto 0 auto', padding: '0 20px', position: 'relative' }}>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const servicesList = [
              { slug: 'home-cleaning', title: dict.services.home_title },
              { slug: 'kitchen-cleaning', title: dict.services.kitchen_title },
              { slug: 'move-out-package', title: dict.services.moveout_title },
              { slug: 'staircase-cleaning', title: dict.services.staircase_title },
              { slug: 'commercial-cleaning', title: dict.services.office_title },
              { slug: 'window-cleaning', title: dict.services.window_title },
            ];
            const matched = servicesList.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
            if (matched.length > 0) {
              router.push(`/${locale}/services/${matched[0].slug}`);
              setIsSearchOpen(false);
              setSearchQuery('');
            }
          }}>
            <div className="position-relative">
              <input
                type="text"
                className="w-100"
                placeholder={locale === 'fi' ? 'Hae palveluita (esim. muutto, koti)...' : locale === 'sv' ? 'Sök tjänster (t.ex. flytt, hem)...' : 'Search services (e.g. move, home)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'white',
                  color: 'black',
                  fontSize: '18px',
                  padding: '15px 50px 15px 20px',
                  borderRadius: '8px',
                  border: '3px solid #00d084',
                  outline: 'none',
                }}
              />
              <button type="submit" style={{ position: 'absolute', right: '20px', top: '15px', background: 'none', border: 'none', color: '#00d084', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fal fa-search"></i>
              </button>
            </div>
          </form>

          {/* Search Suggestions */}
          {searchQuery.trim() !== '' && (
            <div 
              className="bg-white shadow rounded mt-2 p-2 text-start"
              style={{
                position: 'absolute',
                width: 'calc(100% - 40px)',
                zIndex: 9999,
                maxHeight: '250px',
                overflowY: 'auto',
                border: '1px solid #eee'
              }}
            >
              {[
                { slug: 'home-cleaning', title: dict.services.home_title },
                { slug: 'kitchen-cleaning', title: dict.services.kitchen_title },
                { slug: 'move-out-package', title: dict.services.moveout_title },
                { slug: 'staircase-cleaning', title: dict.services.staircase_title },
                { slug: 'commercial-cleaning', title: dict.services.office_title },
                { slug: 'window-cleaning', title: dict.services.window_title },
              ]
                .filter(service => service.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(service => (
                  <Link
                    key={service.slug}
                    href={`/${locale}/services/${service.slug}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="d-block p-2 text-dark rounded text-decoration-none hover-bg-light"
                    style={{ fontSize: '15px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.2s' }}
                  >
                    <i className="fas fa-chevron-right text-success me-2 small"></i>
                    {service.title}
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      <header className="vs-header header-layout1">
        {/* Top Info Header */}
        <div className="header-top">
          <div className="main-container2">
            <div className="row justify-content-md-between justify-content-center align-items-center">
              <div className="col-auto d-md-block d-none">
                <div className="header-links">
                  <ul>
                    <li>
                      <i className="far fa-envelope"></i>
                      <a href="mailto:info@valoclean.fi">info@valoclean.fi</a>
                    </li>
                    <li className="d-lg-inline d-none">
                      <i className="far fa-clock"></i>
                      {dict.common.working_hours}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-auto d-flex align-items-center">
                {/* Language Switcher */}
                <div className="me-4 d-flex align-items-center">
                  <span className="text-white me-2" style={{ fontSize: '12px' }}>FI/SV/EN:</span>
                  <select
                    className="form-select form-select-sm"
                    value={locale}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '2px 8px'
                    }}
                  >
                    <option value="fi" style={{ color: 'black' }}>Suomi</option>
                    <option value="sv" style={{ color: 'black' }}>Svenska</option>
                    <option value="en" style={{ color: 'black' }}>English</option>
                  </select>
                </div>
                
                <div className="social-style1">
                  <span className="social-title d-none d-sm-inline">{dict.common.follow_us}</span>
                  <div className="social-icon d-inline-block ms-2">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Header */}
        <div className={`sticky-wrapper ${isSticky ? 'will-sticky' : ''}`}>
          <div className={`sticky-active ${isSticky ? 'active' : ''}`}>
            <div className="menu-area">
              <div className="main-container2">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="header-logo">
                      <Link href={`/${locale}`}>
                        <img src="/assets/img/logo-white.svg" alt="logo" style={{ maxHeight: '45px' }} />
                      </Link>
                    </div>
                  </div>
                  <div className="col">
                    <nav className="main-menu menu-style1 d-none d-lg-block">
                      <ul>
                        {navLinks.map((link) => {
                          const isActive = pathname === link.href;
                          return (
                            <li key={link.href} className={isActive ? 'active' : ''}>
                              <Link href={link.href}>{link.label}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                  <div className="col-auto d-lg-none">
                    <button className="vs-menu-toggle d-inline-block" onClick={() => setIsMobileMenuOpen(true)}>
                      <i className="fal fa-bars"></i>
                    </button>
                  </div>
                  <div className="col-auto d-lg-block d-none">
                    <div className="header-inner">
                      <div className="header-icons">
                        <button className="searchBoxTggler" onClick={() => setIsSearchOpen(true)}>
                          <i className="fal fa-search"></i>
                        </button>
                        <a className="icon-btn" href="tel:+358401234567">
                          <i className="fa-solid fa-phone"></i>
                        </a>
                      </div>
                      <div className="contact-content">
                        <p className="contact-text">{dict.common.call_helpline}</p>
                        <h6 className="contact-title">
                          <a href="tel:+358401234567">+358 40 123 4567</a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
