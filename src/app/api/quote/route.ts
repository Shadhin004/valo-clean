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
};

// Fallback rates if .env is missing or invalid
const FALLBACK_RATES: Record<string, Record<string, number>> = {
  'HOME_CLEANING': { soft: 2.2, medium: 3.2, hard: 4.8, min: 80.0 },
  'KITCHEN_CLEANING': { soft: 4.5, medium: 6.5, hard: 9.0, min: 120.0 },
  'MOVE_OUT_PACKAGE': { soft: 3.5, medium: 5.0, hard: 7.0, min: 150.0 },
  'STAIRCASE_CLEANING': { soft: 1.6, medium: 2.4, hard: 3.6, min: 100.0 },
  'COMMERCIAL_CLEANING': { soft: 1.8, medium: 2.6, hard: 4.0, min: 110.0 },
  'WINDOW_CLEANING': { soft: 2.8, medium: 4.0, hard: 5.8, min: 70.0 },
};

// Display names for translations in email
const SERVICE_NAMES: Record<string, Record<string, string>> = {
  'home-cleaning': { fi: 'Kotisiivous', sv: 'Hemstädning', en: 'Home Cleaning' },
  'kitchen-cleaning': { fi: 'Keittiön Tehopuhdistus', sv: 'Köksrengöring', en: 'Kitchen Deep Clean' },
  'move-out-package': { fi: 'Muuttosiivous', sv: 'Flyttstädning', en: 'Move-out Package' },
  'staircase-cleaning': { fi: 'Porrassiivous', sv: 'Trappstädning', en: 'Staircase Cleaning' },
  'commercial-cleaning': { fi: 'Yrityssiivous', sv: 'Företagsstädning', en: 'Commercial Cleaning' },
  'window-cleaning': { fi: 'Ikkunanpesu', sv: 'Fönsterputsning', en: 'Window Cleaning' },
};

