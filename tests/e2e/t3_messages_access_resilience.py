import json, urllib.request, urllib.error, re, subprocess
from playwright.sync_api import sync_playwright
exec(open('/tmp/h/t2.py').read().split("with sync_playwright")[0])
import jwt, time
ANON=jwt.encode({'role':'anon','exp':int(time.time())+9999},'test-secret-test-secret-test-secret-123',algorithm='HS256')
def tok(sub,email): return jwt.encode({'sub':sub,'role':'authenticated','aud':'authenticated','exp':int(time.time())+3000,'email':email},'test-secret-test-secret-test-secret-123',algorithm='HS256')
USER=tok('00000000-0000-0000-0000-0000000000b2','user@test.local')
def req(method,path,token=ANON,data=None,headers=None,raw=None):
    h={'apikey':ANON,'Authorization':'Bearer '+token,'Content-Type':'application/json',**(headers or {})}
    r=urllib.request.Request(GW+path,data=raw if raw is not None else (json.dumps(data).encode() if data is not None else None),method=method,headers=h)
    try:
        with urllib.request.urlopen(r) as x: return x.status,x.read().decode()
    except urllib.error.HTTPError as e: return e.code,e.read().decode()
def sql(q): return subprocess.run(['su','postgres','-c','psql -h /tmp/pg -p 5433 -U postgres -d app -At'],input=q,capture_output=True,text=True).stdout.strip().split('\n')[0]
with sync_playwright() as p:
    br=p.chromium.launch()
    # ===== visitor mengirim pesan lewat UI =====
    pc=br.new_context(viewport={'width':1280,'height':900}); pp=pc.new_page(); attach(pp,'public')
    pp.goto(B+'/kontak'); pp.wait_for_load_state('networkidle')
    pp.click('button[type=submit]'); pp.wait_for_timeout(400)
    ok('wajib diisi' in pp.inner_text('body').lower(),'form kosong: validasi tampil')
    pp.fill('#msg-name','Pengunjung Satu'); pp.fill('#msg-email','bukan-email'); pp.fill('#msg-subject','Halo'); pp.fill('#msg-message','pendek')
    pp.click('button[type=submit]'); pp.wait_for_timeout(300); ok('format email tidak valid' in pp.inner_text('body').lower(),'validasi email & pesan pendek')
    pp.fill('#msg-email','satu@test.local'); pp.get_by_text('Saran',exact=True).first.click()
    pp.fill('#msg-subject','Subjek Pesan Satu'); pp.fill('#msg-message','Ini isi pesan pertama yang cukup panjang.')
    pp.click('button[type=submit]'); pp.wait_for_selector('text=Pesan terkirim',timeout=8000)
    ok(sql("select count(*) from public.messages where status='new' and email='satu@test.local'")=='1','pesan tersimpan di tabel messages (status new)')
    ok('belum dikirim ke server' not in pp.inner_text('body'),'tidak ada teks simulasi')
    pp.locator('a[href="#buku-tamu"]').first.click(); pp.wait_for_timeout(500)
    ok('Subjek Pesan Satu'.upper() in pp.inner_text('body').upper() and 'terkirim' in pp.inner_text('body').lower(),'pengirim melihat pesannya sendiri (state sesi)')
    ok('satu@test.local' not in pp.inner_text('body'),'email tidak ditampilkan')
    pp.screenshot(path='/tmp/h/shots/contact-sent.png',full_page=True)
    # pengunjung lain (konteks baru) tidak melihat pesan itu
    pc2=br.new_context(); p2=pc2.new_page(); p2.goto(B+'/kontak'); p2.wait_for_load_state('networkidle'); p2.wait_for_timeout(600)
    ok('SUBJEK PESAN SATU' not in p2.inner_text('body').upper(),'pengunjung lain TIDAK melihat pesan')
    # kirim error: gateway tidak terjangkau → pesan error & isian tersimpan
    pp.get_by_role('button',name='Tulis pesan lain').click()
    pp.fill('#msg-name','Pengunjung Dua'); pp.fill('#msg-email','dua@test.local'); pp.get_by_text('Kesan',exact=True).first.click(); pp.fill('#msg-subject','Subjek Dua'); pp.fill('#msg-message','Isi pesan kedua yang cukup panjang.')
    pc.route('**/rest/v1/messages*',lambda r: r.abort())
    pp.click('button[type=submit]'); pp.wait_for_selector('[role=alert]:has-text("coba kirim lagi")',timeout=6000)
    ok(pp.input_value('#msg-subject')=='Subjek Dua','error jaringan: isian tetap tersimpan'); ok('terhubung' in pp.inner_text('body').lower(),'error jaringan: pesan ramah')
    pc.unroute('**/rest/v1/messages*'); pp.click('button[type=submit]'); pp.wait_for_selector('text=Pesan terkirim',timeout=8000)
    ok(sql("select count(*) from public.messages")=='2','kirim ulang berhasil (2 pesan)')

    # ===== akses langsung API: anon & user biasa =====
    s,b=req('GET','/rest/v1/messages?select=*'); ok(s in (401,403) or b=='[]','anon GET messages ditolak/kosong: %s %s'%(s,b[:60]))
    s,b=req('GET','/rest/v1/messages?select=email',USER); ok(b=='[]' or s>=400,'user biasa GET messages: kosong %s'%b[:40])
    s,b=req('GET','/rest/v1/guestbook_messages?select=*'); ok(s==404,'view guestbook_messages tidak ada (404)')
    s,b=req('PATCH','/rest/v1/messages?status=eq.new',ANON,{'status':'archived'}); ok(s>=400,'anon PATCH ditolak %s'%s)
    s,b=req('PATCH','/rest/v1/messages?status=eq.new',USER,{'status':'archived'},{'Prefer':'return=representation'}); ok(b=='[]' or s>=400,'user PATCH mengubah 0 baris')
    s,b=req('DELETE','/rest/v1/messages',USER,None,{'Prefer':'return=representation'}); ok(b=='[]' or s>=400,'user DELETE 0 baris')
    ok(sql("select count(*) from public.messages where status='new'")=='2','pesan utuh setelah upaya ilegal')
    s,b=req('POST','/rest/v1/messages',ANON,{'name':'X Y','email':'x@y.zz','category':'kesan','subject':'Subjek','message':'Isi pesan cukup panjang.','status':'read'}); ok(s>=400,'anon insert status=read ditolak %s'%s)
    s,b=req('POST','/rest/v1/projects',ANON,{'slug':'x','name':'x','is_published':True}); ok(s>=400,'anon insert projects ditolak')
    s,b=req('POST','/rest/v1/projects',USER,{'slug':'x','name':'x','is_published':True}); ok(s>=400,'user biasa insert projects ditolak')
    # storage: anon / user biasa tidak bisa upload/hapus
    png=open(IMG+'b.png','rb').read()
    s,b=req('POST','/storage/v1/object/project-images/x/hack.png',ANON,raw=png,headers={'Content-Type':'image/png'}); ok(s==403,'anon upload storage ditolak (403)')
    s,b=req('POST','/storage/v1/object/project-images/x/hack.png',USER,raw=png,headers={'Content-Type':'image/png'}); ok(s==403,'user biasa upload storage ditolak (403)')
    fl0=files(); s,b=req('DELETE','/storage/v1/object/project-images',USER,{'prefixes':[x.split('/',1)[1] for x in fl0 if x.startswith('project-images')]}); ok(len(files())==len(fl0),'user biasa tidak bisa hapus file')

    # ===== admin kelola pesan =====
    a=br.new_context(viewport={'width':1280,'height':900}); ap=a.new_page(); attach(ap,'admin'); login(ap)
    ap.wait_for_load_state('networkidle'); ok('2 pesan baru belum dibaca' in ap.inner_text('body').lower(),'overview: 2 pesan baru')
    ap.goto(B+'/admin/pesan'); ap.wait_for_load_state('networkidle'); ap.wait_for_timeout(500)
    ok(ap.locator('[data-row]').count()==2,'daftar pesan: 2 baris'); ok('satu@test.local' in ap.inner_text('body'),'admin melihat email pengirim')
    ap.get_by_role('button',name=re.compile('Buka pesan: Subjek Pesan Satu')).click(); ap.wait_for_selector('[role=dialog]'); ap.wait_for_timeout(1200)
    print('DIALOG',ap.inner_text('[role=dialog]')[:300]); ok('ISI PESAN PERTAMA' in ap.inner_text('[role=dialog]').upper(),'detail pesan menampilkan isi')
    ok(sql("select status from public.messages where email='satu@test.local'")=='read','membuka pesan baru → otomatis dibaca')
    ap.locator('[role=dialog]').get_by_role('button',name=re.compile('^Tandai baru')).click(); ap.wait_for_timeout(1000)
    ok(sql("select status||coalesce(reviewed_by::text,'-') from public.messages where email='satu@test.local'")=='new-','tandai baru: status new, reviewed dikosongkan')
    ap.locator('[role=dialog]').get_by_role('button',name=re.compile('^Arsipkan$')).click(); ap.wait_for_timeout(1000)
    ok(sql("select status||(reviewed_by is not null)::text from public.messages where email='satu@test.local'")=='archivedtrue','arsipkan: status archived + reviewed_by diisi server')
    ap.screenshot(path='/tmp/h/shots/admin-message-detail.png')
    ap.keyboard.press('Escape'); ap.wait_for_timeout(400)
    ap.select_option('select >> nth=0','archived') if False else None
    ap.get_by_role('button',name=re.compile('Hapus: Subjek Pesan Satu')).click(); ap.get_by_role('button',name='Ya, hapus').click(); ap.wait_for_timeout(1200)
    ok(sql("select count(*) from public.messages")=='1','hapus pesan: tersisa 1')
    ap.screenshot(path='/tmp/h/shots/admin-messages.png')

    # ===== gambar rusak → fallback =====
    sql("insert into public.profiles (full_name,photo_path,is_published) values ('M. Rizky Maulana','profiles/tidak-ada.jpg',true);")
    sql('''insert into public.projects (slug,name,images,is_published) values ('rusak','Proyek Rusak','{"cover":{"src":"projects/hilang.png","alt":"x"},"screenshots":[]}',true);''')
    pp.goto(B+'/'); pp.wait_for_load_state('networkidle'); pp.wait_for_timeout(1000)
    ok(pp.locator('img[src*="tidak-ada"]').count()==0 and 'RM' in pp.inner_text('body'),'foto profil rusak → fallback monogram, tanpa <img> rusak')
    pp.goto(B+'/proyek'); pp.wait_for_load_state('networkidle'); pp.wait_for_timeout(1200)
    ok(pp.locator('img[src*="hilang"]').count()==0 and 'tidak dapat dimuat' in pp.inner_text('body').lower(),'cover rusak → fallback "Gambar tidak dapat dimuat"')

    # ===== state error publik + coba lagi =====
    pe=br.new_context(); pe2=pe.new_page(); attach(pe2,'err')
    pe.route('**/rest/v1/projects*',lambda r: r.abort())
    pe2.goto(B+'/proyek'); pe2.wait_for_selector('text=Data gagal dimuat',timeout=8000); ok('COBA LAGI' in pe2.inner_text('body').upper(),'error state + tombol Coba lagi')
    pe.unroute('**/rest/v1/projects*'); pe2.get_by_role('button',name='Coba lagi').click(); pe2.wait_for_timeout(1500); ok('PROYEK RUSAK' in pe2.inner_text('body').upper(),'Coba lagi memulihkan halaman')

    # ===== responsif =====
    for w,h in [(375,800),(768,900),(1440,900)]:
        c=br.new_context(viewport={'width':w,'height':h}); pg=c.new_page(); attach(pg,f'resp{w}')
        for path in ['/','/proyek','/blog','/kontak','/cv','/sertifikat']:
            pg.goto(B+path); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(500)
            ov=pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            ok(ov<=1,f'{w}px {path}: tanpa scroll horizontal (selisih {ov})')
        pg.goto(B+'/'); pg.wait_for_timeout(600); pg.screenshot(path=f'/tmp/h/shots/home-{w}.png')
    c=br.new_context(viewport={'width':375,'height':800}); pg=c.new_page(); login(pg)
    for path in ['/admin','/admin/proyek','/admin/pesan']:
        pg.goto(B+path); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(500)
        ok(pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")<=1,f'375px {path}: tanpa scroll horizontal')
    pg.goto(B+'/admin/proyek'); pg.wait_for_load_state('networkidle'); pg.get_by_role('button',name=re.compile('^Tambah proyek',re.I)).first.click(); pg.wait_for_selector('[role=dialog] form'); pg.wait_for_timeout(400)
    pg.screenshot(path='/tmp/h/shots/admin-form-375.png')
    # ===== logout =====
    ap.goto(B+'/admin'); ap.wait_for_load_state('networkidle'); ap.get_by_role('button',name=re.compile('Keluar',re.I)).first.click(); ap.wait_for_timeout(1200)
    ok('/admin/login' in ap.url,'logout → login'); ap.goto(B+'/admin/pesan'); ap.wait_for_timeout(1000); ok('/admin/login' in ap.url,'rute admin terkunci setelah logout')
    print('ERRS',errs)
    br.close()
print('FAILS',fails)
