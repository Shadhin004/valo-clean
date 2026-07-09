'use client';

import React, { useState } from 'react';

interface PriceCalculatorProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

// Client-side rates & minimums configuration matching the .env defaults
const CLIENT_RATES: Record<string, { soft: number; medium: number; hard: number; min: number }> = {
  'home-cleaning': { soft: 2.2, medium: 3.2, hard: 4.8, min: 80.0 },
  'kitchen-cleaning': { soft: 4.5, medium: 6.5, hard: 9.0, min: 120.0 },
  'move-out-package': { soft: 3.5, medium: 5.0, hard: 7.0, min: 150.0 },
  'staircase-cleaning': { soft: 1.6, medium: 2.4, hard: 3.6, min: 100.0 },
  'commercial-cleaning': { soft: 1.8, medium: 2.6, hard: 4.0, min: 110.0 },
  'window-cleaning': { soft: 2.8, medium: 4.0, hard: 5.8, min: 70.0 },
};

// Coefficient fallbacks
const TYPE_MULTIPLIERS: Record<string, number> = {
  apartment: 1.00,
  townhouse: 1.10,
  house: 1.20,
};

const CONDITION_MULTIPLIERS: Record<string, number> = {
  normal: 1.00,
  dirty: 1.25,
  very_dirty: 1.50,
};

const BATHROOM_RATE = 35.00;
const FLOOR_MULTIPLIER = 0.10; // +10% per floor above 1
const WINDOW_RATE = 25.00;

const ADDON_BASEMENT_FLAT = 60.00;
const ADDON_BALCONY_FLAT = 40.00;
const TRAVEL_FEE_OUTER = 25.00;

