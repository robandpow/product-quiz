import { STORAGE_KEY, createSession, canSubmit, assess, summarize, readSession } from './quiz.mjs';

const main = document.querySelector('#main');
const letters = ['A','B','C','D'];
const zoomIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M10.5 7.5v6M7.5 10.5h6"/></svg>';
const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const conceptIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M9 3h6l6 9-6 9H9l-6-9Z"/><path d="m9 3 6 18M15 3 9 21M3 12h18"/></svg>';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = escape;
const money = value => new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 }).format(value) + ',–';
let rounds = [], session = null, view = 'intro', storageAvailable = true;
let brokenImages = new Set();

try {
  const response = await fetch('./content/rounds.json');
  if (!response.ok) throw new Error('Kunne ikke laste inn quizen.');
  rounds = await response.json();
  try { session = readSession(window.localStorage, rounds); } catch { storageAvailable = false; }
  view = session?.view || 'intro';
  render();
} catch {
  main.innerHTML = '<section class="error"><h1>Produktene kom ikke fram.</h1><p>Last siden på nytt for å prøve igjen. Hvis problemet fortsetter, sjekk at nettstedet har alle bildefilene og quizdataene.</p><button class="primary" id="reload">Last inn på nytt</button></section>';
  document.querySelector('#reload').onclick = () => location.reload();
}

function save() {
  if (!session) return;
  session.view = view;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }
  catch { storageAvailable = false; }
}
function announce(text) { document.querySelector('#announcement').textContent = text; }
function focusHeading() {
  requestAnimationFrame(() => { const heading = main.querySelector('h1'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll:true }); } window.scrollTo({ top:0, behavior:'instant' }); });
}
function productById(id) { return rounds.flatMap(r=>r.products).find(p=>p.id===id); }
function productImage(p, lazy = false) {
  return `<img src="${e(p.image)}" alt="${e(p.title)}" width="600" height="600" decoding="async" ${lazy?'loading="lazy"':''} data-product-image="${e(p.id)}">`;
}
function storageNote() { return storageAvailable ? '' : '<p class="storage-note" role="status">Nettleseren tillater ikke lagring. Du kan spille ferdig, men svarene forsvinner hvis du laster siden på nytt.</p>'; }
function render() {
  if (!rounds.length) return;
  const focusId = document.activeElement?.id;
  main.innerHTML = view === 'intro' ? intro() : view === 'results' ? results() : quiz();
  wireMain();
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll:true });
  document.title = view === 'quiz' ? `Runde ${session.roundIndex + 1} – Ekte vare?` : view === 'results' ? 'Dine valg – Ekte vare?' : 'Ekte vare? – Stol på øynene?';
  main.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      brokenImages.add(img.dataset.productImage);
      const container = img.parentElement;
      const message = document.createElement('div'); message.className = 'image-error';
      message.innerHTML = '<span>Bildet kunne ikke lastes.</span><button class="text-button" type="button">Prøv igjen</button>';
      message.querySelector('button').onclick = event => { event.preventDefault(); event.stopPropagation(); brokenImages.delete(img.dataset.productImage); render(); };
      container.replaceChild(message, img);
      const submit = document.querySelector('#submit-answer'); if (submit) submit.disabled = true;
      announce('Et produktbilde mangler. Prøv å laste bildet igjen før du svarer.');
    }, { once:true });
    img.addEventListener('load', () => { brokenImages.delete(img.dataset.productImage); updateSubmit(); }, { once:true });
  });
}

