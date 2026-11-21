// Run as a Playwright browser_run_code_unsafe filename, with npm run dev active.
// Mechanical framing only: preserve source objects, their aspect ratios and markings.
async (page) => {
  const base = 'http://localhost:5173';
  // Run from the repository root, or set PRODUCT_QUIZ_ROOT in the tool environment.
  const root = (process.env.PRODUCT_QUIZ_ROOT || process.cwd()).replaceAll('\\', '/') + '/';
  const q = await page.context().newPage();
  await q.goto(base);
  const inputs = await q.evaluate(async () => {
    const [real, generated, revisions] = await Promise.all(['real-products','generated-prompts','presentation-revisions'].map(name => fetch('/content/'+name+'.json').then(r=>r.json())));
    const fake = [...generated.items, {id:'herb-cup'}].map(p => {
      const revision = revisions.items.find(r=>r.id===p.id);
      return {id:p.id,source:revision?.original || 'content/originals/'+p.id+'.png',revisionImage:revision?.image};
    });
    return [...real.map(p=>({id:p.id,source:p.image})),...fake];
  });
  const save = async (data, destination) => {
    const pending = q.waitForEvent('download');
    await q.evaluate(({data,destination}) => {
      const link=document.createElement('a');link.href=data;link.download=destination.split('/').pop();link.click();
    },{data,destination});
    const download=await pending;await download.saveAs(root+destination);
  };
  const items=[];
  try {
    for(const p of inputs) {
      const result=await q.evaluate(async p=>{
        const response=await fetch('/'+p.source);
        if(!response.ok)throw new Error('Missing source: '+p.source);
        const bytes=await response.arrayBuffer();
        const hash=async buffer=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(x=>x.toString(16).padStart(2,'0')).join('');
        const bitmap=await createImageBitmap(new Blob([bytes]));
        const source=document.createElement('canvas');source.width=bitmap.width;source.height=bitmap.height;
        const ctx=source.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff';ctx.fillRect(0,0,source.width,source.height);ctx.drawImage(bitmap,0,0);bitmap.close();
        const pixels=ctx.getImageData(0,0,source.width,source.height).data;
        let left=source.width,top=source.height,right=-1,bottom=-1;
        for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){
          const i=(y*source.width+x)*4;
          if(Math.min(pixels[i],pixels[i+1],pixels[i+2])<247){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
        }
        if(right<left)throw new Error('No visible object: '+p.id);
        const guard=Math.max(12,Math.ceil(Math.max(right-left,bottom-top)*.025));
        left=Math.max(0,left-guard);right=Math.min(source.width-1,right+guard);top=Math.max(0,top-guard);bottom=Math.min(source.height-1,bottom+guard);
        const width=right-left+1,height=bottom-top+1,scale=820/Math.max(width,height);
        const canvas=document.createElement('canvas');canvas.width=canvas.height=1000;
        const out=canvas.getContext('2d');out.fillStyle='#fff';out.fillRect(0,0,1000,1000);out.imageSmoothingEnabled=true;out.imageSmoothingQuality='high';
        out.drawImage(source,left,top,width,height,(1000-width*scale)/2,(1000-height*scale)/2,width*scale,height*scale);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.88));
        if(!blob||blob.type!=='image/webp')throw new Error('WebP encoder unavailable');
        const encoded=await blob.arrayBuffer();
        const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(blob);});
        return {data,width:1000,height:1000,crop:{left,top,width,height},sourceSize:{width:source.width,height:source.height},sourceSha256:await hash(bytes),sha256:await hash(encoded),bytes:blob.size};
      },p);
      const image='assets/prepared/'+p.id+'.webp';
      await save(result.data,image);
      if(p.revisionImage)await save(result.data,p.revisionImage);
      const {data,...metadata}=result;
      items.push({id:p.id,source:p.source,image,...metadata,method:'Rectangular whitespace crop, proportional resize, white padding and WebP encoding. No segmentation, retouching, logo removal or AI changes to sourced products.'});
    }
    const manifest={date:'2026-11-21',canvas:1000,maxContentExtent:820,quality:.88,items};
    await save('data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(manifest,null,2)),'content/presentation.json');
    return {images:items.length,totalBytes:items.reduce((n,p)=>n+p.bytes,0),manifest:'content/presentation.json'};
  } finally { await q.close(); }
}
