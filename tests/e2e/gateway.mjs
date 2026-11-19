import http from 'http'; import fs from 'fs'; import path from 'path'; import jwt from 'jsonwebtoken'; import pg from 'pg';
const SECRET='test-secret-test-secret-test-secret-123', PORT=54321, STORE='/tmp/h/store';
fs.mkdirSync(STORE,{recursive:true});
const db=new pg.Pool({host:'localhost',port:5433,user:'postgres',database:'app'});
const USERS={'admin@test.local':{id:'00000000-0000-0000-0000-0000000000a1',pw:'admin-pass'},'user@test.local':{id:'00000000-0000-0000-0000-0000000000b2',pw:'user-pass'}};
const BUCKETS={'profile-images':1,'project-images':1,'certificate-images':1,'testimonial-images':1,'blog-images':1};
const MIME=['image/jpeg','image/png','image/webp','image/avif'], MAX=5242880;
const sess=(email)=>{const u=USERS[email];const exp=Math.floor(Date.now()/1000)+3600;
 const t=jwt.sign({sub:u.id,role:'authenticated',aud:'authenticated',exp,email},SECRET);
 return {access_token:t,token_type:'bearer',expires_in:3600,expires_at:exp,refresh_token:'r-'+email,user:{id:u.id,aud:'authenticated',role:'authenticated',email,app_metadata:{},user_metadata:{},created_at:'2026-01-01T00:00:00Z'}};};
const body=(req)=>new Promise(r=>{const c=[];req.on('data',d=>c.push(d));req.on('end',()=>r(Buffer.concat(c)));});
const who=(req)=>{try{return jwt.verify((req.headers.authorization||'').replace('Bearer ',''),SECRET);}catch{return null}};
const isAdmin=async(c)=>c&&c.role==='authenticated'&&(await db.query('select 1 from public.admin_users where user_id=$1',[c.sub])).rowCount>0;
const send=(res,code,obj,h={})=>{res.writeHead(code,{'content-type':'application/json','access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*',...h});res.end(typeof obj==='string'||Buffer.isBuffer(obj)?obj:JSON.stringify(obj));};
http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://x'); const p=u.pathname;
 if(req.method==='OPTIONS') return send(res,204,'');
 try{
 if(p==='/auth/v1/token'){const b=JSON.parse((await body(req)).toString()||'{}');
   if(u.searchParams.get('grant_type')==='refresh_token') return send(res,200,sess(b.refresh_token.slice(2)));
   const x=USERS[b.email]; if(!x||x.pw!==b.password) return send(res,400,{code:400,error_code:'invalid_credentials',msg:'Invalid login credentials'});
   return send(res,200,sess(b.email));}
 if(p==='/auth/v1/user'){const c=who(req); if(!c) return send(res,401,{msg:'bad jwt'}); return send(res,200,{id:c.sub,email:c.email,aud:'authenticated'});}
 if(p==='/auth/v1/logout') return send(res,204,'');
 if(p.startsWith('/rest/v1/')){
   const b=await body(req); const h={...req.headers}; delete h.host; h['content-length']=b.length;
   const pr=http.request({host:'localhost',port:3000,path:p.replace('/rest/v1','')+u.search,method:req.method,headers:h},(r)=>{res.writeHead(r.statusCode,{...r.headers,'access-control-allow-origin':'*','access-control-expose-headers':'*'});r.pipe(res);});
   pr.on('error',()=>send(res,502,{message:'bad gateway'})); pr.end(b); return;}
 // ---- storage
 let m;
 if((m=p.match(/^\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/))){
   const f=path.join(STORE,m[1],decodeURIComponent(m[2])); if(!fs.existsSync(f)) return send(res,404,{message:'Object not found'});
   const ext=path.extname(f).slice(1); return send(res,200,fs.readFileSync(f),{'content-type':'image/'+(ext==='jpg'?'jpeg':ext)});}
 if(req.method==='POST'&&(m=p.match(/^\/storage\/v1\/object\/([^/]+)\/(.+)$/))){
   const c=who(req); const buf=await body(req);
   if(!BUCKETS[m[1]]) return send(res,404,{statusCode:'404',error:'Bucket not found',message:'Bucket not found'});
   if(!(await isAdmin(c))) return send(res,403,{statusCode:'403',error:'Unauthorized',message:'new row violates row-level security policy'});
   const ct=(req.headers['content-type']||'').split(';')[0];
   // supabase-js sends multipart FormData for File uploads; extract raw part
   let data=buf, type=ct;
   if(ct==='multipart/form-data'){const bd='--'+(req.headers['content-type'].match(/boundary=(.+)$/)[1]);const parts=buf.toString('latin1').split(bd).slice(1,-1);
     for(const part of parts){if(/filename=/.test(part)){const hd=part.indexOf('\r\n\r\n');type=(part.slice(0,hd).match(/Content-Type: ([^\r\n]+)/i)||[])[1];const start=buf.indexOf(Buffer.from(part.slice(0,hd+4),'latin1'))+hd+4;data=buf.subarray(start,start+part.length-hd-4-2);}}}
   if(!MIME.includes(type)) return send(res,415,{statusCode:'415',error:'invalid_mime_type',message:'mime type '+type+' is not supported'});
   if(data.length>MAX) return send(res,413,{statusCode:'413',error:'Payload too large',message:'The object exceeded the maximum allowed size'});
   const f=path.join(STORE,m[1],decodeURIComponent(m[2])); if(fs.existsSync(f)) return send(res,409,{statusCode:'409',message:'The resource already exists'});
   fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,data); return send(res,200,{Key:m[1]+'/'+m[2],Id:'x'});}
 if(req.method==='DELETE'&&(m=p.match(/^\/storage\/v1\/object\/([^/]+)$/))){
   const c=who(req); const b=JSON.parse((await body(req)).toString()); const out=[];
   if(await isAdmin(c)) for(const n of b.prefixes){const f=path.join(STORE,m[1],n); if(fs.existsSync(f)){fs.unlinkSync(f);out.push({name:n,bucket_id:m[1]});}}
   return send(res,200,out);}
 if(p==='/__files'){const out=[];const walk=(d)=>fs.existsSync(d)&&fs.readdirSync(d,{withFileTypes:true}).forEach(e=>e.isDirectory()?walk(path.join(d,e.name)):out.push(path.relative(STORE,path.join(d,e.name))));walk(STORE);return send(res,200,out);}
 send(res,404,{message:'not found '+p});
 }catch(e){console.error(e);send(res,500,{message:String(e)});}
}).listen(PORT,()=>console.log('gateway',PORT));