function intro() {
  const picks = [rounds[0].products.find(p=>!p.real), rounds[1].products.find(p=>p.real), rounds.find(r=>r.id==='diy').products.find(p=>p.real), rounds[5].products.find(p=>!p.real)];
  const saved = !!session;
  return `<section class="intro">
    ${saved?`<div class="saved-note">${session.answers.length===rounds.length?'Du har fullført quizen. Svarene dine ligger klare.':`Du har en quiz på gang. ${session.answers.length} av ${rounds.length} runder er besvart.`}</div>`:''}
    <div class="intro-stage"><div class="intro-copy">
      <h1>Ser ekte ut.<br><span>Men er det det?</span></h1>
      <p>Fine bilder. Smarte produkter. Noen finnes i butikk. Andre er laget med KI. Hva ville du stolt på?</p>
      <div class="button-row"><button class="primary" id="start">${saved ? session.answers.length===rounds.length?'Se svarene mine':'Fortsett quizen':'Prøv quizen'}</button>${saved?'<button class="text-button" id="restart">Begynn på nytt</button>':''}</div>
      <div class="intro-facts"><span>8 runder</span><span>Ca. 5–8 minutter</span><span>Ingen tidspress</span></div>
    </div><div class="intro-gallery" aria-label="Et utvalg av produktene du møter i quizen">${picks.map((p,i)=>`<figure>${productImage(p)}<figcaption>${letters[i]}</figcaption></figure>`).join('')}</div></div>
    <div class="intro-bottom"><div class="instructions">${checkIcon}<p><strong>Fire bilder. Du velger.</strong><br>Velg alle produktene du tror er ekte. Det kan være null, ett eller to. «Vet ikke» er også et svar.</p></div><p>Dette er ingen prøve i å avsløre KI. Det er en liten påminnelse om hvor lett et overbevisende bilde kan føles som et bevis.</p></div>
    ${storageNote()}
  </section>`;
}

function quiz() {
  if (!session) { view = 'intro'; return intro(); }
  const index=session.roundIndex, round=rounds[index], answer=session.answers[index], reveal=!!answer;
  const products=session.orders[index].map(id=>round.products.find(p=>p.id===id));
  const draft=session.draft;
  return `<section class="quiz-shell">
    <div class="round-navigation"><span class="round-counter">Runde ${index+1} av ${rounds.length}</span><div class="progress-track" role="img" aria-label="${session.answers.length} av ${rounds.length} runder besvart">${rounds.map((_,i)=>`<span class="${i<session.answers.length?'complete':i===index?'current':''}"></span>`).join('')}</div></div>
    <div class="round-header"><div><h1>${reveal?'Dette skjulte seg bak bildene.':'Hvilke produkter tror du er ekte?'}</h1><p>${reveal?'Dine valg står fortsatt markert. Her er bakgrunnen for hvert produkt.':'Velg alle du tror er ekte. Ingen, ett eller to kan være dokumenterte produkter.'}</p></div><span class="category">${e(round.title)}</span></div>
    ${reveal?revealBanner(round,answer):round.ad?'<div class="ad-note">Nå vises bildene som enkle produktannonser. Hva gjør navn og pris med magefølelsen din?</div>':''}
    <div class="product-grid">${products.map((p,i)=>reveal?revealCard(p,i,answer):selectionCard(p,i,draft,round.ad)).join('')}</div>
    ${reveal?`<div class="reflection"><p>${e(round.reflection)}${round.ad?' Prisene og annonsetekstene i denne runden er illustrasjoner laget til quizen.':''}</p><button id="next" class="primary">${index===rounds.length-1?'Se mine resultater':'Neste runde'}</button></div>`:`
    <div class="alternatives" aria-label="Andre svar"><button class="alternative" id="choose-none" aria-pressed="${draft.mode==='none'}">Ingen av dem</button><button class="alternative" id="choose-unsure" aria-pressed="${draft.mode==='unsure'}">Vet ikke</button></div>
    <div class="answer-area">
    <div class="submit-wrap"><p id="submit-help">${helpText(draft)}</p><button id="submit-answer" class="primary" ${!canSubmit(draft)?'disabled':''} aria-describedby="submit-help">Se hva som er ekte</button></div></div>`}
    ${storageNote()}
  </section>`;
}

function selectionCard(p,i,draft,isAd) {
  const selected=draft.mode==='items'&&draft.selected.includes(p.id);
  return `<article class="product-card ${isAd?'ad-card':''}">
    <input class="product-choice" type="checkbox" id="product-${e(p.id)}" value="${e(p.id)}" ${selected?'checked':''} aria-label="Velg ${letters[i]}: ${e(p.title)}">
    <label class="product-label" for="product-${e(p.id)}"><div class="image-stage"><span class="letter">${letters[i]}</span>${productImage(p)}</div><div class="product-meta"><div><span class="product-title">${e(p.title)}</span>${isAd?`<span class="product-ad">${e(p.adText)}</span><span class="product-price">${money(p.price)}</span>`:''}</div><span class="choice-note">${selected?'Valgt':'Velg'}</span></div></label>
    <button class="zoom" data-zoom="${e(p.id)}" id="zoom-${e(p.id)}" aria-label="Forstørr ${letters[i]}: ${e(p.title)}">${zoomIcon}</button>
  </article>`;
}

