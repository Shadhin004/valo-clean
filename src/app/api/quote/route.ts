import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Map service slugs to environment variable prefixes
const SERVICE_ENV_MAP: Record<string, string> = {
  'home-cleaning': 'HOME_CLEANING',
  'kitchen-cleaning': 'KITCHEN_CLEANING',
  'move-out-package': 'MOVE_OUT_PACKAGE',
  'staircase-cleaning': 'STAIRCASE_CLEANING',
  'commercial-cleaning': 'COMMERCIAL_CLEANING',
  'window-cleaning': 'WINDOW_CLEANING',
  'office-cleaning': 'OFFICE_CLEANING',
};

// Fallback rates if .env is missing or invalid
const FALLBACK_RATES: Record<string, { soft: number; medium: number; hard: number; min: number }> = {
  'HOME_CLEANING': { soft: 1.0, medium: 1.3, hard: 1.8, min: 70.0 },
  'KITCHEN_CLEANING': { soft: 4.5, medium: 6.5, hard: 9.0, min: 120.0 },
  'MOVE_OUT_PACKAGE': { soft: 3.5, medium: 5.0, hard: 7.0, min: 150.0 },
  'STAIRCASE_CLEANING': { soft: 1.6, medium: 2.4, hard: 3.6, min: 100.0 },
  'COMMERCIAL_CLEANING': { soft: 1.8, medium: 2.6, hard: 4.0, min: 110.0 },
  'WINDOW_CLEANING': { soft: 2.8, medium: 4.0, hard: 5.8, min: 70.0 },
  'OFFICE_CLEANING': { soft: 1.8, medium: 2.6, hard: 4.0, min: 110.0 },
};

// Display names for translations in email
const SERVICE_NAMES: Record<string, Record<string, string>> = {
  'home-cleaning': { fi: 'Kotisiivous', sv: 'Hemstädning', en: 'Home Cleaning' },
  'kitchen-cleaning': { fi: 'Keittiön Tehopuhdistus', sv: 'Köksrengöring', en: 'Kitchen Deep Clean' },
  'move-out-package': { fi: 'Muuttosiivous', sv: 'Flyttstädning', en: 'Move-out Package' },
  'staircase-cleaning': { fi: 'Porrassiivous', sv: 'Trappstädning', en: 'Staircase Cleaning' },
  'commercial-cleaning': { fi: 'Yrityssiivous', sv: 'Företagsstädning', en: 'Commercial Cleaning' },
  'window-cleaning': { fi: 'Ikkunanpesu', sv: 'Fönsterputsning', en: 'Window Cleaning' },
  'office-cleaning': { fi: 'Toimistosiivous', sv: 'Kontorsstädning', en: 'Office Cleaning' },
};

const CLEAN_LEVELS: Record<string, Record<string, string>> = {
  soft: { fi: 'Kevyt siivous', sv: 'Lätt städning', en: 'Soft Clean' },
  medium: { fi: 'Normaali siivous', sv: 'Normal städning', en: 'Medium Clean' },
  hard: { fi: 'Suursiivous', sv: 'Grovstädning', en: 'Hard Clean' },
};

const PROPERTY_TYPES: Record<string, Record<string, string>> = {
  apartment: { fi: 'Kerrostalo', sv: 'Lägenhet', en: 'Apartment' },
  townhouse: { fi: 'Rivitalo', sv: 'Radhus', en: 'Townhouse' },
  house: { fi: 'Omakotitalo / Erillistalo', sv: 'Fristående villa / hus', en: 'Detached House' },
};

const CONDITION_NAMES: Record<string, Record<string, string>> = {
  normal: { fi: 'Normaali', sv: 'Normalt', en: 'Normal' },
  dirty: { fi: 'Likainen', sv: 'Smutsigt', en: 'Dirty' },
  very_dirty: { fi: 'Erittäin likainen', sv: 'Mycket smutsigt', en: 'Very Dirty' },
};

