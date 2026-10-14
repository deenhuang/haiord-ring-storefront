import fs from 'node:fs';
import parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import generatorModule from '@babel/generator';
import * as bt from '@babel/types';
import { content } from '../src/i18n.mjs';
const path = 'src/App.jsx';
let source = fs.readFileSync(path, 'utf8');
source = source.replace("const asset = name => `/assets/${name}.webp`;", "const file = name => `${import.meta.env.BASE_URL}assets/${name}`;\nconst asset = name => file(`${name}.webp`);\nconst countries = ['Saudi Arabia','United Arab Emirates','China','United States','United Kingdom','Qatar','Kuwait','Bahrain','Oman','Other'];");
source = source.replace("import { prices", "import { translate, content } from './i18n.mjs';\nimport { prices");
source = source.replace('close, wide = false }) {', "close, wide = false, language = 'en' }) {\n  const t = key => translate(language, key);");
source = source.replace("const [currency, setCurrency] = useState('USD'),", "const [language, setLanguage] = useState(() => localStorage.getItem('noor-language') === 'zh' ? 'zh' : 'en');\n  const t = key => translate(language, key);\n  const currency = 'USD';\n  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'; localStorage.setItem('noor-language', language); document.title = language === 'zh' ? 'NOOR Ring | 智能健康戒指' : 'NOOR Ring | Your smart health companion'; }, [language]);\n  const");
source = source.replace('validateReservation({ email, country, accepted })', 'validateReservation({ email, country, accepted }, language)');
source = source.replace('<select value={currency} onChange={e => setCurrency(e.target.value)} aria-label="Currency"><option>USD</option><option>CNY</option><option>SAR</option></select>', '<select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language"><option value="en">English</option><option value="zh">中文</option></select>');
source = source.replace("onClick={() => setModal('video1')} aria-label=\"Play product film\"", "onClick={() => setModal(content[language].productVideo)} aria-label=\"Play product film\"");
source = source.replaceAll('<Modal title=', '<Modal language={language} title=');
source = source.replace('`/assets/${v}-poster.jpg`', 'file(`${v}-poster.jpg`)').replace('`/assets/${modal}.mp4`', 'file(`${modal}.mp4`)').replace('href="/assets/noor-ring-english.pdf"', 'href={file("noor-ring-english.pdf")}');
source = source.replaceAll('{finishes[finish].name}', '{t(finishes[finish].name)}').replaceAll('title={f.name}', 'title={t(f.name)}').replaceAll('aria-label={f.name}', 'aria-label={t(f.name)}').replaceAll('alt={finishes[finish].name}', 'alt={t(finishes[finish].name)}');
source = source.replace("'NOOR Ring in '+finishes[finish].name", "t('NOOR Ring in ')+t(finishes[finish].name)");
source = source.replace("`View ${['ring','collection','sensors','charging case'][i]}`", "t(['View ring','View collection','View sensors','View charging case'][i])");
source = source.replaceAll('`Size ${size}`', "`${t('Size')} ${size}`");
source = source.replace("['Saudi Arabia','United Arab Emirates','China','United States','United Kingdom','Qatar','Kuwait','Bahrain','Oman','Other'].map(c => <option key={c}>{c}</option>)", "countries.map(c => <option key={c} value={c}>{t(c)}</option>)");
source = source.replace('benefits.map(([Icon,t,p])', 'benefits.map(([Icon,title,p])').replace('key={t}><Icon size={26}/><h4>{t}</h4><p>{p}</p>', 'key={title}><Icon size={26}/><h4>{t(title)}</h4><p>{t(p)}</p>');
source = source.replaceAll('([im,alt,t])', '([im,alt,title])').replaceAll('([v,t,alt])', '([v,title,alt])').replaceAll('([n,t,p])', '([n,title,p])');
source = source.replaceAll('{t}<Arrow', '{title}<Arrow').replaceAll('<h4>{t}</h4>', '<h4>{title}</h4>');
source = source.replace('{l}</a>', '{t(l)}</a>').replace('alt={alt}', 'alt={t(alt)}').replace('{title}<Arrow', '{t(title)}<Arrow').replace('<h4>{title}</h4><p>{p}</p>', '<h4>{t(title)}</h4><p>{t(p)}</p>').replace('{q}<Plus', '{t(q)}<Plus').replace('<p>{a}</p>', '<p>{t(a)}</p>');
const replacements = {
 'The proposed presale starts with a reservation deposit, followed by size confirmation and the final order at launch. Deposit credit, refund rules and payment terms will be confirmed before paid reservations open. This website preview does not accept payments.': 'A $30 deposit secures the $199 early bird price, compared with the $349 retail price. Deposit credit, refund rules and payment terms will be confirmed before paid reservations open. This website preview does not accept payments.',
 'Early-access preview': 'Early bird access', 'Proposed launch price': 'Early bird price with a $30 deposit', 'PROPOSED LAUNCH PRICE': 'EARLY BIRD PRICE',
 'Choose your preferred finish and register your early-access interest.': 'Choose your preferred finish and reserve with a $30 deposit to unlock the $199 early bird price.',
 'Receive the final price, delivery details and order invitation at launch.': 'Receive delivery details and your final order invitation at launch.',
 'PRELAUNCH PRICE PROPOSAL':'NOOR RING PRICING', 'Availability':'Offer',
 'Pricing is a proposal, not a live offer. Deposit terms, delivery dates, taxes and shipping charges will be confirmed before paid orders open.':'Prices are in USD. Deposit credit and refund terms, delivery dates, taxes and shipping charges will be confirmed before paid orders open.',
 'proposed deposit':'reservation deposit',
 'This local frontend preview does not transmit or store your email, country or preferences. Information entered is held only in the current page session. A full privacy policy will be provided before the live store collects personal data.':'This frontend preview does not transmit or store your email, country or reservation details. Your language preference is saved only in your browser. A full privacy policy will be provided before the live store collects personal data.',
 'Prices and launch tiers shown are draft proposals. No payment processor is connected. Deposit refund and credit rules, shipping dates, warranties, local taxes and final specifications must be confirmed before a paid presale begins.':'Retail price: $349. Early bird price: $199 with a $30 deposit. No payment processor is connected. Deposit credit and refund rules, shipping dates, warranties, local taxes and final specifications will be confirmed before a paid presale begins.'
};
for (const [a,b] of Object.entries(replacements)) source = source.replaceAll(a,b);
source = source.replace("[['Founder',quote.founder,'First 300 rings'],['Early bird',quote.early,'Next 1,000 rings'],['Prelaunch',quote.launch,'Before retail launch'],['Retail',quote.retail,'After launch']]", "[['Early bird',quote.launch,'With a $30 reservation deposit'],['Retail',quote.retail,'Standard retail price']]").replace("n === 'Prelaunch'", "n === 'Early bird'");
source = source.replace('<strong>{n}</strong><span>{p === null', '<strong>{t(n)}</strong><span>{p === null').replace('<span>{a}</span></div>', '<span>{t(a)}</span></div>');
const ast = parser.parse(source, {sourceType:'module',plugins:['jsx']});
const traverse = traverseModule.default;
const gen = generatorModule.default;
const known = value => Object.hasOwn(content.zh, value);
const call = value => bt.callExpression(bt.identifier('t'), [bt.stringLiteral(value)]);
traverse(ast, {
 JSXText(p) {
   const raw=p.node.value, key=raw.trim();
   if(!p.scope.hasBinding('t') || !known(key)) return;
   let expression=call(key);
   if(/^\s/.test(raw)) expression=bt.binaryExpression('+',bt.stringLiteral(' '),expression);
   if(/\s$/.test(raw)) expression=bt.binaryExpression('+',expression,bt.stringLiteral(' '));
   p.replaceWith(bt.jsxExpressionContainer(expression)); p.skip();
 },
 StringLiteral(p) {
   if(!p.scope.hasBinding('t') || !known(p.node.value)) return;
   if(p.parentPath.isCallExpression() && p.parent.callee.name==='t') return;
   if(p.parentPath.isJSXAttribute()) p.replaceWith(bt.jsxExpressionContainer(call(p.node.value)));
   else p.replaceWith(call(p.node.value));
   p.skip();
 }
});
fs.writeFileSync(path, gen(ast).code+'\n');