function status(p) { return `<span class="reveal-status ${p.real?'':'concept'}">${p.real?checkIcon:conceptIcon}${p.real?'Dokumentert produkt':'KI-generert konsept'}</span>`; }
function sourceLinks(p) {
  return p.real ? `<div class="source-links"><a href="${e(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">${e(p.sourceName||'Norsk produktoppføring')}<span class="sr-only"> (åpnes i ny fane)</span></a><a href="${e(p.evidenceUrl)}" target="_blank" rel="noopener noreferrer">${e(p.evidenceName||'Dokumentasjon')}<span class="sr-only"> (åpnes i ny fane)</span></a></div>` : '';
}
function history(p,answer) { return answer.mode==='unsure'?'Du svarte «Vet ikke»':answer.mode==='none'?'Du valgte «Ingen av dem»':answer.selected.includes(p.id)?'Du valgte dette som ekte':'Du valgte ikke dette'; }
function revealCard(p,i,answer) {
  return `<article class="product-card reveal-card ${answer.selected.includes(p.id)?'chosen':''}"><div class="image-stage"><span class="letter">${letters[i]}</span>${productImage(p)}</div><button class="zoom" data-zoom="${e(p.id)}" id="zoom-${e(p.id)}" aria-label="Forstørr ${letters[i]}: ${e(p.title)}">${zoomIcon}</button><div class="product-meta">${status(p)}</div><div class="reveal-body"><h3>${e(p.real?p.actualName:p.title)}</h3><p>${e(p.reveal)}</p>${sourceLinks(p)}<div class="choice-history">${history(p,answer)}</div></div></article>`;
}
function revealBanner(round,answer) {
  const a=assess(round,answer);
  let heading=a.realCount===0?'Ingen av disse var dokumenterte produkter.':`${a.realCount===1?'Ett av produktene var dokumentert.':'To av produktene var dokumenterte.'}`;
  let text=a.unsure?'Du valgte å være usikker. Et bilde alene gir ikke alltid nok grunnlag til å vite.':a.exact?'Du valgte riktig i denne runden. Det er fortsatt kildegrunnlaget, ikke utseendet alene, som bekrefter produktene.':`Du valgte ${a.selectedReal} dokumentert${a.selectedReal===1?' produkt':'e produkter'} og ${a.falseSelections.length} KI-generert${a.falseSelections.length===1?' konsept':'e konsepter'} som ekte.`;
  return `<div class="reveal-banner"><h2>${heading}</h2><p>${text}</p></div>`;
}
function helpText(draft) { return draft.mode==='unsure'?'Klar for å se bak bildene?':!draft.selected.length&&draft.mode!=='none'?'Velg produkter, «Ingen av dem» eller «Vet ikke».':'Svaret låses når du ser avsløringen.'; }
function updateSubmit() {
  const button=document.querySelector('#submit-answer'); if (!button||!session) return;
  const missing=rounds[session.roundIndex].products.some(p=>brokenImages.has(p.id));
  button.disabled=!canSubmit(session.draft)||missing;
  document.querySelector('#submit-help').textContent=missing?'Et bilde mangler. Last bildet igjen før du svarer.':helpText(session.draft);
}

