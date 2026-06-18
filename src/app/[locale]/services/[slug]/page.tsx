import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);
  
  const serviceTitles: Record<string, string> = {
    'home-cleaning': dict.services.home_title,
    'kitchen-cleaning': dict.services.kitchen_title,
    'move-out-package': dict.services.moveout_title,
    'staircase-cleaning': dict.services.staircase_title,
    'commercial-cleaning': dict.services.office_title,
    'window-cleaning': dict.services.window_title,
  };
  
  const serviceTitle = serviceTitles[slug] || 'Siivouspalvelu';
  const title = `${serviceTitle} | Valo-Clean`;
  const description = locale === 'fi'
    ? `Lue lisää palvelustamme: ${serviceTitle}. Ammattitaitoista ja huolellista siivousjälkeä kiinteistöllesi.`
    : locale === 'sv'
    ? `Läs mer om städtjänsten: ${serviceTitle}. Professionell och noggrann städning för dina lokaler.`
    : `Learn more about our service: ${serviceTitle}. Professional and thorough cleaning for your premises.`;
  
  return { title, description };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);

  // Define services data internally for simple translation lookup
  const servicesData: Record<string, {
    title: string;
    desc1: string;
    desc2: string;
    benefitsTitle: string;
    benefitsDesc: string;
    benefitsList: string[];
    img1: string;
    img2: string;
    img3: string;
  }> = {
    'home-cleaning': {
      title: dict.services.home_title,
      desc1: locale === 'fi' 
        ? 'Siivoamme kodistasi puhtaan ja raikkaan lattiasta kattoon. Siivousohjelmamme mukautetaan täysin sinun elämäntilanteesi ja toiveidesi mukaan.' 
        : locale === 'sv' 
        ? 'Vi gör ditt hem rent och fräscht från golv till tak. Vårt städschema är helt anpassat efter dina önskemål och din livsstil.' 
        : 'We make your home clean and fresh from floor to ceiling. Our cleaning schedules are fully customized according to your life and wishes.',
      desc2: locale === 'fi'
        ? 'Tavanomainen ylläpitosiivous sisältää lattioiden imuroinnin ja pyyhinnän, pölyjen pyyhkimisen kaikilta vapailta pinnoilta, peilien kiillotuksen sekä wc- ja suihkutilojen perusteellisen pesun.'
        : locale === 'sv'
        ? 'Vanlig underhållsstädning inkluderar dammsugning och moppning av golv, dammtorkning av alla fria ytor, putsning av speglar och en noggrann rengöring av toalett och dusch.'
        : 'Standard maintenance cleaning includes vacuuming and mopping floors, dusting all free surfaces, polishing mirrors, and thorough washing of toilet and shower areas.',
      benefitsTitle: locale === 'fi' ? 'Mitä hyötyä palvelusta on?' : locale === 'sv' ? 'Vad är fördelarna?' : 'What are the benefits?',
      benefitsDesc: locale === 'fi'
        ? 'Ammattilaisen tekemä säännöllinen kotisiivous säästää aikaasi ja takaa terveellisen elinympäristön koko perheelle.'
        : locale === 'sv'
        ? 'Regelbunden hemstädning utförd av ett proffs sparar din tid och garanterar en hälsosam livsmiljö för hela familjen.'
        : 'Regular home cleaning done by a professional saves your time and guarantees a healthy living environment for the whole family.',
      benefitsList: locale === 'fi' 
        ? ['Lisää vapaa-aikaa arkeen', 'Parempi sisäilman laatu', 'Puhdas ja edustava koti aina', 'Luotettava ja vakuutettu siivooja'] 
        : locale === 'sv'
        ? ['Mer fritid i vardagen', 'Bättre kvalitet på inomhusluften', 'Ett rent och representativt hem', 'Pålitlig och försäkrad städare']
        : ['More free time in everyday life', 'Better indoor air quality', 'A clean and presentable home always', 'Trusted and insured cleaner'],
      img1: '/assets/img/service/home-cleaning.jpg',
      img2: '/assets/img/service/kitchen-cleaning.jpg',
      img3: '/assets/img/service/move-out-cleaning.jpg',
    },
    'kitchen-cleaning': {
      title: dict.services.kitchen_title,
      desc1: locale === 'fi'
        ? 'Keittiö on kodin sydän ja vaatii erityistä hygieniaa. Keittiön tehopuhdistus poistaa rasvan ja pinttyneen lian uunista, liesituulettimesta ja työtasoilta.'
        : locale === 'sv'
        ? 'Köket är hemmas hjärta och kräver extra god hygien. Vår köksrengöring tar bort fett och ingrodd smuts från ugn, fläkt och arbetsbänkar.'
        : 'The kitchen is the heart of the home and demands extra hygiene. Deep kitchen cleaning removes grease and stubborn dirt from ovens, range hoods, and countertops.',
      desc2: locale === 'fi'
        ? 'Käytämme turvallisia, elintarvikepinnoille sopivia puhdistusaineita, jotka tehokkaasti poistavat bakteerit ja saavat rosteripinnat ja kaapinovet jälleen loistamaan.'
        : locale === 'sv'
        ? 'Vi använder säkra rengöringsmedel som är lämpliga för livsmedelsytor, som effektivt tar bort bakterier och får rostfria ytor samt skåpluckor att glänsa igen.'
        : 'We use safe cleaning products suitable for food-contact surfaces, which effectively eliminate bacteria and make stainless steel and cabinet doors shine again.',
      benefitsTitle: locale === 'fi' ? 'Puhdas ja turvallinen keittiö' : locale === 'sv' ? 'Ett rent och säkert kök' : 'Clean & Safe Kitchen',
      benefitsDesc: locale === 'fi'
        ? 'Puhdas keittiö parantaa ruokaturvallisuutta ja pidentää keittiökoneiden käyttöikää poistamalla pinttyneen rasvan.'
        : locale === 'sv'
        ? 'Ett rent kök förbättrar livsmedelssäkerheten och förlänger köksmaskinernas livslängd genom att ta bort ingrott fett.'
        : 'A clean kitchen improves food safety and extends the lifespan of kitchen appliances by eliminating accumulated grease.',
      benefitsList: locale === 'fi'
        ? ['Rasvaton liesituuletin ja uuni', 'Desinfioidut työtasot ja tiskialtaat', 'Parempi paloturvallisuus', 'Raikas tuoksu keittiössä']
        : locale === 'sv'
        ? ['Fettfri spisfläkt och ugn', 'Desinficerade arbetsbänkar och diskhoar', 'Bättre brandsäkerhet', 'En fräsch doft i köket']
        : ['Grease-free extractor hood and oven', 'Sanitized worktops and sinks', 'Better fire safety', 'Fresh smell in the kitchen'],
      img1: '/assets/img/service/kitchen-cleaning.jpg',
      img2: '/assets/img/service/home-cleaning.jpg',
      img3: '/assets/img/service/window-cleaning.jpg',
    },
    'move-out-package': {
      title: dict.services.moveout_title,
      desc1: locale === 'fi'
        ? 'Muuttaminen on stressaavaa ja uuvuttavaa. Anna meidän huolehtia vanhan asuntosi perusteellisesta loppusiivouksesta, jotta voit keskittyä uuteen kotiisi.'
        : locale === 'sv'
        ? 'Att flytta är stressigt och utmattande. Låt oss ta hand om en noggrann slutstädning av din gamla bostad så att du kan fokusera på ditt nya hem.'
        : 'Moving is stressful and exhausting. Let us take care of a thorough final cleaning of your old residence so you can focus on your new home.',
      desc2: locale === 'fi'
        ? 'Muuttosiivouspalvelumme takaa, että asunto siivotaan tarkasti vuokranantajien ja uusien asukkaiden korkeiden vaatimusten mukaisesti, sisältäen uunin ja liesien rasvanpoiston, kaappien sisäpinnat, lattiapesun sekä ikkunoiden puhdistuksen sopimuksen mukaan.'
        : locale === 'sv'
        ? 'Vår flyttstädningstjänst garanterar att bostaden städas noggrant enligt hyresvärdars och nya boendes höga krav, inklusive ugnsrengöring, avtorkning inuti skåp, golvtvätt och fönsterputs enligt överenskommelse.'
        : 'Our move-out cleaning service guarantees that the residence is cleaned meticulously according to the high standards of landlords and new tenants, including oven cleaning, wiping inside cabinets, floor washing, and window cleaning by agreement.',
      benefitsTitle: locale === 'fi' ? 'Miksi valita muuttosiivous?' : locale === 'sv' ? 'Varför välja flyttstädning?' : 'Why choose move-out cleaning?',
      benefitsDesc: locale === 'fi'
        ? 'Ammattimainen siivous säästää voimiasi ja varmistaa virheettömän siirron ja huolettoman muuton.'
        : locale === 'sv'
        ? 'Professionell städning sparar din energi och säkerställer en smidig övergång och ett perfekt städresultat.'
        : 'Professional cleaning saves your energy and guarantees a pristine finish and a smooth handover to the next occupants.',
      benefitsList: locale === 'fi'
        ? ['Täysi puhtaustakuu asunnolle', 'Säästää arvokasta aikaasi', 'Kattaa liesien ja uunin puhdistuksen', 'Pölytön ja raikas asunto uudelle asukkaalle']
        : locale === 'sv'
        ? ['Full renhetsgaranti för bostaden', 'Sparar din värdefulla tid', 'Inkluderar ugns- och spisrengöring', 'Dammfri och fräsch bostad för nästa boende']
        : ['Full cleanliness guarantee', 'Saves your valuable time', 'Includes oven and stove cleaning', 'Dust-free and fresh space for next tenant'],
      img1: '/assets/img/service/move-out-cleaning.jpg',
      img2: '/assets/img/service/kitchen-cleaning.jpg',
      img3: '/assets/img/service/commercial-cleaning.jpg',
    },
    'staircase-cleaning': {
      title: dict.services.staircase_title,
      desc1: locale === 'fi'
        ? 'Olemme erikoistuneet ammattimaiseen porrassiivoukseen asuinrakennuksissa, taloyhtiöissä ja liikekiinteistöissä. Puhdas porraskäytävä on turvallisuustekijä ja luo viihtyisän ensivaikutelman asukkaille ja vierailijoille.'
        : locale === 'sv'
        ? 'Vi är specialiserade på professionell trappstädning för bostadsrättsföreningar, hyreshus och kommersiella fastigheter. En ren trappuppgång är avgörande för säkerheten och ger ett välkomnande första intryck.'
        : 'We specialize in professional staircase and stairwell cleaning for residential buildings, housing cooperatives, and commercial properties. A clean staircase is crucial for safety and creates a welcoming first impression for residents and visitors.',
      desc2: locale === 'fi'
        ? 'Tiimimme käyttää korkealaatuisia, ympäristöystävällisiä pesuaineita ja nykyaikaisia välineitä kaikentyyppisten portaiden syväpuhdistukseen, mukaan lukien betoni-, kivi-, puu- ja laattapinnat. Kiinnitämme erityistä huomiota myös kaiteisiin, käsijohteisiin, lasipintoihin ja ulko-oviin.'
        : locale === 'sv'
        ? 'Vårt team använder högkvalitativa, miljövänliga rengöringsmedel och modern utrustning för att rengöra alla typer av trappor – betong, sten, trä och kakel. Vi lägger extra fokus på ledstänger, räcken, glasytor och entrédörrar.'
        : 'Our team uses high-quality, eco-friendly detergents and advanced equipment to deep clean all types of stairs, including concrete, stone, wood, and tiled surfaces. We also pay special attention to handrails, banisters, glass partitions, and entrance doors.',
      benefitsTitle: locale === 'fi' ? 'Ammattimainen Porraskäytävien Ylläpito' : locale === 'sv' ? 'Professionell Trapphusvård' : 'Professional Stairwell Care',
      benefitsDesc: locale === 'fi'
        ? 'Säännöllinen ja huolellinen porrassiivous ehkäisee liukastumistapaturmia, pidentää lattiamateriaalien käyttöikää ja parantaa sisäilman laatua koko kiinteistössä.'
        : locale === 'sv'
        ? 'En välskött trappuppgång minskar halkrisken, förlänger golvets livslängd och förhindrar spridning av smuts och allergener till lägenheterna.'
        : 'A well-maintained staircase reduces slip hazards, extends the lifespan of the flooring, and prevents the buildup of dust and allergens.',
      benefitsList: locale === 'fi'
        ? ['Puhtaat ja kiiltävät porraspinnat', 'Desinfioidut kaiteet ja kosketuspinnat', 'Hiekan, suolan ja talvilian poisto', 'Säännöllinen ylläpito tai kertasiivous']
        : locale === 'sv'
        ? ['Rena och välvårdade trappsteg', 'Desinficerade ledstänger och kontaktytor', 'Effektiv borttagning av grus, salt och smuts', 'Flexibla städscheman efter behov']
        : ['Clean and polished stair surfaces', 'Sanitized handrails and main entry touchpoints', 'Removal of sand, salt, and winter grit', 'Regular or one-time cleaning schedules'],
      img1: '/assets/img/service/staircase-cleaning.jpg',
      img2: '/assets/img/service/move-out-cleaning.jpg',
      img3: '/assets/img/service/home-cleaning.jpg',
    },
    'commercial-cleaning': {
      title: dict.services.office_title,
      desc1: locale === 'fi'
        ? 'Tarjoamme monipuoliset yrityssiivouspalvelut myymälöihin, toimistoihin ja taloyhtiöihin. Puhdas työpaikka parantaa viihtyvyyttä ja vähentää sairauspoissaoloja.'
        : locale === 'sv'
        ? 'Vi erbjuder mångsidiga företagsstädningstjänster för butiker, kontor och bostadsrättsföreningar. En ren arbetsplats ökar trivseln och minskar sjukfrånvaron.'
        : 'We provide comprehensive commercial cleaning services for stores, offices, and residential associations. A clean workspace boosts morale and reduces sick leave.',
      desc2: locale === 'fi'
        ? 'Räätälöimme sopimussiivouksen aikataulut siten, että siivous tapahtuu yrityksenne aukioloaikojen ulkopuolella, häiritsemättä päivittäistä toimintaanne.'
        : locale === 'sv'
        ? 'Vi skräddarsyr schemat för kontraktsstädningen så att städningen sker utanför era öppettider, utan att störa er dagliga verksamhet.'
        : 'We customize contract cleaning schedules so that cleaning takes place outside your business hours, without disrupting your daily operations.',
      benefitsTitle: locale === 'fi' ? 'Edustavat toimitilat' : locale === 'sv' ? 'Representativa lokaler' : 'Professional Workspaces',
      benefitsDesc: locale === 'fi'
        ? 'Siisti toimisto antaa luotettavan kuvan asiakkaillenne ja takaa terveellisen työympäristön työntekijöillenne.'
        : locale === 'sv'
        ? 'Ett städat kontor ger ett pålitligt intryck till era kunder och garanterar en hälsosam arbetsmiljö för era anställda.'
        : 'A tidy office creates a trustworthy impression for your clients and guarantees a healthy working environment for your employees.',
      benefitsList: locale === 'fi'
        ? ['Terveellinen työyhteisö', 'Joustava siivousaikataulu', 'Sopimussiivous tarpeen mukaan', 'Modernit välineet ja aineet']
        : locale === 'sv'
        ? ['Hälsosam arbetsmiljö', 'Flexibelt städschema', 'Kontraktsstädning efter behov', 'Moderna redskap och medel']
        : ['Healthy workforce environment', 'Flexible cleaning hours', 'Contract cleaning tailored for you', 'Modern equipment and supplies'],
      img1: '/assets/img/service/commercial-cleaning.jpg',
      img2: '/assets/img/service/window-cleaning.jpg',
      img3: '/assets/img/service/kitchen-cleaning.jpg',
    },
    'window-cleaning': {
      title: dict.services.window_title,
      desc1: locale === 'fi'
        ? 'Ikkunanpesu tuo kotiin ja konttoriin valoa ja avaruutta. Pesemme ikkunat, karmit ja välit ammattitaidolla ja turvallisesti korkeissakin paikoissa.'
        : locale === 'sv'
        ? 'Fönsterputsning ger hemmet och kontoret ljus och rymd. Vi tvättar fönster, karmar och ytor professionellt och säkert, även på höga höjder.'
        : 'Window cleaning brings light and spaciousness into your home or office. We wash window panes, frames, and sills professionally and safely, even in high places.',
      desc2: locale === 'fi'
        ? 'Pesemme ikkunat raidattomasti käyttäen laadukkaita välineitä ja vettä hylkiviä aineita, jotka pitävät lasit puhtaina pidempään.'
        : locale === 'sv'
        ? 'Vi putsar fönster utan ränder med hjälp av högkvalitativa redskap och vattenavvisande medel som håller glasen rena längre.'
        : 'We wash windows streak-free using quality tools and water-repellent solutions that keep glass clean for longer.',
      benefitsTitle: locale === 'fi' ? 'Kirkkaat ja puhtaat näkymät' : locale === 'sv' ? 'Klara och rena vyer' : 'Crystal Clear Views',
      benefitsDesc: locale === 'fi'
        ? 'Kirkkaat ikkunat päästävät luonnonvalon sisään ja saavat koko kiinteistön näyttämään huolitellulta.'
        : locale === 'sv'
        ? 'Klara fönster släpper in dagsljuset och får hela fastigheten att se välvårdad ut.'
        : 'Clear windows let natural light flood in and make the entire property look well-maintained.',
      benefitsList: locale === 'fi'
        ? ['Raidaton ja kirkas lopputulos', 'Karmit ja sälekaihtimet puhtaaksi', 'Ammattilaisten turvavälineet', 'Nopea ja edullinen palvelu']
        : locale === 'sv'
        ? ['Strimmelfritt och klart resultat', 'Rena karmar och persienner', 'Professionell säkerhetsutrustning', 'Snabb och prisvärd tjänst']
        : ['Streak-free bright finish', 'Clean frames and blinds included', 'Professional safety equipment', 'Fast and cost-efficient service'],
      img1: '/assets/img/service/window-cleaning.jpg',
      img2: '/assets/img/service/commercial-cleaning.jpg',
      img3: '/assets/img/service/move-out-cleaning.jpg',
    },
  };

  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  // Sidebar list of services with links
  const sidebarServices = [
    { slug: 'home-cleaning', title: dict.services.home_title },
    { slug: 'kitchen-cleaning', title: dict.services.kitchen_title },
    { slug: 'move-out-package', title: dict.services.moveout_title },
    { slug: 'staircase-cleaning', title: dict.services.staircase_title },
    { slug: 'commercial-cleaning', title: dict.services.office_title },
    { slug: 'window-cleaning', title: dict.services.window_title },
  ];

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
          <h1 className="breadcumb-title text-white fw-bold mb-2">
            {service.title}
          </h1>
          <ul className="breadcumb-menu text-white list-inline mb-0">
            <li className="list-inline-item">
              <Link href={`/${locale}`} className="text-white-50">{dict.common.home}</Link>
            </li>
            <li className="list-inline-item text-white-50 mx-2">/</li>
            <li className="list-inline-item">
              <Link href={`/${locale}/services`} className="text-white-50">{dict.common.services}</Link>
            </li>
            <li className="list-inline-item text-white-50 mx-2">/</li>
            <li className="list-inline-item text-white">{service.title}</li>
          </ul>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <section className="portfolio-Details space position-relative py-5">
        <div className="container">
          <div className="portfolio-content pt-0">
            <div className="row gx-60 g-5">
              
              {/* Sidebar Left Column */}
              <div className="col-lg-4">
                {/* List Widget */}
                <div className="widget widget_categories style2 border p-4 rounded mb-4 bg-light">
                  <h3 className="widget_title h5 fw-bold mb-3 border-bottom pb-2">
                    {locale === 'fi' ? 'Kaikki Palvelut' : locale === 'sv' ? 'Alla Tjänster' : 'All Services'}
                  </h3>
                  <div className="widget_content">
                    <ul className="list-unstyled mb-0">
                      {sidebarServices.map((sidebarItem) => {
                        const isCurrent = sidebarItem.slug === slug;
                        return (
                          <li key={sidebarItem.slug} className="mb-2">
                            <Link
                              href={`/${locale}/services/${sidebarItem.slug}`}
                              className={`d-flex align-items-center p-2 rounded transition ${
                                isCurrent 
                                  ? 'bg-success text-white fw-bold' 
                                  : 'text-dark hover-bg-light border-bottom'
                              }`}
                              style={{ textDecoration: 'none' }}
                            >
                              <i className={`fa-solid fa-angles-right me-2 small ${isCurrent ? 'text-white' : 'text-success'}`}></i>
                              {sidebarItem.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Call Out Widget */}
                <div
                  className="contact-box2 p-4 text-center rounded text-white relative overflow-hidden"
                  style={{
                    backgroundImage: "url('/assets/img/bg/client-bg1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '260px'
                  }}
                >
                  <div className="position-relative z-index">
                    <h4 className="fw-bold mb-3">
                      {locale === 'fi' ? 'Ota Yhteyttä Jo Tänään' : locale === 'sv' ? 'Kontakta oss idag' : 'Let\'s Contact With Us'}
                    </h4>
                    <span className="icon-btn bg-success p-3 rounded-circle d-inline-flex mb-3" style={{ width: '60px', height: '60px', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/assets/img/icon/call-icon.svg" alt="call" style={{ width: '28px', filter: 'brightness(0) invert(1)' }} />
                    </span>
                    <div className="contact-content">
                      <p className="small text-white-50 mb-1">
                        {locale === 'fi' ? 'Tarvitsetko apua? Soita asiantuntijalle' : locale === 'sv' ? 'Behöver du hjälp? Ring en expert' : 'Need help? Talk to our expert'}
                      </p>
                      <h5 className="fw-bold">
                        <a href="tel:+358401234567" className="text-white" style={{ textDecoration: 'none' }}>+358 40 123 4567</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Right Column */}
              <div className="col-lg-8">
                {/* Large Main Image */}
                <div className="portfolio-img mb-4 rounded overflow-hidden shadow-sm" style={{ maxHeight: '420px', overflow: 'hidden' }}>
                  <img src={service.img1} alt={service.title} className="w-100 img-fluid" style={{ objectFit: 'cover' }} />
                </div>
                
                {/* Title and Descriptions */}
                <h2 className="portfolio-title h3 mb-3 fw-bold">{service.title}</h2>
                <p className="portfolio-text text-muted mb-4 fs-6" style={{ lineHeight: '1.7' }}>
                  {service.desc1}
                </p>
                <p className="portfolio-text text-muted mb-4 fs-6" style={{ lineHeight: '1.7' }}>
                  {service.desc2}
                </p>

                {/* Benefits Block */}
                <h3 className="portfolio-title h4 mb-3 fw-bold">{service.benefitsTitle}</h3>
                <p className="portfolio-text text-muted mb-4">
                  {service.benefitsDesc}
                </p>

                {/* Checklist Grid */}
                <div className="list-box1 row mb-4 g-3">
                  {service.benefitsList.map((benefit, idx) => (
                    <div key={idx} className="col-md-6 d-flex align-items-center">
                      <i className="fas fa-arrow-circle-right text-success me-2 fs-5"></i>
                      <span className="fw-medium text-dark">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Grid of Sub-Images */}
                <div className="row g-4 pt-2">
                  <div className="col-sm-6">
                    <div className="rounded overflow-hidden shadow-sm" style={{ height: '220px' }}>
                      <img src={service.img2} alt="Detail image 1" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="rounded overflow-hidden shadow-sm" style={{ height: '220px' }}>
                      <img src={service.img3} alt="Detail image 2" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>

                {/* Summary Closing Paragraph */}
                <p className="portfolio-text text-muted mt-4 mb-0" style={{ lineHeight: '1.7' }}>
                  {locale === 'fi'
                    ? 'Kaikki siivouspalvelumme toteutetaan koulutettujen, luotettavien ja vastuuvakuutettujen siivoojien toimesta. Käytämme ensisijaisesti allergiaystävällisiä, ympäristömerkittyjä puhdistusaineita turvaamaan sekä tilojenne puhtauden että ympäristön hyvinvoinnin.'
                    : locale === 'sv'
                    ? 'Alla våra städtjänster utförs av utbildade, pålitliga och ansvarsförsäkrade städare. Vi använder i första hand allergivänliga och miljömärkta rengöringsmedel för att skydda både dina lokaler och miljön.'
                    : 'All our cleaning services are delivered by trained, reliable, and liability-insured cleaners. We prioritize allergy-friendly, eco-labeled cleaning agents to safeguard both your premises and the environment.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