export default function PriceCalculator({ locale, dict }: PriceCalculatorProps) {
  const [selectedService, setSelectedService] = useState<string>('move-out-package');
  const [selectedLevel, setSelectedLevel] = useState<'soft' | 'medium' | 'hard'>('medium');
  const [areaSize, setAreaSize] = useState<number>(60);
  
  // New Property details state
  const [propertyType, setPropertyType] = useState<string>('apartment');
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [floors, setFloors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(0);
  const [condition, setCondition] = useState<string>('normal');
  const [zipCode, setZipCode] = useState<string>('');

  // Add-ons state
  const [addonBasement, setAddonBasement] = useState<boolean>(false);
  const [addonBalcony, setAddonBalcony] = useState<boolean>(false);

  // Form contact & submission state
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Dynamic field visibility rules based on selected service
  const showPropertyType = ['home-cleaning', 'move-out-package', 'kitchen-cleaning'].includes(selectedService);
  const showBathrooms = ['home-cleaning', 'move-out-package', 'commercial-cleaning'].includes(selectedService);
  const showFloors = ['home-cleaning', 'move-out-package', 'staircase-cleaning', 'commercial-cleaning'].includes(selectedService);
  const showWindows = ['home-cleaning', 'move-out-package', 'window-cleaning'].includes(selectedService);
  const showAddons = ['home-cleaning', 'move-out-package', 'window-cleaning'].includes(selectedService);

  // Compute pricing values on the fly during render for instant feedback
  const rateData = CLIENT_RATES[selectedService];
  const rate = rateData ? rateData[selectedLevel] : 0;
  const rawBase = rate * areaSize;
  const minPrice = rateData ? rateData.min : 0;
  const isMinApplied = rawBase < minPrice;
  const basePrice = isMinApplied ? minPrice : rawBase;

  // Apply multipliers
  const typeMultiplier = showPropertyType ? (TYPE_MULTIPLIERS[propertyType] ?? 1.0) : 1.0;
  const conditionMultiplier = CONDITION_MULTIPLIERS[condition] ?? 1.0;
  
  const floorsNum = showFloors ? floors : 1;
  const floorFactor = 1.0 + Math.max(0, floorsNum - 1) * FLOOR_MULTIPLIER;

  const subtotalBeforeAddons = basePrice * typeMultiplier * conditionMultiplier * floorFactor;

  // Bathrooms flat cost
  const bathroomsNum = showBathrooms ? bathrooms : 1;
  const bathroomsCost = Math.max(0, bathroomsNum - 1) * BATHROOM_RATE;

  // Add-ons cost
  let addonsCost = 0;
  let hasActiveAddons = false;

  let computedWindowCost = 0;
  if (['home-cleaning', 'move-out-package', 'window-cleaning'].includes(selectedService)) {
    computedWindowCost = windows * WINDOW_RATE;
    addonsCost += computedWindowCost;
    if (windows > 0) {
      hasActiveAddons = true;
    }
  }

  let computedBasementCost = 0;
  if (addonBasement && showAddons && selectedService !== 'window-cleaning') {
    computedBasementCost = ADDON_BASEMENT_FLAT;
    addonsCost += computedBasementCost;
    hasActiveAddons = true;
  }

  let computedBalconyCost = 0;
  if (addonBalcony && showAddons) {
    computedBalconyCost = ADDON_BALCONY_FLAT;
    addonsCost += computedBalconyCost;
    hasActiveAddons = true;
  }

  // Travel cost
  let travelCost = 0;
  const trimmedZip = zipCode.trim();
  const isOuterRegion = trimmedZip !== '' && !/^(00|01|02)/.test(trimmedZip);
  if (isOuterRegion) {
    travelCost = TRAVEL_FEE_OUTER;
  }

  const totalExclVat = subtotalBeforeAddons + bathroomsCost + addonsCost + travelCost;
  const vatAmount = totalExclVat * 0.255; // 25.5% VAT in Finland
  const totalPrice = totalExclVat + vatAmount;

  const servicesList = [
    { slug: 'move-out-package', title: dict.services.moveout_title, icon: '/assets/img/icon/service-icon-1-3.svg' },
    { slug: 'home-cleaning', title: dict.services.home_title, icon: '/assets/img/icon/service-icon-1-1.svg' },
    { slug: 'kitchen-cleaning', title: dict.services.kitchen_title, icon: '/assets/img/icon/service-icon-1-2.svg' },
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
          propertyType,
          bathrooms: bathroomsNum,
          floors: floorsNum,
          windows: showWindows ? windows : 0,
          condition,
          zipCode,
          addonWindows: false,
          addonBasement: addonBasement && selectedService !== 'window-cleaning',
          addonBalcony,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setEmail('');
        setPhone('');
        setZipCode('');
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
                        onClick={() => {
                          setSelectedService(service.slug);
                          // Reset and adjust values when switching
                          if (service.slug === 'window-cleaning') {
                            setWindows(10);
                            setAddonBasement(false);
                          } else if (['home-cleaning', 'move-out-package'].includes(service.slug)) {
                            setWindows(0);
                          } else {
                            setWindows(0);
                            setAddonBasement(false);
                            setAddonBalcony(false);
                          }
                        }}
                        className="p-3 rounded-3 border text-center h-100 position-relative transition"
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

            {/* Step 2: Property Details */}
            <div className="mb-5">
              <h4 className="fw-bold mb-4 d-flex align-items-center" style={{ fontSize: '18px', color: '#1a1a1a' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d084', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0 }}>2</span>
                {dict.calculator.enter_details}
              </h4>

              {/* Property size (Always shown) */}
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold text-muted mb-2">
                  {locale === 'fi' ? 'Pinta-ala' : locale === 'sv' ? 'Storlek' : 'Area Size'} ({areaSize} m²)
                </label>
                <div className="row align-items-center g-3">
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

              <div className="row g-4">
                {/* Property type selection (apartment, townhouse, house) */}
                {showPropertyType && (
                  <div className="col-md-6 text-start">
                    <label htmlFor="property_type_select" className="form-label small fw-bold text-muted mb-1">{dict.calculator.property_type}</label>
                    <select
                      id="property_type_select"
                      className="form-select"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      style={{ height: '45px', borderColor: '#eef2f5', borderRadius: '8px' }}
                    >
                      <option value="apartment">{dict.calculator.apartment}</option>
                      <option value="townhouse">{dict.calculator.townhouse}</option>
                      <option value="house">{dict.calculator.house}</option>
                    </select>
                  </div>
                )}

                {/* Property condition (normal, dirty, very dirty) */}
                <div className="col-md-6 text-start">
                  <label htmlFor="property_condition_select" className="form-label small fw-bold text-muted mb-1">{dict.calculator.condition}</label>
                  <select
                    id="property_condition_select"
                    className="form-select"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    style={{ height: '45px', borderColor: '#eef2f5', borderRadius: '8px' }}
                  >
                    <option value="normal">{dict.calculator.condition_normal}</option>
                    <option value="dirty">{dict.calculator.condition_dirty}</option>
                    <option value="very_dirty">{dict.calculator.condition_very_dirty}</option>
                  </select>
                </div>

                {/* ZIP Code */}
                <div className="col-md-6 text-start">
                  <label htmlFor="zip_code_input" className="form-label small fw-bold text-muted mb-1">{dict.calculator.zip_code}</label>
                  <input
                    id="zip_code_input"
                    type="text"
                    maxLength={5}
                    className="form-control"
                    placeholder={dict.calculator.zip_placeholder}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    style={{ height: '45px', borderColor: '#eef2f5', borderRadius: '8px' }}
                  />
                </div>

                {/* Bathrooms counter */}
                {showBathrooms && (
                  <div className="col-md-6 text-start">
                    <label htmlFor="bathrooms_input" className="form-label small fw-bold text-muted mb-1">{dict.calculator.bathrooms} ({bathrooms})</label>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                        style={{ height: '45px', width: '45px', borderRadius: '8px' }}
                      >
                        -
                      </button>
                      <input
                        id="bathrooms_input"
                        type="number"
                        className="form-control text-center fw-bold"
                        readOnly
                        value={bathrooms}
                        style={{ height: '45px', borderColor: '#eef2f5', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setBathrooms(Math.min(10, bathrooms + 1))}
                        style={{ height: '45px', width: '45px', borderRadius: '8px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Floors counter */}
                {showFloors && (
                  <div className="col-md-6 text-start">
                    <label htmlFor="floors_input" className="form-label small fw-bold text-muted mb-1">{dict.calculator.floors} ({floors})</label>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setFloors(Math.max(1, floors - 1))}
                        style={{ height: '45px', width: '45px', borderRadius: '8px' }}
                      >
                        -
                      </button>
                      <input
                        id="floors_input"
                        type="number"
                        className="form-control text-center fw-bold"
                        readOnly
                        value={floors}
                        style={{ height: '45px', borderColor: '#eef2f5', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setFloors(Math.min(5, floors + 1))}
                        style={{ height: '45px', width: '45px', borderRadius: '8px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Windows counter */}
                {showWindows && (
                  <div className="col-md-6 text-start">
                    <label htmlFor="windows_input" className="form-label small fw-bold text-muted mb-1">{dict.calculator.windows} ({windows})</label>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          const minVal = selectedService === 'window-cleaning' ? 1 : 0;
                          setWindows(Math.max(minVal, windows - 1));
                        }}
                        style={{ height: '45px', width: '45px', borderRadius: '8px' }}
                      >
                        -
                      </button>
                      <input
                        id="windows_input"
                        type="number"
                        className="form-control text-center fw-bold"
                        readOnly
                        value={windows}
                        style={{ height: '45px', borderColor: '#eef2f5', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setWindows(Math.min(100, windows + 1))}
                        style={{ height: '45px', width: '45px', borderRadius: '8px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Add-on choices (Only shown if service is Home/Move-out or Balcony option on Window cleaning) */}
            {showAddons && (
              <div className="mb-4">
                <h4 className="fw-bold mb-4 d-flex align-items-center" style={{ fontSize: '18px', color: '#1a1a1a' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d084', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '12px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0 }}>3</span>
                  {dict.calculator.add_ons}
                </h4>

                <div className="row g-3">

                  {/* Basement Cleaning Add-on (Hidden for window cleaning) */}
                  {selectedService !== 'window-cleaning' && (
                    <div className="col-12 text-start">
                      <div
                        onClick={() => setAddonBasement(!addonBasement)}
                        className="p-3 rounded-3 border d-flex align-items-center justify-content-between transition"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: addonBasement ? 'rgba(0, 208, 132, 0.02)' : '#fff',
                          borderColor: addonBasement ? '#00d084' : '#eef2f5',
                          borderWidth: '2px',
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="checkbox"
                            checked={addonBasement}
                            readOnly
                            style={{ accentColor: '#00d084', transform: 'scale(1.2)' }}
                          />
                          <div>
                            <span className="fw-bold d-block text-dark" style={{ fontSize: '14px' }}>{dict.calculator.addon_basement}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Balcony Add-on */}
                  <div className="col-12 text-start">
                    <div
                      onClick={() => setAddonBalcony(!addonBalcony)}
                      className="p-3 rounded-3 border d-flex align-items-center justify-content-between transition"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: addonBalcony ? 'rgba(0, 208, 132, 0.02)' : '#fff',
                        borderColor: addonBalcony ? '#00d084' : '#eef2f5',
                        borderWidth: '2px',
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addonBalcony}
                          readOnly
                          style={{ accentColor: '#00d084', transform: 'scale(1.2)' }}
                        />
                        <div>
                          <span className="fw-bold d-block text-dark" style={{ fontSize: '14px' }}>{dict.calculator.addon_balcony}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Estimates & Proposal Submission */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Detailed Pricing & Breakdown Box */}
            <div
              className="p-4 p-md-5 rounded-4 text-white text-start shadow-lg position-relative overflow-hidden d-flex flex-column"
              style={{
                backgroundImage: 'linear-gradient(135deg, #0b2c24 0%, #154d3e 100%)',
                minHeight: '380px',
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
                  opacity: 0.08,
                  bottom: '-120px',
                  right: '-120px',
                }}
              ></div>

              <div className="text-center mb-4">
                <span className="text-uppercase fw-bold tracking-wider text-success d-block mb-1" style={{ fontSize: '13px', color: '#00d084 !important' }}>
                  {dict.calculator.estimated_price}
                </span>
                <h3 className="display-4 fw-extrabold mb-1" style={{ fontSize: '46px', color: '#00d084' }}>
                  {totalPrice.toFixed(2)} €
                </h3>
                <p className="mb-0 text-white-50 small">
                  {dict.calculator.vat_included}
                </p>
              </div>

              {/* Price Breakdown Details */}
              <div className="border-top border-white-10 pt-3 flex-fill z-index position-relative" style={{ fontSize: '13px' }}>
                <h5 className="h6 fw-bold mb-3 text-white-50 text-uppercase tracking-wide">
                  {locale === 'fi' ? 'Arvion erittely' : locale === 'sv' ? 'Kalkylspecifikation' : 'Estimate Specification'}
                </h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-white-50">{locale === 'fi' ? 'Pinta-alahinta' : locale === 'sv' ? 'Storlekspris' : 'Area Subtotal'}</span>
                  <span>{basePrice.toFixed(2)} €</span>
                </div>

                {showPropertyType && typeMultiplier !== 1.0 && (
                  <div className="d-flex justify-content-between mb-2 text-success" style={{ color: '#00d084 !important' }}>
                    <span>{locale === 'fi' ? 'Asuntotyyppikerroin' : locale === 'sv' ? 'Bostadstyp faktor' : 'Property Type Factor'} ({propertyType})</span>
                    <span>+{((typeMultiplier - 1.0) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {conditionMultiplier !== 1.0 && (
                  <div className="d-flex justify-content-between mb-2 text-success" style={{ color: '#00d084 !important' }}>
                    <span>{locale === 'fi' ? 'Kuntokerroin' : locale === 'sv' ? 'Skick faktor' : 'Condition Factor'} ({condition})</span>
                    <span>+{((conditionMultiplier - 1.0) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {showFloors && floorsNum > 1 && (
                  <div className="d-flex justify-content-between mb-2 text-success" style={{ color: '#00d084 !important' }}>
                    <span>{locale === 'fi' ? 'Kerroskerroin' : locale === 'sv' ? 'Våning faktor' : 'Floor Factor'} ({floorsNum} {locale === 'fi' ? 'krs' : locale === 'sv' ? 'vån' : 'floors'})</span>
                    <span>+{((floorFactor - 1.0) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {bathroomsCost > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">{locale === 'fi' ? 'Kylpyhuonelisä' : locale === 'sv' ? 'Badrumstillägg' : 'Additional Bathrooms'} ({bathroomsNum - 1})</span>
                    <span>+{bathroomsCost.toFixed(2)} €</span>
                  </div>
                )}

                {hasActiveAddons && addonsCost > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white-50">{dict.calculator.add_ons}</span>
                    <span>+{addonsCost.toFixed(2)} €</span>
                  </div>
                )}

                {travelCost > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-warning" style={{ color: '#ffb900' }}>
                    <span>{locale === 'fi' ? 'Matkakulu' : locale === 'sv' ? 'Resekostnad' : 'Travel Cost'}</span>
                    <span>+{travelCost.toFixed(2)} €</span>
                  </div>
                )}

                <div className="border-top border-white-10 my-3"></div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-white-50">{locale === 'fi' ? 'Hinta ALV 0%' : locale === 'sv' ? 'Exkl. moms' : 'Excl. VAT'}</span>
                  <span>{totalExclVat.toFixed(2)} €</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-white-50">
                  <span>{locale === 'fi' ? 'ALV 25,5%' : locale === 'sv' ? 'MOMS 25,5%' : 'VAT 25.5%'}</span>
                  <span>{vatAmount.toFixed(2)} €</span>
                </div>
              </div>

              {isMinApplied && (
                <div className="mt-3 text-center">
                  <span className="badge bg-warning text-dark px-3 py-2 fw-bold" style={{ fontSize: '11px' }}>
                    <i className="fas fa-info-circle me-1"></i>
                    {dict.calculator.minimum_applied}
                  </span>
                </div>
              )}

              {travelCost > 0 && (
                <div className="mt-2 text-center">
                  <span className="badge bg-info text-white px-3 py-2 fw-bold" style={{ fontSize: '11px', backgroundColor: '#0ea5e9' }}>
                    <i className="fas fa-truck-moving me-1"></i>
                    {dict.calculator.travel_fee_applied}
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