function results() {
  if (!session || session.answers.length!==rounds.length) { view='intro'; return intro(); }
  const s=summarize(rounds,session.answers);
  let opening=s.conceptsSelected?`Du valgte <strong>${s.conceptsSelected} ${s.conceptsSelected===1?'KI-generert konsept':'KI-genererte konsepter'}</strong> som ${s.conceptsSelected===1?'et ekte produkt':'ekte produkter'}.`:'Du valgte ingen KI-genererte konsepter som ekte produkter.';
  let detail=s.conceptsSelected?'Et troverdig bilde kan få et oppdiktet design til å føles som en helt vanlig vare.':s.unsureRounds===rounds.length?'Du svarte «Vet ikke» i alle rundene. Å holde igjen når grunnlaget er tynt, er også et valg.':'Åtte utvalgte runder kan ikke si hvor godt du vil vurdere en ukjent annonse. Det er fortsatt verdt å sjekke kildene.';
  return `<section class="results"><div class="result-opening"><h1>Et godt bilde kan overbevise oss alle.</h1><div><p>${opening}</p><p>${detail}</p></div></div>
    <div class="result-facts"><span><b>${s.exactRounds} av 8</b> runder med alle valg riktige</span><span><b>${s.unsureRounds}</b> «Vet ikke»</span><span><b>${s.realRejected}</b> ekte produkter valgt bort</span></div>
    <div class="takeaway"><h2>Du trenger ikke bli en KI-detektiv.</h2><p>Du trenger mer enn et bilde før du stoler på et tilbud. Et bilde viser hvordan noe kan se ut. Det beviser ikke at produktet finnes, virker som lovet eller kommer fram.</p></div>
    <div class="behind-scenes"><h2>Bildene krevde ingen produkter.</h2><p>De 24 konseptbildene ble laget med et KI-verktøy, ut fra tekstbeskrivelser av materialer, form, lys og kameravinkel. Ingen fysisk vare ble fotografert til disse bildene. De åtte dokumenterte produktene ble hentet fra forhandler- og produsentkilder.</p><p>Noen konsepter kan ligne produkter som finnes. Quizen dokumenterer hvor bildene og designene her kommer fra; den beviser ikke at ingen har laget noe lignende. At et produkt er dokumentert, sier heller ikke at alle annonser for det er trygge.</p></div>
    <h2 class="review-title">Se tilbake på valgene dine</h2>
    ${rounds.map((r,i)=>{const a=session.answers[i];return `<details class="round-review"><summary>${i+1}. ${e(r.title)}<span>${a.mode==='unsure'?'Vet ikke':a.mode==='none'?'Ingen av dem':'Valgte '+a.selected.length+' produkter'}</span></summary><div class="review-products">${session.orders[i].map(id=>{const p=r.products.find(p=>p.id===id);return `<article>${productImage(p,true)}<div><h3>${e(p.real?p.actualName:p.title)}</h3>${status(p)}<p class="choice-history">${history(p,a)}</p>${sourceLinks(p)}</div></article>`;}).join('')}</div></details>`;}).join('')}
    <div class="button-row"><button class="primary" id="restart">Spill på nytt</button><button class="secondary" id="share">Kopier lenke til quizen</button></div><p class="share-note" id="share-message">${isLocal()?'Dette er en lokal forhåndsvisning. En delbar nettadresse blir tilgjengelig når quizen publiseres.':'Bare lenken deles. Svarene dine følger ikke med.'}</p>${storageNote()}
  </section>`;
}

function wireMain() {
  document.querySelector('#start')?.addEventListener('click',()=>{if(!session)session=createSession(rounds); view=session.answers.length===rounds.length?'results':'quiz'; save(); render(); focusHeading(); });
  document.querySelector('#restart')?.addEventListener('click',()=>document.querySelector('#restart-dialog').showModal());
  document.querySelectorAll('.product-choice').forEach(input=>input.addEventListener('change',()=>{
    const d=session.draft;
    if(d.mode!=='items'){d.mode='items';d.selected=[];}
    d.selected=input.checked?[...d.selected,input.value]:d.selected.filter(id=>id!==input.value);
    save(); render(); announce(`${d.selected.length} produkter valgt.`);
  }));
  for(const mode of ['none','unsure']) document.querySelector(`#choose-${mode}`)?.addEventListener('click',()=>{
    const d=session.draft;d.mode=d.mode===mode?'items':mode;d.selected=[];save();render();announce(d.mode==='items'?'Ingen svar valgt.':mode==='none'?'Ingen av dem er valgt.':'Vet ikke er valgt.');
  });
  document.querySelector('#submit-answer')?.addEventListener('click',()=>{
    if(!canSubmit(session.draft)||session.answers[session.roundIndex]||rounds[session.roundIndex].products.some(p=>brokenImages.has(p.id)))return;
    session.answers.push(structuredClone(session.draft));save();render();focusHeading();
  });
  document.querySelector('#next')?.addEventListener('click',()=>{
    if(session.roundIndex===rounds.length-1)view='results';
    else {session.roundIndex++;session.draft={mode:'items',selected:[]};}
    save();render();focusHeading();
  });
  document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
    const p=productById(button.dataset.zoom); const image=document.querySelector('#large-image');image.src=p.image;image.alt=p.title;document.querySelector('#image-title').textContent=p.title;document.querySelector('#image-dialog').showModal();
  }));
  document.querySelector('#share')?.addEventListener('click',share);
  updateSubmit();
}

