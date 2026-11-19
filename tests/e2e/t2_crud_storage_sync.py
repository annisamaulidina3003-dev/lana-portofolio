import json, urllib.request, re
from playwright.sync_api import sync_playwright
B='http://127.0.0.1:5173'; IMG='/tmp/h/img/'; GW='http://localhost:54321'
fails=[]; errs=[]
def ok(c,l):
    print(('PASS ' if c else 'FAIL ')+l)
    if not c: fails.append(l)
def files(): return json.load(urllib.request.urlopen(GW+'/__files'))
def attach(page,name):
    page.on('console',lambda m: errs.append((name,m.text)) if m.type=='error' and 'ERR_NAME_NOT_RESOLVED' not in m.text else None)
    page.on('pageerror',lambda e: errs.append((name,'PAGEERROR '+str(e))))
def login(page):
    page.goto(B+'/admin/login'); page.fill('input[type=email]','admin@test.local'); page.fill('input[type=password]','admin-pass'); page.click('button[type=submit]'); page.wait_for_url(re.compile(r'/admin/?$'),timeout=8000)
def tambah(pg,path,label):
    pg.goto(B+'/admin/'+path); pg.wait_for_load_state('networkidle'); pg.get_by_role('button',name=re.compile('^Tambah '+label,re.I)).first.click(); pg.wait_for_selector('[role=dialog] form')
def f(pg,name,val): pg.fill(f'#f-{name}',val)
def pub(pg):
    sw=pg.locator('[role=dialog] [role=switch]').last
    if sw.get_attribute('aria-checked')!='true': sw.click()
def save(pg):
    pg.locator('[role=dialog] button[type=submit]').click(); pg.wait_for_selector('[role=dialog]',state='detached',timeout=15000)
def upload(pg,field_id,path):
    inp=pg.locator(f'#{field_id}').locator('xpath=ancestor::div[contains(@class,"flex-wrap")]').locator('input[type=file]')
    inp.set_input_files(path)
