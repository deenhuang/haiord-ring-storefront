import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Check, X, Plus, Minus, Menu, Play, Moon, Heart, Activity, Sparkles, Feather, BatteryCharging, Compass, Bell, ShieldCheck, Ruler, CircleCheck, Droplets, LockKeyhole } from 'lucide-react';
import { translate, content } from './i18n.mjs';
import { prices, formatPrice, validateReservation } from './reservation.mjs';
const file = name => `${import.meta.env.BASE_URL}assets/${name}`;
const asset = name => file(`${name}.webp`);
const countries = ['Saudi Arabia', 'United Arab Emirates', 'China', 'United States', 'United Kingdom', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Other'];
const finishes = [{
  name: 'Champagne Gold',
  color: '#c6ad72',
  image: 'gold-ring'
}, {
  name: 'Silver',
  color: '#bac0c0',
  image: 'silver-ring'
}, {
  name: 'Gunmetal',
  color: '#404441',
  image: 'gunmetal-ring'
}, {
  name: 'Rose Gold',
  color: '#d5aa94',
  image: 'rose-ring'
}];
const benefits = [[Feather, 'Lightweight design', 'Just 2.6 g in size 7. Made to feel barely there.'], [Moon, 'Sleep tracking', 'Understand your nights, from sleep duration to estimated sleep stages.'], [Heart, 'Health monitoring', 'Follow heart rate, blood oxygen and your personal trends.'], [Sparkles, 'AI health insights', 'Turn daily metrics into clearer, more personal wellness insights.'], [Activity, 'Activity tracking', 'Keep up with your movement, steps and everyday activity.'], [BatteryCharging, 'Portable charging', 'A compact charging case that travels with you.']];
const faqs = [['How does the reservation work?', 'A $30 deposit secures the $199 early bird price, compared with the $349 retail price. Deposit credit, refund rules and payment terms will be confirmed before paid reservations open. This website preview does not accept payments.'], ['How do I choose my ring size?', 'Choose “Send me a sizing kit” if you are unsure. Wear the sample through the day and overnight before confirming your size. If you already know your size in this product range, select it when reserving. Final sizing-kit availability and delivery details will be announced at launch.'], ['Is a subscription required?', 'The proposed HAIORD plan includes core health tracking without a mandatory subscription. An optional HAIORD+ service for additional AI insights may be offered later. Its features and availability are still being finalized.'], ['Does Qibla guidance work on the ring?', 'The HAIORD mobile app provides Qibla compass guidance and prayer reminders. On-ring direction guidance or haptic reminders are not confirmed for this hardware. Location and compass permissions are required for the app compass.'], ['Can I wear it while swimming?', 'The product brochure lists a 5 ATM water-resistance rating. Final care instructions and water-resistance testing will be confirmed for production units. A water-resistance rating does not mean the ring is suitable for every water sport or diving.'], ['When will my ring ship?', 'A shipping date, supported countries, shipping charges and local taxes have not yet been confirmed. You will receive the final details before placing a paid order.'], ['Is HAIORD Ring a medical device?', 'HAIORD Ring is intended for general wellness reference, not medical diagnosis, treatment or injury prevention. Sleep stages and wellness insights are estimates and should be considered alongside how you feel.']];
function Modal({
  children,
  title,
  close,
  wide = false,
  language = 'en'
}) {
  const t = key => translate(language, key);
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current.focus();
    const keydown = e => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const items = ref.current.querySelectorAll('button, input, select, a, [tabindex="0"]');
      const first = items[0],
        last = items[items.length - 1];
      if (!ref.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', keydown);
      previous?.focus();
    };
  }, []);
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`modal ${wide ? 'wide' : ''}`}><button className="icon-button close" onClick={close} aria-label={t("Close dialog")} title={t("Close")}><X size={22} /></button>{children}</section></div>;
}
export function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('noor-language') === 'zh' ? 'zh' : 'en');
  const t = key => translate(language, key);
  const currency = language === 'zh' ? 'CNY' : 'USD';
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('noor-language', language);
    document.title = language === 'zh' ? 'HAIORD Ring | 智能健康戒指' : 'HAIORD Ring | Your smart health companion';
  }, [language]);
  const [finish, setFinish] = useState(0),
    [gallery, setGallery] = useState(0),
    [size, setSize] = useState('kit'),
    [quantity, setQuantity] = useState(1);
  const [menu, setMenu] = useState(false),
    [modal, setModal] = useState(null),
    [error, setError] = useState(''),
    [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState(''),
    [country, setCountry] = useState(''),
    [accepted, setAccepted] = useState(false);
  const quote = prices[currency],
    money = n => formatPrice(currency, n);
  const galleryImages = [finishes[finish].image, 'collection', 'ring-detail', 'charging-case'];
  const reserve = () => {
    setConfirmed(false);
    setError('');
    setModal('reserve');
  };
  const submit = e => {
    e.preventDefault();
    const v = validateReservation({
      email,
      country,
      accepted
    }, language);
    if (v) {
      setError(v);
      return;
    }
    setError('');
    setConfirmed(true);
  };
  return <>
    <div className="announcement">{t("A little ring. A deeper connection.") + " "}<a href="#reservation">{t("Explore early access") + " "}<ArrowUpRight size={13} /></a></div>
    <header className="header"><a href="#" className="wordmark" aria-label={t("HAIORD Ring home")}>HAIORD<span>元序</span></a><nav className={menu ? 'open' : ''} aria-label={t("Main navigation")}>{[[t("The ring"), '#overview'], [t("Features"), '#features'], [t("Early access"), '#reservation'], [t("FAQ"), '#faq']].map(([l, h]) => <a key={h} href={h} onClick={() => setMenu(false)}>{t(l)}</a>)}</nav><div className="header-actions"><select value={language} onChange={e => setLanguage(e.target.value)} aria-label={t("Language")}><option value="en">English</option><option value="zh">中文</option></select><button className="button small header-reserve" onClick={reserve}>{t("Reserve now") + " "}<ArrowUpRight size={15} /></button><button className="icon-button menu" aria-label={t("Toggle navigation")} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></header>
    <main>
      <section className="purchase container" id="overview"><div className="product-gallery"><div className={`main-image gallery-${gallery}`}><div className="gallery-caption"><span>{t("MEET YOUR EVERYDAY COMPANION")}</span><span>01 / HAIORD</span></div><img src={asset(galleryImages[gallery])} alt={[t('HAIORD Ring in ') + t(finishes[finish].name), t("HAIORD Ring collection in four finishes"), t("HAIORD Ring optical sensors"), t("HAIORD portable charging case")][gallery]} fetchPriority="high" /><button className="gallery-arrow prev icon-button" aria-label={t("Previous product image")} onClick={() => setGallery((gallery + 3) % 4)}><ChevronLeft size={19} /></button><button className="gallery-arrow next icon-button" aria-label={t("Next product image")} onClick={() => setGallery((gallery + 1) % 4)}><ChevronRight size={19} /></button><div className="gallery-bottom"><span>{t("Light on your finger.")}<br />{t("In tune with your life.")}</span><span className="gallery-number">0{gallery + 1}<small> / 04</small></span></div></div><div className="thumbnails">{galleryImages.map((im, i) => <button key={i} className={gallery === i ? 'selected' : ''} onClick={() => setGallery(i)} aria-label={t([t("View ring"), t("View collection"), t("View sensors"), t("View charging case")][i])} aria-pressed={gallery === i}><img src={asset(im)} alt="" /></button>)}<button className="video-thumb" onClick={() => setModal(content[language].productVideo)} aria-label={t("Play product film")}><Play size={19} /><span>{t("Product film")}</span></button></div></div>
      <div className="purchase-info"><div className="eyebrow"><span className="status-dot" />{" " + t("COMING SOON · PRE-ORDER NOW")}</div><h1>HAIORD Ring</h1><p className="subtitle">{t("Your smart health companion.")}</p><p className="product-copy">{t("Know your sleep. Understand your energy.")}<br />{t("A little more insight, without more screen time.")}</p><div className="mini-benefits"><span><Moon size={17} />{t("Sleep")}</span><span><Heart size={17} />{t("Health")}</span><span><Sparkles size={17} />{t("AI insights")}</span></div><div className="offer"><div><span className="label">{t("RESERVATION DEPOSIT")}</span><strong>{money(quote.deposit)}</strong></div><span className="offer-badge">{t("Early bird access")}</span></div><div className="launch-line"><span>{t("Early bird price with a $30 deposit") + " "}<b>{money(quote.launch)}</b></span><s>{money(quote.retail)}</s></div><div className="selection-row"><span>{t("Finish")}</span><strong>{t(finishes[finish].name)}</strong></div><div className="swatches">{finishes.map((f, i) => <button title={t(f.name)} aria-label={t(f.name)} aria-pressed={finish === i} key={f.name} className={finish === i ? 'active' : ''} onClick={() => {
              setFinish(i);
              setGallery(0);
            }}><span style={{
                background: f.color
              }} /></button>)}</div><div className="size-label"><label htmlFor="size">{t("Ring size")}</label><button className="text-button" onClick={() => setModal('sizing')}><Ruler size={14} />{" " + t("Size guide")}</button></div><select className="size-select" id="size" value={size} onChange={e => setSize(e.target.value)}><option value="kit">{t("Send me a sizing kit")}</option>{[6, 7, 8, 9, 10, 11, 12, 13].map(n => <option key={n} value={n}>{t("Size") + " "}{n}</option>)}</select><div className="reserve-row"><div className="stepper"><button aria-label={t("Decrease quantity")} disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}><Minus size={15} /></button><span aria-live="polite">{quantity}</span><button aria-label={t("Increase quantity")} disabled={quantity === 6} onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="button" onClick={reserve}>{t("Reserve your HAIORD") + " "}<ArrowRight size={18} /></button></div><p className="purchase-note"><LockKeyhole size={13} />{" " + t("Preview only. No payment is collected.")}</p></div></section>
      <div className="spec-strip"><div className="container"><span><Feather /> <b>2.6 g</b>{" " + t("lightweight*")}</span><span><Ruler /> <b>2.3 mm</b>{" " + t("slim profile")}</span><span><Droplets /> <b>5 ATM</b>{" " + t("water resistance*")}</span><span><BatteryCharging />{" " + t("Charging case")}</span></div></div>
      <section className="intro container" id="features"><span className="eyebrow">{t("LESS ON YOUR HAND. MORE ABOUT YOU.")}</span><h2>{t("Small by design.")}<br />{t("Meaningful by nature.")}</h2><p>{t("Beautifully simple on the outside.")}<br />{t("Thoughtfully connected to your everyday wellbeing.")}</p></section>
      <section className="brand-story container" aria-labelledby="brand-story-title"><div><span className="eyebrow">{t("Sense Life. Understand the World.")}</span><h2 id="brand-story-title">{t("Hello, a World That Knows You.")}</h2></div><p>{t("Inspired by Hello World, HAIORD begins by sensing life and grows toward understanding the world. From health and movement to future intelligent assistance, we imagine a more connected and intuitive way to live.")}</p></section>
      <section className="story container"><div className="story-heading"><div><span className="section-index">{t("01 / REST")}</span><h3>{t("Better days")}<br />{t("begin at night.")}</h3></div><p>{t("Discover your sleep patterns and what helps you feel rested. Wake up with a clearer picture of your night.")}</p></div><div className="sleep-media"><img src={asset('sleep')} alt={t("A woman resting with a HAIORD Ring on her finger")} loading="lazy" /><div className="sleep-overlay"><Moon size={25} /><span>{t("YOUR NIGHT, UNDERSTOOD")}</span><strong>{t("Sleep. Recover. Repeat.")}</strong></div></div><div className="feature-note"><span>{t("Sleep duration")}</span><span>{t("Estimated sleep stages")}</span><span>{t("Sleep efficiency")}</span><span>{t("Night-time heart rate")}</span></div></section>
      <section className="movement-band"><div className="container"><div className="story-heading"><div><span className="section-index">{t("02 / MOVE")}</span><h3>{t("For the life")}<br />{t("you actually live.")}</h3></div><p>{t("From a morning walk to an afternoon ride, make your daily movement part of the bigger picture.")}</p></div><div className="movement-images">{[['running', t("A runner wearing a gunmetal HAIORD Ring"), t("Every little step counts.")], ['cycling', t("A cyclist wearing a silver HAIORD Ring"), t("Keep your rhythm.")], ['swimming', t("A swimmer wearing a HAIORD Ring"), t("Made to move with you.")]].map(([im, alt, title]) => <figure key={im}><img src={asset(im)} alt={t(alt)} loading="lazy" /><figcaption>{t(title)}<ArrowUpRight /></figcaption></figure>)}</div></div></section>
      <section className="app-section container"><div><span className="section-index">{t("03 / UNDERSTAND")}</span><h3>{t("Your body has a story.")}<br />{t("Make sense of it.")}</h3><p>{t("HAIORD brings sleep, health and activity together in the app. AI health insights help turn your daily data into a more personal perspective.")}</p><div className="app-details"><span><Heart size={17} />{" " + t("Personal health trends")}</span><span><Sparkles size={17} />{" " + t("AI health insights")}</span><span><Activity size={17} />{" " + t("Daily activity overview")}</span></div></div><img src={asset('app')} alt={t("HAIORD app health overview beside a gold HAIORD Ring")} loading="lazy" /></section>
      <section className="details-band"><div className="container"><div className="section-top"><span className="eyebrow">{t("QUIETLY CAPABLE")}</span><h2>{t("Wellness, in the details.")}</h2></div><div className="benefit-grid">{benefits.map(([Icon, title, p]) => <article className="benefit" key={title}><Icon size={26} /><h4>{t(title)}</h4><p>{t(p)}</p></article>)}</div><div className="prayer-features"><article><Compass size={28} /><div><span className="planned">{t("APP FEATURE")}</span><h4>{t("Qibla compass")}</h4><p>{t("Find your direction with location-based guidance in the HAIORD app.")}</p></div></article><article><Bell size={28} /><div><span className="planned">{t("APP FEATURE")}</span><h4>{t("Prayer reminders")}</h4><p>{t("Keep meaningful moments in your day with adjustable app reminders.")}</p></div></article></div><p className="footnote">{t("* Product brochure specifications. Weight is for size 7; final production specifications and care instructions are subject to confirmation. Health data is for general wellness reference.")}</p></div></section>
      <section className="films container"><div className="section-top"><span className="eyebrow">{t("SEE IT UP CLOSE")}</span><h2>{t("A small ring.")}<br />{t("A thoughtful experience.")}</h2></div><div className="film-grid"><button onClick={() => setModal(content[language].productVideo)} className="film"><img src={file(`${content[language].productVideo}-poster.jpg`)} alt={t("Black HAIORD Ring product film")} loading="lazy" /><span className="play-circle"><Play fill="currentColor" size={20} /></span><span className="film-label">{t("Designed to feel like less")}<ArrowUpRight size={18} /></span></button></div></section>
      <section className="reservation-band" id="reservation"><div className="container"><div className="reservation-heading"><div><span className="eyebrow">{t("BE PART OF THE BEGINNING")}</span><h2>{t("Your HAIORD.")}<br />{t("Your early access.")}</h2></div><div className="launch-price"><span>{t("EARLY BIRD PRICE")}</span><strong>{money(quote.launch)}</strong><small>{t("Retail price") + " "}<s>{money(quote.retail)}</s></small><button className="button" onClick={reserve}>{t("Reserve with") + " "}{money(quote.deposit)} <ArrowRight size={18} /></button></div></div><div className="steps">{[['01', t("Reserve your place"), t("Choose your preferred finish and reserve with a $30 deposit to unlock the $199 early bird price.")], ['02', t("Find your perfect fit"), t("Confirm your ring size before your final order. Sizing kit details to follow.")], ['03', t("Get ready for launch"), t("Receive delivery details and your final order invitation at launch.")]].map(([n, title, p]) => <article key={n}><span>{n}</span><div><h4>{t(title)}</h4><p>{t(p)}</p></div></article>)}</div><div className="pricing-table"><div className="table-head"><span>{t("HAIORD RING PRICING")}</span><span>{t("Price")}</span><span>{t("Offer")}</span></div>{[[t("Early bird"), quote.launch, t("With a $30 reservation deposit")], [t("Retail"), quote.retail, t("Standard retail price")]].map(([n, p, a]) => <div key={n} className={n === t("Early bird") ? 'highlight' : ''}><strong>{t(n)}</strong><span>{p === null ? 'To be confirmed' : money(p)}</span><span>{t(a)}</span></div>)}</div><p className="reservation-disclaimer">{t("Prices are in USD. Deposit credit and refund terms, delivery dates, taxes and shipping charges will be confirmed before paid orders open.")}</p></div></section>
      <section className="collection-section container"><div className="collection-title"><span className="eyebrow">{t("A COLOR FOR EVERY LOOK")}</span><h2>{t("Find your everyday finish.")}</h2><p>{t("Champagne Gold \xB7 Silver \xB7 Gunmetal \xB7 Rose Gold")}</p></div><img src={asset('collection')} alt={t("Four HAIORD Ring finishes on a sunlit surface")} loading="lazy" /></section>
      <section className="faq-section container" id="faq"><div><span className="eyebrow">{t("A LITTLE MORE CLARITY")}</span><h2>{t("Good questions.")}<br />{t("Clear answers.")}</h2></div><div className="faq-list">{faqs.map(([q, a], i) => <details key={q}><summary><span className="faq-number">0{i + 1}</span>{t(q)}<Plus size={17} /></summary><p>{t(a)}</p></details>)}</div></section>
      <section className="closing"><div className="container"><div className="wordmark">HAIORD<span>元序</span></div><h2>{t("A little closer to yourself.")}</h2><button className="button" onClick={reserve}>{t("Meet your HAIORD") + " "}<ArrowUpRight size={18} /></button></div></section>
    </main>
    <footer className="container"><div><span>© {new Date().getFullYear()} HAIORD Ring.</span><span>{t("A product by Paishan Technology.")}</span></div><div><button onClick={() => setModal('privacy')}>{t("Privacy")}</button><button onClick={() => setModal('terms')}>{t("Presale terms")}</button><a href="tel:+8657188866337">{t("Contact")}</a></div></footer><div className="mobile-reserve"><div><strong>HAIORD Ring</strong><span>{money(quote.deposit)}{" " + t("deposit")}</span></div><button className="button small" onClick={reserve}>{t("Reserve") + " "}<ArrowUpRight size={16} /></button></div>
    {modal === 'reserve' && <Modal language={language} title={t("Reserve your HAIORD Ring")} close={() => setModal(null)}>{confirmed ? <div className="success"><CircleCheck size={48} /><span className="eyebrow">{t("PREVIEW COMPLETE")}</span><h2>{t("Your HAIORD starts here.")}</h2><p>{t("Your selection is ready. This is a demonstration: no reservation was sent and no payment was made.")}</p><div className="order-summary"><span>{t(finishes[finish].name)}</span><span>{size === 'kit' ? t("Sizing kit requested") : `${t('Size')} ${size}`}{" " + t("\xB7 Qty") + " "}{quantity}</span><strong>{money(quote.deposit * quantity)}{" " + t("reservation deposit")}</strong></div><button className="button" onClick={() => setModal(null)}>{t("Back to the ring") + " "}<ArrowRight size={16} /></button></div> : <><span className="eyebrow">{t("EARLY ACCESS")}</span><h2>{t("Make it your HAIORD.")}</h2><p className="modal-copy">{t("Confirm your preferences for the launch.")}</p><div className="reservation-summary"><img src={asset(finishes[finish].image)} alt={t(finishes[finish].name)} /><div><strong>HAIORD Ring</strong><span>{t(finishes[finish].name)}</span><span>{size === 'kit' ? t("Sizing kit requested") : `${t('Size')} ${size}`}{" " + t("\xB7 Qty") + " "}{quantity}</span></div><strong>{money(quote.deposit * quantity)}</strong></div><form onSubmit={submit} noValidate><label>{t("Email address")}<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>{t("Country / region")}<select value={country} required onChange={e => setCountry(e.target.value)}><option value="">{t("Select a country")}</option>{countries.map(c => <option key={c} value={c}>{t(c)}</option>)}</select></label><label className="checkbox-label"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} /><span>{t("I understand this is a preview. No payment or reservation will be submitted, and launch terms are subject to confirmation.")}</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" type="submit">{t("Preview my reservation") + " "}<ArrowRight size={17} /></button></form></>}</Modal>}
    {modal === 'sizing' && <Modal language={language} title={t("HAIORD sizing guide")} close={() => setModal(null)}><Ruler className="gold" size={32} /><h2>{t("A comfortable fit,")}<br />{t("day and night.")}</h2><p className="modal-copy">{t("Smart ring sizing can differ from traditional jewelry. A product-specific sizing kit is the best place to start.")}</p><ol className="sizing-steps"><li>{t("Try the sample on the finger you plan to use.")}</li><li>{t("Look for a snug fit that can be removed comfortably.")}</li><li>{t("Wear it for 24 hours, including overnight, to check normal size changes.")}</li><li>{t("Confirm your size before placing the final order.")}</li></ol><button className="button" onClick={() => {
        setSize('kit');
        setModal(null);
      }}>{t("Select a sizing kit") + " "}<Check size={17} /></button><p className="footnote">{t("Sizing kit availability and cost will be confirmed at launch.")}</p></Modal>}
    {(modal === 'video1' || modal === 'video2') && <Modal language={language} title={t("HAIORD Ring product film")} close={() => setModal(null)} wide><video controls autoPlay playsInline src={file(`${modal}.mp4`)} /></Modal>}
    {(modal === 'privacy' || modal === 'terms') && <Modal language={language} title={modal === 'privacy' ? t("Privacy") : t("Presale terms")} close={() => setModal(null)}><ShieldCheck className="gold" size={30} /><h2>{modal === 'privacy' ? t("Your privacy.") : t("Before we launch.")}</h2><p className="modal-copy">{modal === 'privacy' ? t("This frontend preview does not transmit or store your email, country or reservation details. Your language preference is saved only in your browser. A full privacy policy will be provided before the live store collects personal data.") : t("Retail price: $349. Early bird price: $199 with a $30 deposit. No payment processor is connected. Deposit credit and refund rules, shipping dates, warranties, local taxes and final specifications will be confirmed before a paid presale begins.")}</p><button className="button" onClick={() => setModal(null)}>{t("Got it") + " "}<Check size={17} /></button></Modal>}
  </>;
}
