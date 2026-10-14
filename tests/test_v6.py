from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading, os, sys, fitz
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
errors=[];passed=[]
def check(name,cond):
 passed.append((name,bool(cond)))
 print(('PASS ' if cond else 'FAIL ')+name)
with sync_playwright() as p:
 server=ThreadingHTTPServer(('127.0.0.1',0),lambda *args,**kwargs:Quiet(*args,directory=str(ROOT),**kwargs));threading.Thread(target=server.serve_forever,daemon=True).start()
 page=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
 ctx=page.new_context(viewport={'width':1380,'height':850},accept_downloads=True)
 pg=ctx.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.set_content((ROOT/'index.html').read_text('utf8'),wait_until='load')
 pg.wait_for_timeout(500)
 check('Ficha V5 preservada',pg.locator('[data-tab="v5"]').count()==1)
 check('Aba V6 presente',pg.locator('[data-tab="v6"]').count()==1)
 pg.locator('[data-tab="v6"]').click()
 check('V6 montada',pg.locator('#v6Content').count()==1)
 check('Grimório renderiza',pg.locator('#v6spell').count()==1)
 tests=pg.evaluate('window.DNDV6.selftest()')
 for test in tests:check('Unit '+test['name'],test['ok'])
 for key in ['combat','companions','gear','world','rules','online','guide','spell']:
  pg.locator('[data-v6tab="'+key+'"]').click()
  check('Aba '+key,pg.locator('#v6Content .v6-card').count()>0)
 pg.locator('[data-v6tab="combat"]').click()
 pg.locator('[data-v6="addcombatant"]').click()
 check('Criar inimigo',pg.locator('.v6-combatrow').count()==1)
 pg.locator('[data-v6="initiative"]').click()
 pg.locator('[data-v6="advance"]').click()
 check('Próximo turno',pg.locator('#v6combatmsg').inner_text().startswith('Rodada'))
 pg.locator('[data-v6="applycombat"]').click()
 check('Aplicar dano', 'Dano' in pg.locator('#v6combatmsg').inner_text())
 pg.locator('[data-v6="undo"]').click()
 check('Desfazer',pg.locator('.v6-combatrow').count()==1)
 pg.locator('[data-v6tab="gear"]').click()
 pg.locator('[data-v6="addmagic"]').click()
 check('Registrar item mágico',pg.locator('.v6-combatrow').count()==1)
 pg.locator('[data-v6toggle="equip"]').check()
 check('Equipar item',pg.evaluate('window.DNDV6.data().magicItems[0].equipped') is True)
 pg.locator('[data-v6toggle="attune"]').check()
 check('Sintonizar item',pg.evaluate('window.DNDV6.data().magicItems[0].attuned') is True)
 pg.locator('[data-v6tab="companions"]').click()
 pg.locator('#v6pettype').select_option('Companheiro')
 pg.locator('[data-v6="addcompanion"]').click()
 check('Criar companheiro',pg.locator('.v6-minicard').count()==1)
 pg.locator('[data-v6tab="spell"]').click()
 pg.locator('[data-v6="rollspell"]').click()
 check('Simular magia sem gasto', 'Simulação' in pg.locator('#v6spellresult').inner_text())
 check('Sem erros JavaScript iniciais',len(errors)==0)
 Path(ROOT/'preview_desktop.png').write_bytes(pg.screenshot(full_page=True))
 # PWA assets served
 import urllib.request
 for f in ['manifest.webmanifest','sw.js','src/v6.js','src/v6.css','supabase/campaign.sql']:
  check('Arquivo '+f,(ROOT/f).is_file())
 ctx2=page.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
 mobile=ctx2.new_page();mobile.set_content((ROOT/'index.html').read_text('utf8'),wait_until='load');mobile.locator('[data-tab="v6"]').click();mobile.locator('[data-v6tab="gear"]').click()
 mobile.screenshot(path=str(ROOT/'preview_mobile.png'),full_page=True)
 check('Mobile sem overflow horizontal grave',mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 12'))
 # Printing original 3-page sheets (exclude tools/V5/V6)
 printable=pg.pdf(format='A4',print_background=True)
 (ROOT/'preview_print.pdf').write_bytes(printable)
 doc=fitz.open(stream=printable,filetype='pdf');check('PDF tem 3 páginas',len(doc)==3)
 check('Sem exceções JS pós interações',len(errors)==0)
 ctx2.close();ctx.close();page.close();server.shutdown()
print('RESULT',sum(t for _,t in passed),'/',len(passed),'errors',errors[:5]);sys.exit(0 if all(t for _,t in passed) else 1)