const getTravelCostForZip = (zip: string): number => {
  const trimmed = zip.trim();
  if (trimmed === '') return 0;
  if (!/^65/.test(trimmed)) {
    return 50.00; // Outside Vaasa/Mustasaari
  }
  
  // Group 0: Same/Adjacent (0 €)
  const group0 = ['65710', '65610', '65100'];
  // Group 1: Near Area (10 €)
  const group1 = ['65170', '65200', '65230', '65280', '65300', '65320', '65350', '65370', '65380', '65630', '65650', '65730'];
  // Group 2: Mid Area (20 €)
  const group2 = ['65410', '65450', '65460', '65470', '65480', '65760'];
  // Group 3: Far Area (35 €)
  const group3 = ['65800', '65830', '65840', '65850', '65860'];

  if (group0.includes(trimmed)) return 0;
  if (group1.includes(trimmed)) return 10.00;
  if (group2.includes(trimmed)) return 20.00;
  if (group3.includes(trimmed)) return 35.00;
  
  return 15.00; // Fallback standard fee for other 65xxx zip codes
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      service,
      level = 'medium',
      area,
      email,
      phone,
      sendEmail,
      locale = 'fi',
      propertyType = 'apartment',
      bathrooms = 1,
      floors = 1,
      windows = 0,
      windowGlassType = '2-glass',
      condition = 'normal',
      zipCode = '',
      addonWindows = false,
      addonBasement = false,
      addonBalcony = false,
    } = body;

    // Validate inputs
    if (!service || !level || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const areaNum = parseFloat(area) || 0;
    if (service !== 'window-cleaning' && (isNaN(areaNum) || areaNum <= 0)) {
      return NextResponse.json({ error: 'Invalid area size' }, { status: 400 });
    }

    const bathroomsNum = parseInt(bathrooms) || 1;
    const floorsNum = parseInt(floors) || 1;
    const windowsNum = parseInt(windows) || 0;

    // Resolve pricing keys
    const envPrefix = SERVICE_ENV_MAP[service];
    if (!envPrefix) {
      return NextResponse.json({ error: 'Invalid service selected' }, { status: 400 });
    }

    const rateKey = `PRICE_${envPrefix}_${level.toUpperCase()}`;
    const minKey = `MIN_PRICE_${envPrefix}`;

    const fallbacks = FALLBACK_RATES[envPrefix];
    const ratePerM2 = process.env[rateKey] ? parseFloat(process.env[rateKey]!) : fallbacks[level as 'soft' | 'medium' | 'hard'];
    const minPrice = process.env[minKey] ? parseFloat(process.env[minKey]!) : fallbacks.min;

    // Window Glass Type Rates
    const window2GlassRate = process.env.PRICE_WINDOW_2GLASS ? parseFloat(process.env.PRICE_WINDOW_2GLASS) : 6.00;
    const window3GlassRate = process.env.PRICE_WINDOW_3GLASS ? parseFloat(process.env.PRICE_WINDOW_3GLASS) : 9.00;
    const windowRate = windowGlassType === '3-glass' ? window3GlassRate : window2GlassRate;

    // 1. Base price based on area size or window count
    let rawBase = 0;
    if (service === 'window-cleaning') {
      rawBase = windowsNum * windowRate;
    } else {
      rawBase = ratePerM2 * areaNum;
    }
    const isMinApplied = rawBase < minPrice;
    const basePrice = isMinApplied ? minPrice : rawBase;

    // 2. Property Type Multiplier
    const typeKey = `MULTIPLIER_PROPERTY_${propertyType.toUpperCase()}`;
    const fallbackTypeMult = propertyType === 'townhouse' ? 1.10 : propertyType === 'house' ? 1.20 : 1.00;
    const typeMultiplier = service === 'window-cleaning' ? 1.00 : (process.env[typeKey] ? parseFloat(process.env[typeKey]!) : fallbackTypeMult);

    // 3. Condition Multiplier
    const condKey = `MULTIPLIER_CONDITION_${condition.toUpperCase()}`;
    const fallbackCondMult = condition === 'dirty' ? 1.25 : condition === 'very_dirty' ? 1.50 : 1.00;
    const conditionMultiplier = service === 'window-cleaning' ? 1.00 : (process.env[condKey] ? parseFloat(process.env[condKey]!) : fallbackCondMult);

    // 4. Floors Multiplier (+10% per floor above 1)
    const floorKey = 'MULTIPLIER_PER_FLOOR';
    const floorMultiplier = process.env[floorKey] ? parseFloat(process.env[floorKey]!) : 0.10;
    const floorFactor = service === 'window-cleaning' ? 1.00 : (1.0 + Math.max(0, floorsNum - 1) * floorMultiplier);

    // Apply multipliers to base price
    const subtotalBeforeAddons = basePrice * typeMultiplier * conditionMultiplier * floorFactor;

    // 5. Bathrooms flat fee (€35 per bathroom beyond the first one)
    const bathRateKey = 'PRICE_PER_BATHROOM';
    const bathroomRate = process.env[bathRateKey] ? parseFloat(process.env[bathRateKey]!) : 35.00;
    const bathroomsCost = service === 'window-cleaning' ? 0 : Math.max(0, bathroomsNum - 1) * bathroomRate;

    // 6. Add-on fees
    let addonsCost = 0;
    
    // Windows cleaning logic (if added to other services)
    if (['home-cleaning', 'move-out-package'].includes(service)) {
      addonsCost += windowsNum * windowRate;
    }

    // Basement add-on
    let basementCost = 0;
    if (addonBasement && service !== 'window-cleaning' && service !== 'staircase-cleaning') {
      const addonBaseKey = 'ADDON_BASEMENT_FLAT';
      const addonBaseFlat = process.env[addonBaseKey] ? parseFloat(process.env[addonBaseKey]!) : 60.00;
      basementCost = addonBaseFlat;
      addonsCost += basementCost;
    }

    // Balcony add-on
    let balconyCost = 0;
    if (addonBalcony && service !== 'staircase-cleaning') {
      const addonBalKey = 'ADDON_BALCONY_FLAT';
      const addonBalFlat = process.env[addonBalKey] ? parseFloat(process.env[addonBalKey]!) : 40.00;
      balconyCost = addonBalFlat;
      addonsCost += balconyCost;
    }

    // 7. Travel fee based on dynamic distance groups from Smedsby 65710
    const trimmedZip = zipCode.trim();
    const travelCost = getTravelCostForZip(trimmedZip);

    // Sum totals (excl. VAT)
    const totalExclVat = subtotalBeforeAddons + bathroomsCost + addonsCost + travelCost;

    // Standard VAT in Finland: 25.5%
    const VAT_RATE = 0.255;
    const vatAmount = totalExclVat * VAT_RATE;
    const totalPrice = totalExclVat + vatAmount;

    // Display labels for templates
    const serviceName = SERVICE_NAMES[service]?.[locale] || SERVICE_NAMES[service]?.['en'];
    const cleanLevelName = CLEAN_LEVELS[level]?.[locale] || CLEAN_LEVELS[level]?.['en'];
    const propertyTypeName = PROPERTY_TYPES[propertyType]?.[locale] || PROPERTY_TYPES[propertyType]?.['en'];
    const conditionName = CONDITION_NAMES[condition]?.[locale] || CONDITION_NAMES[condition]?.['en'];

    // Generate HTML Email Templates
    const emailHeaderColor = '#00d084';
    
    // Detailed breakdown table HTML
    const breakdownRowsHtml = `
      <tr>
        <th>${locale === 'fi' ? 'Palvelu' : locale === 'sv' ? 'Tjänst' : 'Service'}</th>
        <td>${serviceName}</td>
      </tr>
      ${service === 'window-cleaning' ? `
      <tr>
        <th>${locale === 'fi' ? 'Ikkunat' : locale === 'sv' ? 'Fönster' : 'Windows'}</th>
        <td>${windowsNum} ${locale === 'fi' ? 'kpl' : 'st'} (${windowGlassType === '3-glass' ? (locale === 'fi' ? '3-kertaiset' : locale === 'sv' ? '3-glas' : '3-glass') : (locale === 'fi' ? '2-kertaiset' : locale === 'sv' ? '2-glas' : '2-glass')}) (Perushinta: ${basePrice.toFixed(2)} € ${isMinApplied ? `[${locale === 'fi' ? 'Minimihinta' : locale === 'sv' ? 'Minimipris' : 'Min Price'}]` : ''})</td>
      </tr>
      ` : `
      <tr>
        <th>${locale === 'fi' ? 'Pinta-ala' : locale === 'sv' ? 'Storlek' : 'Area Size'}</th>
        <td>${areaNum} m² (Perushinta: ${basePrice.toFixed(2)} € ${isMinApplied ? `[${locale === 'fi' ? 'Minimihinta' : locale === 'sv' ? 'Minimipris' : 'Min Price'}]` : ''})</td>
      </tr>
      `}
      ${service !== 'window-cleaning' ? `
      <tr>
        <th>${locale === 'fi' ? 'Asunnon tyyppi' : locale === 'sv' ? 'Bostadstyp' : 'Property type'}</th>
        <td>${propertyTypeName} (${typeMultiplier.toFixed(2)}x)</td>
      </tr>
      <tr>
        <th>${locale === 'fi' ? 'Kunto' : locale === 'sv' ? 'Skick' : 'Condition'}</th>
        <td>${conditionName} (${conditionMultiplier.toFixed(2)}x)</td>
      </tr>
      <tr>
        <th>${locale === 'fi' ? 'Kerrokset' : locale === 'sv' ? 'Våningar' : 'Floors'}</th>
        <td>${floorsNum} ${locale === 'fi' ? 'kpl' : 'st'} (${floorFactor.toFixed(2)}x)</td>
      </tr>
      ` : ''}
      ${service !== 'window-cleaning' && bathroomsNum > 1 ? `
      <tr>
        <th>${locale === 'fi' ? 'Kylpyhuoneet' : locale === 'sv' ? 'Badrum' : 'Bathrooms'}</th>
        <td>${bathroomsNum} ${locale === 'fi' ? 'kpl' : 'st'} (Lisä: +${bathroomsCost.toFixed(2)} €)</td>
      </tr>` : ''}
      ${service !== 'window-cleaning' && windowsNum > 0 ? `
      <tr>
        <th>${locale === 'fi' ? 'Ikkunat' : locale === 'sv' ? 'Fönster' : 'Windows'}</th>
        <td>${windowsNum} ${locale === 'fi' ? 'kpl' : 'st'} (${windowGlassType === '3-glass' ? (locale === 'fi' ? '3-lasiset' : locale === 'sv' ? '3-glas' : '3-glass') : (locale === 'fi' ? '2-lasiset' : locale === 'sv' ? '2-glas' : '2-glass')}) (+${(windowsNum * windowRate).toFixed(2)} €)</td>
      </tr>` : ''}
      ${addonBasement && basementCost > 0 ? `
      <tr>
        <th>${locale === 'fi' ? 'Kellari / Varasto (Lisävalinta)' : locale === 'sv' ? 'Källare / Förråd (Tillägg)' : 'Basement / storage (add-on)'}</th>
        <td>${locale === 'fi' ? 'Kyllä' : locale === 'sv' ? 'Ja' : 'Yes'} (+${basementCost.toFixed(2)} €)</td>
      </tr>` : ''}
      ${addonBalcony && balconyCost > 0 ? `
      <tr>
        <th>${locale === 'fi' ? 'Parveke / Terassi (Lisävalinta)' : locale === 'sv' ? 'Balkong / Veranda (Tillägg)' : 'Balkong / Veranda (Tillägg)'}</th>
        <td>${locale === 'fi' ? 'Kyllä' : locale === 'sv' ? 'Ja' : 'Yes'} (+${balconyCost.toFixed(2)} €)</td>
      </tr>` : ''}
      ${travelCost > 0 ? `
      <tr>
        <th>${locale === 'fi' ? 'Matkakulu' : locale === 'sv' ? 'Resekostnad' : 'Travel fee'}</th>
        <td>Postinumero: ${trimmedZip} (+${travelCost.toFixed(2)} €)</td>
      </tr>` : `
      <tr>
        <th>${locale === 'fi' ? 'Postinumero' : locale === 'sv' ? 'Postnummer' : 'Postal code'}</th>
        <td>${trimmedZip || '-'}</td>
      </tr>`}
    `;

    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nordo Clean - Hinta-arvio ja Tarjouspyyntö</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
          .header { background-color: ${emailHeaderColor}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px 20px; }
          .price-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .price-table th, .price-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .price-table th { background-color: #f9f9f9; font-weight: bold; width: 45%; }
          .price-total { font-size: 20px; font-weight: bold; color: ${emailHeaderColor}; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; border-top: 1px solid #eee; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nordo Clean</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">
              ${locale === 'fi' ? 'Yksityiskohtainen Hinta-arvio' : locale === 'sv' ? 'Detaljerad Prisuppskattning' : 'Detailed Price Estimate'}
            </p>
          </div>
          <div class="content">
            <p>Hei,</p>
            <p>
              ${locale === 'fi' 
                ? 'Kiitos mielenkiinnostasi! Alla on laskurin avulla tekemäsi hinta-arvion yksityiskohtainen erittely.' 
                : locale === 'sv' 
                ? 'Tack för ditt intresse! Nedan visas specifikationen av din prisuppskattning.' 
                : 'Thank you for your interest! Below is the detailed breakdown of your calculated cleaning estimate.'}
            </p>

            <table class="price-table">
              ${breakdownRowsHtml}
              <tr>
                <td colspan="2" style="border-bottom: 2px solid #ddd; height: 10px; padding: 0;"></td>
              </tr>
              <tr>
                <th>${locale === 'fi' ? 'Perushinta yhteensä (ALV 0%)' : locale === 'sv' ? 'Total exkl. moms' : 'Subtotal (excl. VAT)'}</th>
                <td><strong>${totalExclVat.toFixed(2)} €</strong></td>
              </tr>
              <tr>
                <th>${locale === 'fi' ? 'ALV (25,5%)' : locale === 'sv' ? 'MOMS (25,5%)' : 'VAT (25.5%)'}</th>
                <td>${vatAmount.toFixed(2)} €</td>
              </tr>
              <tr class="price-total" style="background-color: rgba(0, 208, 132, 0.05);">
                <th>${locale === 'fi' ? 'Arvioitu hinta yhteensä' : locale === 'sv' ? 'Arimerat totalpris' : 'Estimated total price'}</th>
                <td>${totalPrice.toFixed(2)} €</td>
              </tr>
            </table>

            <p style="margin-top: 30px;">
              <strong>${locale === 'fi' ? 'Mitä seuraavaksi tapahtuu?' : locale === 'sv' ? 'Vad händer nu?' : 'What happens next?'}</strong>
            </p>
            <p>
              ${locale === 'fi'
                ? 'Asiakaspalvelumme ottaa sinuun yhteyttä puhelimitse tai sähköpostitse 1-2 arkipäivän kuluessa sopiaksemme siivousajankohdan ja tarkentaaksemme tarjouksen vastaamaan täydellisesti tarpeitasi.'
                : locale === 'sv'
                ? 'Vår kundtjänst kontaktar dig via telefon eller e-post inom 1-2 arbetsdagar för att boka in städningen och bekräfta alla detaljer.'
                : 'Our customer support will contact you via phone or email within 1-2 business days to schedule the cleaning and finalize the booking details.'}
            </p>

            <p style="margin-top: 20px; font-size: 13px; color: #666; font-style: italic;">
              * ${locale === 'fi' 
                  ? 'Tämä on automaattinen hinta-arvio. Lopullinen hinta vahvistetaan kartoituksen tai sopimuksen yhteydessä.' 
                  : locale === 'sv' 
                  ? 'Detta är en automatisk prisuppskattning. Det slutliga priset bekräftas i samband med avtal.' 
                  : 'This is an automated price estimate. The final price will be confirmed upon final booking agreement.'}
            </p>
          </div>
          <div class="footer">
            <p>Nordo Clean Oy | Mustasaari, Vaasa</p>
            <p>Puh: +358 40 521 8220 | info@nordoclean.fi</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const marketingEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Uusi Hinta-arviolaskurin Lähetys</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { padding: 20px; border: 1px solid #ccc; max-width: 600px; border-radius: 5px; }
          h2 { color: #00d084; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f5f5f5; width: 45%; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Uusi tarjouspyyntö / hinta-arvio lähetetty</h2>
          <p>Seuraava tarjouspyyntö on vastaanotettu laskurista:</p>
          <table>
            <tr>
              <th>Asiakkaan sähköposti</th>
              <td><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <th>Asiakkaan puhelin</th>
              <td><a href="tel:${phone}">${phone}</a></td>
            </tr>
            ${breakdownRowsHtml}
            <tr>
              <td colspan="2" style="border-bottom: 2px solid #ccc; height: 5px; padding: 0;"></td>
            </tr>
            <tr>
              <th>Perushinta (excl. VAT)</th>
              <td>${totalExclVat.toFixed(2)} €</td>
            </tr>
            <tr>
              <th>ALV (25.5%)</th>
              <td>${vatAmount.toFixed(2)} €</td>
            </tr>
            <tr>
              <th>Yhteensä (incl. VAT)</th>
              <td><strong>${totalPrice.toFixed(2)} €</strong></td>
            </tr>
            <tr>
              <th>Kopio lähetetty asiakkaalle?</th>
              <td>${sendEmail ? 'Kyllä (Yes)' : 'Ei (No)'}</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    // Determine if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || 'info@nordoclean.fi';
    const marketingEmail = process.env.MARKETING_EMAIL || 'marketing@nordoclean.fi';

    const isDummySmtp = 
      !smtpHost || 
      !smtpUser || 
      smtpUser.includes('your_smtp_username') || 
      smtpUser === 'your_username';

    if (isDummySmtp) {
      console.log('=== [MOCK SMTP MODE - EMAIL LOGGED TO CONSOLE] ===');
      console.log(`From: ${smtpFrom}`);
      console.log(`To (Marketing): ${marketingEmail}`);
      if (sendEmail) {
        console.log(`To (Client): ${email}`);
      }
      console.log('--- Marketing Email Body ---');
      console.log(marketingEmailHtml.replace(/<[^>]*>/g, ' ').trim().slice(0, 1500));
      console.log('==================================================');

      return NextResponse.json({
        success: true,
        mockMode: true,
        basePrice: totalExclVat,
        vatAmount,
        totalPrice,
        isMinApplied,
        travelCost,
        addonsCost
      });
    }

    // Initialize real Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send copy to marketing
    await transporter.sendMail({
      from: `"${serviceName} Proposal" <${smtpFrom}>`,
      to: marketingEmail,
      subject: `[PROPOSAL SUBMISSION] ${serviceName} - ${areaNum}m² - ${email}`,
      html: marketingEmailHtml,
    });

    // Send copy to client if option checked
    if (sendEmail) {
      await transporter.sendMail({
        from: `"Nordo Clean" <${smtpFrom}>`,
        to: email,
        subject: locale === 'fi' 
          ? 'Nordo Clean - Tarjouksesi ja Hinta-arvio' 
          : locale === 'sv' 
          ? 'Nordo Clean - Ditt Prisförslag' 
          : 'Nordo Clean - Your Price Estimate',
        html: clientEmailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      mockMode: false,
      basePrice: totalExclVat,
      vatAmount,
      totalPrice,
      isMinApplied,
      travelCost,
      addonsCost
    });

  } catch (error: any) {
    console.error('Error in calculator endpoint:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
