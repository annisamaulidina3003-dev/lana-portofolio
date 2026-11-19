import json, sys, urllib.request
from playwright.sync_api import sync_playwright
B='http://127.0.0.1:5173'; IMG='/tmp/h/img/'
fails=[]; errs=[]
def ok(c,l):
    print(('PASS ' if c else 'FAIL ')+l)
    if not c: fails.append(l)
def attach(page,name):
    page.on('console',lambda m: errs.append((name,m.text)) if m.type=='error' else None)
    page.on('pageerror',lambda e: errs.append((name,'PAGEERROR '+str(e))))
with sync_playwright() as p:
    br=p.chromium.launch()
    # ── publik, DB kosong
    ctx=br.new_context(viewport={'width':1280,'height':900}); pg=ctx.new_page(); attach(pg,'public-empty')
    for path,expect in [('/','Keahlian belum ditambahkan'),('/tentang','Pendidikan'),('/keahlian','Belum ada hard skill'),('/pengalaman','Belum ada pengalaman'),('/proyek','Belum ada proyek'),('/sertifikat','Belum ada'),('/blog','Belum ada artikel'),('/cv','Belum ada'),('/kontak','Kesan & Pesan'),('/proyek/tidak-ada','tidak ditemukan'),('/blog/tidak-ada','tidak ditemukan')]:
        pg.goto(B+path); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(500)
        txt=pg.inner_text('body')
        ok(expect.lower() in txt.lower(), f'publik kosong {path}: "{expect}"')
        ok('src/data' not in txt, f'publik kosong {path}: tanpa petunjuk dev "src/data"')
    pg.goto(B+'/kontak'); pg.wait_for_load_state('networkidle')
    ok('Mode simulasi' not in pg.inner_text('body'),'kontak: bukan mode simulasi')
    ok('tidak ditampilkan untuk publik' in pg.inner_text('body'),'kontak: catatan privasi')
    # ── admin login
    a=br.new_context(viewport={'width':1280,'height':900}); ap=a.new_page(); attach(ap,'admin')
    ap.goto(B+'/admin'); ap.wait_for_load_state('networkidle'); ok('/admin/login' in ap.url,'admin tanpa login -> login')
    def login(page,email,pw):
        page.goto(B+'/admin/login'); page.fill('input[type=email]',email); page.fill('input[type=password]',pw); page.click('button[type=submit]'); page.wait_for_timeout(1500)
    login(ap,'admin@test.local','salah'); ok('login' in ap.url and ('salah' in ap.inner_text('body').lower() or 'invalid' in ap.inner_text('body').lower() or 'sandi' in ap.inner_text('body').lower()),'sandi salah -> pesan error')
    u=br.new_context(); up=u.new_page(); attach(up,'user'); login(up,'user@test.local','user-pass')
    ok('ditolak' in up.inner_text('body').lower() or '/admin/login' in up.url,'non-admin ditolak'); 
    login(ap,'admin@test.local','admin-pass'); ap.wait_for_load_state('networkidle')
    ok(ap.url.rstrip('/').endswith('/admin'),'admin login berhasil: '+ap.url)
    ok('Overview' in ap.inner_text('body'),'overview tampil')
    ap.screenshot(path='/tmp/h/shots/overview.png')
    ap.reload(); ap.wait_for_load_state('networkidle'); ok('/admin/login' not in ap.url,'sesi bertahan setelah refresh')
    print('ERRS',[e for e in errs])
    br.close()
print('FAILS',fails)