const CLEAN_LEVELS: Record<string, Record<string, string>> = {
  soft: { fi: 'Kevyt siivous', sv: 'Lätt städning', en: 'Soft Clean' },
  medium: { fi: 'Normaali siivous', sv: 'Normal städning', en: 'Medium Clean' },
  hard: { fi: 'Suursiivous', sv: 'Grovstädning', en: 'Hard Clean' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, level, area, email, phone, sendEmail, locale = 'fi' } = body;

    // Validate inputs
    if (!service || !level || !area || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      return NextResponse.json({ error: 'Invalid area size' }, { status: 400 });
    }

    // Resolve pricing
    const envPrefix = SERVICE_ENV_MAP[service];
    if (!envPrefix) {
      return NextResponse.json({ error: 'Invalid service selected' }, { status: 400 });
    }

    const rateKey = `PRICE_${envPrefix}_${level.toUpperCase()}`;
    const minKey = `MIN_PRICE_${envPrefix}`;

    const fallbacks = FALLBACK_RATES[envPrefix];
    const ratePerM2 = process.env[rateKey] ? parseFloat(process.env[rateKey]!) : fallbacks[level];
    const minPrice = process.env[minKey] ? parseFloat(process.env[minKey]!) : fallbacks.min;

    const rawTotal = ratePerM2 * areaNum;
    const isMinApplied = rawTotal < minPrice;
    const basePrice = isMinApplied ? minPrice : rawTotal;
    
    // Standard VAT in Finland: 25.5%
    const VAT_RATE = 0.255;
    const vatAmount = basePrice * VAT_RATE;
    const totalPrice = basePrice + vatAmount;

    // Prepare text representation
    const serviceName = SERVICE_NAMES[service]?.[locale] || SERVICE_NAMES[service]?.['en'];
    const cleanLevelName = CLEAN_LEVELS[level]?.[locale] || CLEAN_LEVELS[level]?.['en'];

    // Generate HTML Email Templates
    const emailHeaderColor = '#00d084';
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nordo Clean - Hinta-arvio / Prisförslag / Price Estimate</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
          .header { background-color: ${emailHeaderColor}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px 20px; }
          .price-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .price-table th, .price-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .price-table th { background-color: #f9f9f9; font-weight: bold; }
          .price-total { font-size: 20px; font-weight: bold; color: ${emailHeaderColor}; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; border-top: 1px solid #eee; margin-top: 20px; }
          .badge { display: inline-block; padding: 4px 8px; background-color: #f1f1f1; border-radius: 4px; font-size: 12px; color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nordo Clean</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">
              ${locale === 'fi' ? 'Hinta-arvio ja alustava tarjous' : locale === 'sv' ? 'Prisuppskattning och preliminärt förslag' : 'Price Estimate & Preliminary Proposal'}
            </p>
          </div>
          <div class="content">
            <p>Hei,</p>
            <p>
              ${locale === 'fi' 
                ? 'Kiitos mielenkiinnostasi Nordo Cleanin siivouspalveluita kohtaan! Alla on laskurin avulla tekemäsi hinta-arvio.' 
                : locale === 'sv' 
                ? 'Tack för ditt intresse för Nordo Cleans städtjänster! Nedan visas prisuppskattningen baserat på dina val.' 
                : 'Thank you for your interest in Nordo Clean cleaning services! Below is your estimated proposal based on the calculator.'}
            </p>

            <table class="price-table">
              <tr>
                <th>${locale === 'fi' ? 'Palvelu' : locale === 'sv' ? 'Tjänst' : 'Service'}</th>
                <td>${serviceName}</td>
              </tr>
              <tr>
                <th>${locale === 'fi' ? 'Siivoustaso' : locale === 'sv' ? 'Städnivå' : 'Cleaning Level'}</th>
                <td>${cleanLevelName}</td>
              </tr>
              <tr>
                <th>${locale === 'fi' ? 'Tilan Koko' : locale === 'sv' ? 'Yta' : 'Space Size'}</th>
                <td>${areaNum} m²</td>
              </tr>
              <tr>
                <th>${locale === 'fi' ? 'Perushinta (ALV 0%)' : locale === 'sv' ? 'Baspris (exkl. moms)' : 'Base Price (excl. VAT)'}</th>
                <td>${basePrice.toFixed(2)} € ${isMinApplied ? `<span class="badge">${locale === 'fi' ? 'Minimihinta' : locale === 'sv' ? 'Minimipris' : 'Min Price'}</span>` : ''}</td>
              </tr>
              <tr>
                <th>${locale === 'fi' ? 'ALV (25,5%)' : locale === 'sv' ? 'Moms (25,5%)' : 'VAT (25.5%)'}</th>
                <td>${vatAmount.toFixed(2)} €</td>
              </tr>
              <tr class="price-total">
                <th>${locale === 'fi' ? 'Arvioitu hinta yhteensä' : locale === 'sv' ? 'Uppskattat totalpris' : 'Estimated Total Price'}</th>
                <td>${totalPrice.toFixed(2)} €</td>
              </tr>
            </table>

            <p style="margin-top: 30px;">
              <strong>${locale === 'fi' ? 'Mitä seuraavaksi tapahtuu?' : locale === 'sv' ? 'Vad händer nu?' : 'What happens next?'}</strong>
            </p>
            <p>
              ${locale === 'fi'
                ? 'Otamme sinuun yhteyttä puhelimitse tai sähköpostitse 1-2 arkipäivän kuluessa sopiaksemme siivousajankohdan ja tarkentaaksemme tarjouksen vastaamaan täydellisesti tarpeitasi.'
                : locale === 'sv'
                ? 'Vi kontaktar dig via telefon eller e-post inom 1-2 arbetsdagar för att boka in städningen och bekräfta detaljerna i förslaget.'
                : 'We will contact you via phone or email within 1-2 business days to schedule the cleaning service and finalize the details of this proposal.'}
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
            <p>Nordo Clean Oy | Mannerheimintie 12, 00100 Helsinki</p>
            <p>Puh: +358 40 123 4567 | info@nordoclean.fi</p>
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
          h2 { color: #00d084; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Uusi tarjouspyyntö / hinta-arviolomake lähetetty</h2>
          <p>Laskurista on tehty uusi lähetys. Alla tiedot:</p>
          <table>
            <tr>
              <th>Palvelu (Service)</th>
              <td>${serviceName} (${service})</td>
            </tr>
            <tr>
              <th>Siivoustaso (Level)</th>
              <td>${cleanLevelName} (${level})</td>
            </tr>
            <tr>
              <th>Tilan Koko (Size)</th>
              <td>${areaNum} m²</td>
            </tr>
            <tr>
              <th>Sähköposti (Email)</th>
              <td><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <th>Puhelin (Phone)</th>
              <td><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <th>Perushinta (Excl. VAT)</th>
              <td>${basePrice.toFixed(2)} € ${isMinApplied ? '(Minimiveloitus otettu käyttöön)' : ''}</td>
            </tr>
            <tr>
              <th>MOMS / ALV (25.5%)</th>
              <td>${vatAmount.toFixed(2)} €</td>
            </tr>
            <tr>
              <th>Yhteensä (Total Incl. VAT)</th>
              <td><strong>${totalPrice.toFixed(2)} €</strong></td>
            </tr>
            <tr>
              <th>Lähetetty kopio asiakkaalle?</th>
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
      console.log(marketingEmailHtml.replace(/<[^>]*>/g, ' ').trim().slice(0, 1000));
      console.log('----------------------------');
      console.log('==================================================');

      return NextResponse.json({
        success: true,
        mockMode: true,
        basePrice,
        vatAmount,
        totalPrice,
        isMinApplied
      });
    }

    // Initialize real Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: smtpPort === '465', // true for 465, false for other ports
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
          ? 'Nordo Clean - Ditt Prisförslag och Uppskattning' 
          : 'Nordo Clean - Your Price Estimate & Proposal',
        html: clientEmailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      mockMode: false,
      basePrice,
      vatAmount,
      totalPrice,
      isMinApplied
    });

  } catch (error: any) {
    console.error('Error in calculator endpoint:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