with sync_playwright() as p:
    br=p.chromium.launch(); ctx=br.new_context(viewport={'width':1280,'height':900}); pg=ctx.new_page(); attach(pg,'admin'); login(pg)

    # ===== validasi gambar =====
    tambah(pg,'proyek','proyek')
    f(pg,'name','Proyek Uji Satu')
    for fn,frag in [('fake.png','bukan gambar'),('empty.png','kosong'),('d.gif','tidak didukung'),('e.svg','tidak didukung'),('big.png','melebihi batas')]:
        upload(pg,'f-cover_src',IMG+fn); pg.wait_for_timeout(700)
        txt=pg.inner_text('[role=dialog]').lower()
        ok(frag in txt, f'validasi gambar {fn}: "{frag}"')
        ok(pg.locator('[role=dialog] img[alt^="Pratinjau"]').count()==0, f'{fn}: tidak ada preview/pending')
    upload(pg,'f-cover_src',IMG+'a.jpg'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]')
    ok('belum diunggah' in pg.inner_text('[role=dialog]').lower(),'preview jpg + status belum diunggah')
    ok(len(files())==0,'sebelum simpan: belum ada file di Storage')
    pg.screenshot(path='/tmp/h/shots/admin-image-preview.png')
    f(pg,'description','Deskripsi proyek uji.'); pub(pg)
    # screenshot repeater image
    pg.get_by_role('button',name=re.compile('Tambah gambar',re.I)).click()
    inp=pg.locator('[role=dialog] input[type=file]').last; inp.set_input_files(IMG+'b.png'); pg.wait_for_timeout(600)
    save(pg)
    fl=files(); ok(len([x for x in fl if x.startswith('project-images/projects/')])==2,f'simpan: 2 file di bucket project-images ({fl})')
    cover1=[x for x in fl if x.endswith('.jpg')]; ok(len(cover1)==1,'sampul jpg terunggah')

    # ===== ganti gambar → lama terhapus =====
    pg.wait_for_timeout(500)
    pg.get_by_role('button',name=re.compile('^Ubah: Proyek Uji Satu')).click(); pg.wait_for_selector('[role=dialog] form')
    upload(pg,'f-cover_src',IMG+'c.webp'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]'); save(pg)
    fl=files(); ok(not any(x.endswith('.jpg') for x in fl) and any(x.endswith('.webp') for x in fl),f'ganti sampul: jpg lama terhapus, webp baru ada ({fl})')
    ok(len(fl)==2,'tidak ada file yatim (2 file)')

    # ===== batal: pilihan tidak diunggah =====
    pg.get_by_role('button',name=re.compile('^Ubah: Proyek Uji Satu')).click(); pg.wait_for_selector('[role=dialog] form')
    upload(pg,'f-cover_src',IMG+'a.jpg'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]')
    pg.get_by_role('button',name='Batalkan pilihan').click()
    pg.locator('[role=dialog] button:has-text("Batal")').first.click(); pg.wait_for_timeout(400)
    ok(len(files())==2,'batal/discard: tidak ada upload baru')
    if pg.locator('[role=dialog]').count(): 
        pg.get_by_role('button',name=re.compile('Buang perubahan')).click() if pg.get_by_role('button',name=re.compile('Buang perubahan')).count() else None
    pg.wait_for_timeout(300)

    # ===== modul lain =====
    tambah(pg,'profil','profil'); f(pg,'full_name','M. Rizky Maulana'); f(pg,'headline','Siswa PPLG'); f(pg,'statement','Pernyataan dari database.')
    f(pg,'school','SMKN 2 Banjarmasin'); f(pg,'class_name','XII PPLG A'); f(pg,'major','PPLG'); f(pg,'location','Banjarmasin'); f(pg,'email','kontak@test.local')
    upload(pg,'f-photo_path',IMG+'a.jpg'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]'); pub(pg); save(pg)
    for path,label,vals in [('keahlian','keahlian',{'name':'React JS','group_name':'Frontend','level':'80'}),('keahlian','keahlian',{'name':'Komunikasi','group_name':'Soft','level':''})]:
        tambah(pg,path,label)
        for k,v in vals.items():
            if v: f(pg,k,v)
        if vals['name']=='Komunikasi': pg.select_option('#f-category','soft')
        pub(pg); save(pg)
    tambah(pg,'pengalaman','pengalaman'); f(pg,'title','PLK Uji'); f(pg,'start_date','2026-01-01'); pub(pg); save(pg)
    tambah(pg,'sertifikat','sertifikat'); f(pg,'title','Sertifikat Uji'); upload(pg,'f-image_path',IMG+'b.png'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]'); pub(pg); save(pg)
    tambah(pg,'testimoni','testimoni'); f(pg,'name','Pemberi Uji'); f(pg,'message','Testimoni uji yang tulus.'); upload(pg,'f-photo_path',IMG+'c.webp'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]'); pub(pg); save(pg)
    # blog: satu terbit, satu draf
    tambah(pg,'blog','artikel'); f(pg,'title','Artikel Terbit'); f(pg,'excerpt','Ringkasan artikel.'); upload(pg,'f-cover_path',IMG+'a.jpg'); pg.wait_for_selector('[role=dialog] img[alt^="Pratinjau"]')
    pg.get_by_role('button',name=re.compile('Tambah blok',re.I)).click(); pg.locator('[role=dialog] textarea').last.fill('Isi paragraf artikel uji.'); pub(pg); save(pg)
    tambah(pg,'blog','artikel'); f(pg,'title','Artikel Draf Rahasia'); pg.get_by_role('button',name=re.compile('Tambah blok',re.I)).click(); pg.locator('[role=dialog] textarea').last.fill('Isi draf.'); save(pg)
    # proyek kedua draf
    tambah(pg,'proyek','proyek'); f(pg,'name','Proyek Draf Rahasia'); save(pg)
    # publish proyek satu dengan teknologi
    pg.goto(B+'/admin/proyek'); pg.wait_for_load_state('networkidle')
    pg.get_by_role('button',name=re.compile('^Ubah: Proyek Uji Satu')).click(); pg.wait_for_selector('[role=dialog] form')
    pg.fill('#f-technologies','React'); pg.press('#f-technologies','Enter'); f(pg,'category','') if False else None; save(pg)
    pg.screenshot(path='/tmp/h/shots/admin-projects.png')
    print('FILES',files())

    # ===== halaman publik (anon, konteks baru) =====
    pc=br.new_context(viewport={'width':1280,'height':900}); pp=pc.new_page(); attach(pp,'public')
    broken=[]
    pp.on('response',lambda r: broken.append((r.status,r.url)) if r.status>=400 and 'fonts.g' not in r.url else None)
    def txt(path,wait=800):
        pp.goto(B+path); pp.wait_for_load_state('networkidle'); pp.wait_for_timeout(wait); return pp.inner_text('body')
    t=txt('/'); ok('Pernyataan dari database' in t,'beranda: statement dari profil'); ok('REACT JS' in t.upper(),'beranda: keahlian utama dari DB')
    ok(pp.locator('img[src*="profile-images"]').count()>=1,'beranda: foto dari Storage profile-images')
    ok(pp.evaluate("[...document.images].every(i=>i.complete&&i.naturalWidth>0)"),'beranda: semua gambar termuat')
    t=txt('/tentang'); ok('SMKN 2 Banjarmasin' in t and 'XII PPLG A' in t,'tentang: biodata DB'); ok('PLK UJI' in t.upper(),'tentang: pengalaman PLK DB')
    t=txt('/keahlian'); ok('React JS' in t.title() or 'REACT JS' in t.upper(),'keahlian: React JS'); ok('KOMUNIKASI' in t.upper(),'keahlian: soft skill')
    t=txt('/pengalaman'); ok('PLK UJI' in t.upper(),'pengalaman publik')
    t=txt('/proyek'); ok('Proyek Uji Satu'.upper() in t.upper(),'proyek terbit tampil'); ok('RAHASIA' not in t.upper(),'proyek draf TIDAK tampil')
    ok(pp.locator('img[src*="project-images"]').count()>=1,'proyek: cover dari Storage')
    pp.fill('input[type=search], input[placeholder*="Cari"]','uji'); pp.wait_for_timeout(500); ok('PROYEK UJI SATU' in pp.inner_text('body').upper(),'proyek: search cocok')
    pp.fill('input[type=search], input[placeholder*="Cari"]','zzzz'); pp.wait_for_timeout(500); ok('tidak ditemukan' in pp.inner_text('body').lower(),'proyek: search kosong -> empty state')
    t=txt('/proyek/proyek-uji-satu'); ok('PROYEK UJI SATU' in t.upper(),'detail proyek via slug'); ok(pp.locator('img[src*="project-images"]').count()>=1,'detail: gambar Storage')
    t=txt('/proyek/proyek-draf-rahasia'); ok('tidak ditemukan' in t.lower(),'detail proyek draf -> 404 (slug draf tak bisa dibuka)')
    t=txt('/sertifikat'); ok('SERTIFIKAT UJI' in t.upper(),'sertifikat'); ok('TESTIMONI UJI YANG TULUS' in t.upper(),'testimoni'); ok(pp.locator('img[src*="certificate-images"]').count()>=1,'sertifikat: gambar Storage')
    t=txt('/blog'); ok('ARTIKEL TERBIT' in t.upper(),'blog: artikel terbit'); ok('RAHASIA' not in t.upper(),'blog: draf TIDAK tampil')
    t=txt('/blog/artikel-terbit'); ok('Isi paragraf artikel uji' in t,'detail artikel via slug'); t=txt('/blog/artikel-draf-rahasia'); ok('tidak ditemukan' in t.lower(),'detail artikel draf -> 404')
    t=txt('/cv'); ok('M. Rizky Maulana'.upper() in t.upper(),'cv: nama'); ok('React JS'.upper() in t.upper(),'cv: keahlian'); ok('belum tersedia' in t.lower(),'cv: tanpa cv_url -> pesan, bukan tautan palsu')
    ok(pp.locator('a[download]').count()==0,'cv: tombol unduh tidak muncul tanpa cv_url')
    t=txt('/kontak'); ok('kontak@test.local' in t,'kontak: email dari profil')
    print('BROKEN',broken)
    ok(not broken,'tidak ada request gagal (4xx/5xx) di sisi publik')

    # ===== sinkronisasi dashboard -> publik =====
    pg.goto(B+'/admin/profil'); pg.wait_for_load_state('networkidle'); pg.get_by_role('button',name=re.compile('^Ubah: M. Rizky')).click(); pg.wait_for_selector('[role=dialog] form')
    f(pg,'statement','Pernyataan DIUBAH admin.'); f(pg,'cv_url','https://example.com/cv.pdf'); save(pg)
    t=txt('/'); ok('Pernyataan DIUBAH admin' in t,'sinkron: perubahan profil langsung tampil')
    t=txt('/cv'); ok(pp.locator('a[download]').count()==1,'sinkron: cv_url -> tombol unduh muncul')
    # unpublish proyek
    pg.goto(B+'/admin/proyek'); pg.wait_for_load_state('networkidle'); pg.get_by_role('button',name=re.compile('Jadikan draf: Proyek Uji Satu')).click(); pg.wait_for_timeout(1200)
    t=txt('/proyek'); ok('PROYEK UJI SATU' not in t.upper(),'sinkron: proyek dijadikan draf langsung hilang')
    pg.goto(B+'/admin/proyek'); pg.wait_for_load_state('networkidle'); pg.get_by_role('button',name=re.compile('^Terbitkan: Proyek Uji Satu')).click(); pg.wait_for_timeout(1200)

    # ===== admin login melihat situs publik: draf tetap tersembunyi =====
    pg.goto(B+'/proyek'); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(800)
    ok('RAHASIA' not in pg.inner_text('body').upper(),'admin login menjelajah situs publik: draf tetap tersembunyi')
    pg.goto(B+'/blog/artikel-draf-rahasia'); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(800)
    ok('tidak ditemukan' in pg.inner_text('body').lower(),'admin login: detail artikel draf 404 di situs publik')

    # ===== hapus proyek → gambar terhapus =====
    n0=len(files())
    pg.goto(B+'/admin/proyek'); pg.wait_for_load_state('networkidle'); pg.get_by_role('button',name=re.compile('^Hapus: Proyek Uji Satu')).click()
    pg.get_by_role('button',name='Ya, hapus').click(); pg.wait_for_timeout(1500)
    fl=files(); ok(not any(x.startswith('project-images') for x in fl),f'hapus proyek: gambar proyek terhapus dari Storage ({n0}->{len(fl)})')
    ok(any(x.startswith('profile-images') for x in fl) and any(x.startswith('certificate-images') for x in fl),'gambar modul lain tidak ikut terhapus')
    print('ERRS',errs); ok(not errs,'tidak ada error konsol (di luar font offline)')
    br.close()
print('FAILS',fails)
