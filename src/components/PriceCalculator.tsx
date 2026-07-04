'use client';

import React, { useState } from 'react';

interface PriceCalculatorProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

// Mirror of standard pricing logic for instantaneous client-side updates
const CLIENT_RATES: Record<string, { soft: number; medium: number; hard: number; min: number }> = {
  'home-cleaning': { soft: 2.2, medium: 3.2, hard: 4.8, min: 80.0 },
  'kitchen-cleaning': { soft: 4.5, medium: 6.5, hard: 9.0, min: 120.0 },
  'move-out-package': { soft: 3.5, medium: 5.0, hard: 7.0, min: 150.0 },
  'staircase-cleaning': { soft: 1.6, medium: 2.4, hard: 3.6, min: 100.0 },
  'commercial-cleaning': { soft: 1.8, medium: 2.6, hard: 4.0, min: 110.0 },
  'window-cleaning': { soft: 2.8, medium: 4.0, hard: 5.8, min: 70.0 },
};

export default function PriceCalculator({ locale, dict }: PriceCalculatorProps) {
  const [selectedService, setSelectedService] = useState<string>('home-cleaning');
  const [selectedLevel, setSelectedLevel] = useState<'soft' | 'medium' | 'hard'>('medium');
  const [areaSize, setAreaSize] = useState<number>(60);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Compute pricing values on the fly during render for instant feedback
  const rateData = CLIENT_RATES[selectedService];
  const rate = rateData ? rateData[selectedLevel] : 0;
  const rawTotal = rate * areaSize;
  const min = rateData ? rateData.min : 0;
  const isMinApplied = rawTotal < min;
  const basePrice = isMinApplied ? min : rawTotal;
  const vatAmount = basePrice * 0.255;
  const totalPrice = basePrice + vatAmount;

  const prices = {
    basePrice,
    vatAmount,
    totalPrice,
    isMinApplied,
  };

  const servicesList = [
    { slug: 'home-cleaning', title: dict.services.home_title, icon: '/assets/img/icon/service-icon-1-1.svg' },
    { slug: 'kitchen-cleaning', title: dict.services.kitchen_title, icon: '/assets/img/icon/service-icon-1-2.svg' },
    { slug: 'move-out-package', title: dict.services.moveout_title, icon: '/assets/img/icon/service-icon-1-3.svg' },
    { slug: 'staircase-cleaning', title: dict.services.staircase_title, icon: '/assets/img/icon/service-icon-1-4.svg' },
    { slug: 'commercial-cleaning', title: dict.services.office_title, icon: '/assets/img/icon/service-icon-1-4.svg' },
    { slug: 'window-cleaning', title: dict.services.window_title, icon: '/assets/img/icon/service-icon-1-1.svg' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService,
          level: selectedLevel,
          area: areaSize,
          email,
          phone,
          sendEmail,
          locale,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        // Clear contact inputs upon successful submit, but keep calculator settings
        setEmail('');
        setPhone('');
      } else {
        console.error('Error from server:', data.error);
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="price-calculator-wrapper">
      {status === 'success' && (
        <div className="alert alert-success p-4 mb-5 border-0 rounded-3 shadow-sm text-start" role="alert" style={{ borderLeft: '5px solid #198754' }}>
          <div className="d-flex align-items-start">
            <div className="me-3 fs-3 text-success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h4 className="alert-heading fw-bold mb-1">{dict.calculator.success_title}</h4>
              <p className="mb-0 text-muted" style={{ fontSize: '15px' }}>{dict.calculator.success_desc}</p>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-danger p-4 mb-5 border-0 rounded-3 shadow-sm text-start" role="alert" style={{ borderLeft: '5px solid #dc3545' }}>
          <div className="d-flex align-items-start">
            <div className="me-3 fs-3 text-danger">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div>
              <h4 className="alert-heading fw-bold mb-1">{locale === 'fi' ? 'Hups, tapahtui virhe!' : 'Oops, an error occurred!'}</h4>
              <p className="mb-0 text-muted" style={{ fontSize: '15px' }}>{dict.calculator.error_desc}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-4">
        {/* Left Side Settings Form */}
        <div className="col-lg-7">
          <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
            {/* Step 1: Select Service */}
            <div className="mb-5">
              <h4 className="fw-bold mb-3 d-flex align-items-center" style={{ fontSize: '18px', color: '#1a1a1a' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d084', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0 }}>1</span>
                {dict.calculator.select_service}
              </h4>
              <div className="row g-3">
                {servicesList.map((service) => {
                  const isSelected = selectedService === service.slug;
                  return (
                    <div key={service.slug} className="col-sm-6">
                      <div
                        onClick={() => setSelectedService(service.slug)}
                        className={`p-3 rounded-3 border text-center h-100 position-relative transition`}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(0, 208, 132, 0.04)' : '#fff',
                          borderColor: isSelected ? '#00d084' : '#eef2f5',
                          borderWidth: '2px',
                          boxShadow: isSelected ? '0 4px 15px rgba(0, 208, 132, 0.15)' : 'none',
                        }}
                      >
                        {isSelected && (
                          <span className="position-absolute" style={{ top: '10px', right: '10px', color: '#00d084', fontSize: '16px' }}>
                            <i className="fas fa-check-circle"></i>
                          </span>
                        )}
                        <div className="mb-2 bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                          <img src={service.icon} alt={service.title} style={{ width: '24px' }} />
                        </div>
                        <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '14px' }}>{service.title}</h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Clean Level */}
            <div className="mb-5">
              <h4 className="fw-bold mb-3 d-flex align-items-center" style={{ fontSize: '18px', color: '#1a1a1a' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d084', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0 }}>2</span>
                {dict.calculator.select_level}
              </h4>
              
              <div className="d-flex rounded-3 bg-light p-1 mb-3" style={{ border: '1px solid #eef2f5' }}>
                {(['soft', 'medium', 'hard'] as const).map((level) => {
                  const isSelected = selectedLevel === level;
                  let levelTitle = '';
                  if (level === 'soft') levelTitle = dict.calculator.soft_clean;
                  if (level === 'medium') levelTitle = dict.calculator.medium_clean;
                  if (level === 'hard') levelTitle = dict.calculator.hard_clean;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevel(level)}
                      className="btn flex-fill py-2 rounded-2 border-0 fw-bold transition"
                      style={{
                        fontSize: '13px',
                        backgroundColor: isSelected ? '#00d084' : 'transparent',
                        color: isSelected ? '#fff' : '#555',
                        boxShadow: isSelected ? '0 4px 10px rgba(0, 208, 132, 0.2)' : 'none',
                      }}
                    >
                      {levelTitle}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-light rounded-3 border-start border-4 border-success">
                <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                  {selectedLevel === 'soft' && dict.calculator.soft_desc}
                  {selectedLevel === 'medium' && dict.calculator.medium_desc}
                  {selectedLevel === 'hard' && dict.calculator.hard_desc}
                </p>
              </div>
            </div>

            {/* Step 3: Area size */}
            <div className="mb-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center" style={{ fontSize: '18px', color: '#1a1a1a' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d084', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0 }}>3</span>
                {dict.calculator.enter_area}
              </h4>

              <div className="row align-items-center g-3 mb-3">
                <div className="col-12 col-sm-8">
                  <input
                    type="range"
                    min="10"
                    max="500"
                    className="form-range"
                    value={areaSize}
                    onChange={(e) => setAreaSize(parseInt(e.target.value))}
                    style={{ accentColor: '#00d084' }}
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <div className="input-group">
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      className="form-control text-center fw-bold"
                      value={areaSize}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setAreaSize(isNaN(val) ? 10 : val);
                      }}
                      style={{ height: '45px', borderColor: '#eef2f5', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                    <span className="input-group-text bg-light text-muted fw-bold" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderColor: '#eef2f5' }}>m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Estimates & Proposal Submission */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Live Pricing Box */}
            <div
              className="p-4 p-md-5 rounded-4 text-white text-center shadow-lg position-relative overflow-hidden d-flex flex-column justify-content-center"
              style={{
                backgroundImage: 'linear-gradient(135deg, #0b2c24 0%, #154d3e 100%)',
                minHeight: '260px',
              }}
            >
              {/* Background abstract element */}
              <div
                className="position-absolute"
                style={{
                  width: '300px',
                  height: '300px',
                  backgroundColor: '#00d084',
                  borderRadius: '50%',
                  opacity: 0.1,
                  bottom: '-150px',
                  right: '-150px',
                }}
              ></div>

              <span className="text-uppercase fw-bold tracking-wider text-success mb-2" style={{ fontSize: '13px', color: '#00d084 !important' }}>
                {dict.calculator.estimated_price}
              </span>
              <h3 className="display-4 fw-extrabold mb-1" style={{ fontSize: '42px', color: '#00d084' }}>
                {prices.totalPrice.toFixed(2)} €
              </h3>
              <p className="mb-0 text-white-50 small">
                {dict.calculator.vat_included}
              </p>

              {prices.isMinApplied && (
                <div className="mt-3 mx-auto">
                  <span className="badge bg-warning text-dark px-3 py-2 fw-bold" style={{ fontSize: '11px' }}>
                    <i className="fas fa-info-circle me-1"></i>
                    {dict.calculator.minimum_applied}
                  </span>
                </div>
              )}
            </div>

            {/* Proposal Details Form */}
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm flex-fill d-flex flex-column">
              <h4 className="fw-bold mb-4 d-flex align-items-center" style={{ fontSize: '18px', color: '#1a1a1a' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d084', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0 }}>4</span>
                {dict.calculator.contact_info}
              </h4>

              <div className="form-group mb-3 text-start">
                <label htmlFor="email_input" className="form-label small fw-bold text-muted mb-1">{dict.calculator.email} *</label>
                <input
                  id="email_input"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  style={{ height: '50px', borderColor: '#eef2f5', borderRadius: '8px' }}
                />
              </div>

              <div className="form-group mb-4 text-start">
                <label htmlFor="phone_input" className="form-label small fw-bold text-muted mb-1">{dict.calculator.phone} *</label>
                <input
                  id="phone_input"
                  type="tel"
                  className="form-control"
                  placeholder="+358 40 123 4567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={status === 'loading'}
                  style={{ height: '50px', borderColor: '#eef2f5', borderRadius: '8px' }}
                />
              </div>

              <div className="form-check text-start mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sendProposalCheckbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  disabled={status === 'loading'}
                  style={{ accentColor: '#00d084' }}
                />
                <label className="form-check-label text-muted small" htmlFor="sendProposalCheckbox" style={{ cursor: 'pointer' }}>
                  {dict.calculator.send_proposal}
                </label>
              </div>

              <button
                type="submit"
                className="vs-btn2 w-100 mt-auto"
                disabled={status === 'loading' || !email || !phone}
                style={{
                  height: '55px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {status === 'loading' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {dict.contact.sending}
                  </>
                ) : (
                  <>
                    {dict.calculator.calculate_btn}
                    <i className="far fa-long-arrow-right ms-2"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
