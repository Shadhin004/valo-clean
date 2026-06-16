import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
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
          <h1 className="breadcumb-title text-white fw-bold mb-2">{dict.common.contact}</h1>
          <ul className="breadcumb-menu text-white list-inline mb-0">
            <li className="list-inline-item">
              <Link href={`/${locale}`} className="text-white-50">{dict.common.home}</Link>
            </li>
            <li className="list-inline-item text-white-50 mx-2">/</li>
            <li className="list-inline-item text-white">{dict.common.contact}</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="space py-5">
        <div className="container py-4">
          <div className="row g-5">
            {/* Contact Info Side */}
            <div className="col-lg-5">
              <div className="contact-info-wrap bg-light p-4 rounded border">
                <span className="sec-subtitle text-success">{dict.contact.subtitle}</span>
                <h2 className="fw-bold my-3">{locale === 'fi' ? 'Olemme Täällä Auttamassa' : locale === 'sv' ? 'Vi Är Här För Att Hjälpa' : 'We Are Here to Help'}</h2>
                <p className="text-muted mb-4">
                  {locale === 'fi'
                    ? 'Kysyttävää palveluistamme? Täytä yhteydenottolomake tai soita meille suoraan. Vastaamme kaikkiin tiedusteluihin mahdollisimman pian.'
                    : locale === 'sv'
                    ? 'Frågor om våra tjänster? Fyll i kontaktformuläret eller ring oss direkt. Vi svarar så snabbt vi kan.'
                    : 'Have questions about our services? Feel free to fill out the form or give us a call directly. We respond to all inquiries promptly.'}
                </p>

                {/* Info Cards */}
                <div className="d-flex flex-column gap-3">
                  {/* Address */}
                  <div className="d-flex align-items-start p-3 bg-white rounded border-start border-4 border-success">
                    <div className="bg-light p-2 rounded-circle me-3 text-success">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h5 className="h6 fw-bold mb-1">{dict.contact.address_title}</h5>
                      <p className="small text-muted mb-0">{dict.contact.address_text}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="d-flex align-items-start p-3 bg-white rounded border-start border-4 border-success">
                    <div className="bg-light p-2 rounded-circle me-3 text-success">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h5 className="h6 fw-bold mb-1">{dict.contact.phone_title}</h5>
                      <p className="small text-muted mb-0">
                        <a href="tel:+358401234567" className="text-dark">+358 40 123 4567</a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="d-flex align-items-start p-3 bg-white rounded border-start border-4 border-success">
                    <div className="bg-light p-2 rounded-circle me-3 text-success">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h5 className="h6 fw-bold mb-1">{dict.contact.email_title}</h5>
                      <p className="small text-muted mb-0">
                        <a href="mailto:info@valoclean.fi" className="text-dark">info@valoclean.fi</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Side */}
            <div className="col-lg-7">
              <div className="p-4 border rounded bg-white shadow-sm">
                <span className="sec-subtitle text-success">{dict.contact.subtitle}</span>
                <h3 className="fw-bold my-3">{dict.contact.title}</h3>
                <ContactForm dict={dict} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section py-4">
        <div className="container">
          <div className="rounded overflow-hidden border" style={{ height: '350px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.3855523824338!2d24.938379!3d60.16985599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bcd33924f2b%3A0xb36a3e6cb13554e2!2sMannerheimintie%2012%2C%2000100%20Helsinki!5e0!3m2!1sfi!2sfi!4v1700000000000!5m2!1sfi!2sfi"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
