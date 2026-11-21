import { readFile, writeFile } from 'node:fs/promises';
const real = JSON.parse(await readFile('content/real-products.json', 'utf8'));
const generated = JSON.parse(await readFile('content/generated-prompts.json', 'utf8'));
const revisions = JSON.parse(await readFile('content/presentation-revisions.json', 'utf8'));
// Keep the revised presentation only in round one; other rounds use their original images.
const revisedCategories = new Set(['baby']);
let presentation = { items: [] };
try { presentation = JSON.parse(await readFile('content/presentation.json', 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const concepts = [...generated.items, { id:'herb-cup', category:'kitchen', title:'Urtebeger med strippelokk' }].map(p => ({
  id:p.id, category:p.category, title:p.title, real:false,
  image:(revisedCategories.has(p.category) && revisions.items.find(item => item.id === p.id)?.image) || `assets/generated/${p.id}.webp`,
  reveal:'Et KI-generert design laget til quizen. Bildet er ikke hentet fra en dokumentert produktoppføring.',
  creationTool:'Built-in image_gen', promptRef:p.id, checkedAt:'2026-11-21'
}));
const definitions = [
  ['baby','Småbarnslivet','Når vi ser etter noe til familien, er det lett å forestille seg produktet hjemme. Den følelsen er ikke dokumentasjon.'],
  ['kitchen','På kjøkkenet','Et uvanlig produkt kan være ekte. Et helt hverdagslig produktbilde kan være laget uten et fysisk produkt.'],
  ['gym','Trening hjemme','Kjennskap til en produktkategori gir nyttig erfaring. Men et kjent formspråk kan også gjøre et oppdiktet design troverdig.'],
  ['appliance','Smarte småapparater','Ingen av bildene i denne runden ble hentet fra en dokumentert produktoppføring. Vanlige former kan likevel føles overbevisende. Lignende produkter kan finnes; disse designforslagene ble laget til quizen.'],
  ['outdoor','Ut på tur','Et bilde kan gi deg lyst til å pakke noe i sekken. Det forteller ikke om produktet tåler turen, eller om selgeren vil levere det.'],
  ['care','Egenpleie','Et dokumentert produkt er ikke det samme som dokumentert effekt. Her har vi kontrollert produktoppføringer, ikke behandlingspåstander.'],
  ['diy','Fikse hjemme','Det er forskjell på at et verktøy ser mulig ut, at det finnes, og at det fungerer som lovet.'],
  ['gifts','Årets gavefunn','Her var alle fire designene laget til quizen. Du fikk alltid velge «Ingen av dem». Lignende produkter kan finnes, men disse bildene dokumenterer ingen varer.']
];
const ads = {
  'real-contour-gauge':[249,'Til former og kronglete hjørner.'],
  'diy-guide':[329,'En liten hjelper til borejobben.'],
  'diy-clamp':[199,'Hold delene på plass.'],
  'diy-holder':[149,'Små bits, samlet på håndleddet.'],
  'appliance-mini':[349,'Kompakt størrelse. Enkel betjening.'],
  'appliance-froth':[499,'Til kaffestunden hjemme.'],
  'appliance-scale':[299,'En liten hjelper på kjøkkenet.'],
  'appliance-vac':[249,'For smulene på bordet.'],
  'gift-pot':[329,'En liten gave til kjøkkenvinduet.'],
  'gift-box':[279,'Små ting, samlet på ett sted.'],
  'gift-light':[399,'Til den som alltid leser litt til.'],
  'gift-clean':[179,'Et lite sett til små flater.']
};
const rounds=definitions.map(([id,title,reflection],index)=>({id,title,reflection,ad:index>=6,products:[...real.filter(p=>p.category===id).map(p=>({...p,real:true})),...concepts.filter(p=>p.category===id)].map(p=>{
  const prepared = revisedCategories.has(p.category) && presentation.items.find(item => item.id === p.id);
  return {...p, ...(prepared ? {originalImage:p.image,image:prepared.image,imagePreparation:prepared.method} : {}), ...(ads[p.id]?{price:ads[p.id][0],adText:ads[p.id][1]}:{})};
})}));
await writeFile('content/rounds.json', JSON.stringify(rounds,null,2)+'\n');
console.log(`Assembled ${rounds.length} rounds: ${real.length} documented products, ${concepts.length} generated concepts.`);