function isLocal() { return ['localhost','127.0.0.1','[::1]'].includes(location.hostname)||location.protocol==='file:'; }
async function share() {
  const message=document.querySelector('#share-message');
  if(isLocal()){message.textContent='Denne adressen virker bare på maskinen som kjører quizen. Publiser nettsiden før du deler lenken med andre.';announce(message.textContent);return;}
  const url=new URL(location.pathname,location.origin).href;
  try {await navigator.clipboard.writeText(url);message.textContent='Lenken er kopiert. Svarene dine deles ikke.';}catch{message.textContent=`Kopier adressen fra adressefeltet: ${url}`;}
  announce(message.textContent);
}
document.querySelector('#home').addEventListener('click',()=>{if(!rounds.length)return;view='intro';save();render();focusHeading();});
document.querySelector('#restart-dialog').addEventListener('close',event=>{
  const dialog=event.target;const result=dialog.returnValue;dialog.returnValue='';
  if(result==='restart'){session=createSession(rounds);view='quiz';save();render();focusHeading();}
});
const aboutCopy=`<p><strong>Ekte vare?</strong> er en norsk familiequiz om hvor overbevisende produktbilder kan være. Målet er å kjenne på usikkerheten, ikke å lære en liste med «KI-feil».</p><h3>Slik spiller du</h3><p>Velg alle produktene du tror er ekte. Hver runde kan ha null, ett eller to dokumenterte produkter. Du kan velge «Ingen av dem» eller «Vet ikke».</p><h3>Hva betyr ekte her?</h3><p>«Dokumentert produkt» betyr at vi har funnet produktet i norske forhandleroppføringer og hos en produsent, distributør eller annen forhandler. Kildene er lenket i avsløringen. Produktene er ikke fysisk testet. Bildene kan være fotografier eller produktgjengivelser fra forhandleren.</p><p>«KI-generert konsept» betyr at bildet og designforslaget ble laget til quizen. Lignende produkter kan finnes. Vi påstår ikke at designet er umulig eller at ingen har produsert noe tilsvarende.</p><h3>Om annonser og kilder</h3><p>Prisene og annonsetekstene i de siste to rundene er illustrasjoner, ikke tilbud. Produktkildene ble kontrollert 21. november 2026. Utvalg og tilgjengelighet kan endres. Quizen er ikke tilknyttet butikkene eller merkene som vises.</p><h3>En liten samtale etterpå</h3><p>Var det noe du fikk lyst til å kjøpe? Hvilket bilde stolte du mest på? Hva ville du ønsket å vite før du betalte?</p>`;
const privacyCopy=`<p>Quizen har ingen konto, analyseverktøy eller delt resultattavle. Svar og fremdrift lagres bare i denne nettleserens lokale lagring, slik at du kan fortsette senere.</p><p>Bildene og skrifttypen lastes fra samme nettsted som quizen. Eksterne butikker og produsenter kontaktes bare hvis du åpner kildelenkene.</p><p>Du kan slette svarene med «Begynn på nytt» eller ved å slette nettstedets data i nettleseren. Andre som bruker samme nettleserprofil, kan se de lagrede svarene.</p>`;
for(const [id,title,copy] of [['about','Om quizen',aboutCopy],['privacy','Svarene blir på enheten din',privacyCopy]])document.querySelector(`#${id}`).addEventListener('click',()=>{
  document.querySelector('#info-title').textContent=title;document.querySelector('#info-content').innerHTML=copy;document.querySelector('#info-dialog').showModal();
});
