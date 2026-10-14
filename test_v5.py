"""Playwright automated integration: V4 preservation and ten V5 modules."""
from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).parent/'src'
OUTPUT=Path(__file__).parent

def setup(page):
    html=(ROOT/'index.html').read_text()
    for marker in ('<script src="rules2014.js"></script>','<script src="app.js"></script>','<script src="v5.js"></script>','<link rel="stylesheet" href="style.css">'):
        html=html.replace(marker,'')
    page.set_content(html)
    page.add_style_tag(content=(ROOT/'style.css').read_text())
    page.add_script_tag(content="""Object.defineProperty(window, 'localStorage', {configurable:true, value: {
       db:{}, getItem(k){return this.db[k] ?? null}, setItem(k,v){this.db[k]=String(v)}, removeItem(k){delete this.db[k]}
    }});""")
    for script in ('rules2014.js','app.js','v5.js'):page.add_script_tag(content=(ROOT/script).read_text())

def val(page,exp):return page.evaluate(exp)
def main():
    results=[]
    def check(name,func):
        try:result=func();assert result is not False, f'check returned False';results.append([name,'PASS']);print('PASS',name)
        except Exception as e:results.append([name,'FAIL',str(e)]);print('FAIL',name,str(e));traceback.print_exc(limit=1)
    with sync_playwright() as pw:
      browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
      page=browser.new_page(viewport={'width':1440,'height':900})
      errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
      setup(page)
      page.locator('[data-tab="v5"]').click()
      check('10 new panels visible',lambda:page.locator('[data-v5panel]').count()==10)
      check('wizard name & identity',lambda:(page.locator('#wgName').fill('Aria da Névoa'),page.locator('[data-v5="next"]').click(),val(page,'DNDDebug.getState().fields.name')=='Aria da Névoa')[-1])
      def wizard_class():
          page.locator('#wgClass').select_option('Mago');page.locator('#wgRace').select_option('Elfo');page.locator('#wgBg').select_option('Sábio');page.locator('[data-v5="next"]').click()
          assert val(page,'DNDDebug.getState().fields.className')=='Mago'
          assert val(page,'DNDDebug.getState().saves.includes("int")')
      check('wizard class and saving throws',wizard_class)
      def wizard_abilities():
          page.locator('[data-v5="standard"]').click()
          page.locator('[data-v5="next"]').click()
          assert val(page,'DNDDebug.getState().abilities.str')=='15'
          assert val(page,'DNDDebug.getState().abilities.dex')=='14'
      check('standard abilities via wizard',wizard_abilities)
      check('skills auto allocation',lambda:(page.locator('[data-v5="skills"]').click(),len(val(page,'DNDDebug.getState().skillProfs'))>=2)[-1])
      page.locator('[data-v5="next"]').click();page.locator('[data-v5="starter-kit"]').click()
      check('wizard starter equipment',lambda:val(page,'DNDDebug.getState().items.some(x=>x.name==="Kit de aventureiro")'))
      page.locator('[data-v5panel="subclasses"]').click()
      check('all 12 class subclass data',lambda:val(page,'Object.keys(DNDV5.SUBS).length')==12)
      page.locator('[data-v5panel="spellbook"]').click()
      check('spell catalogue 60+ entries',lambda:val(page,'DNDV5.SPELLS.length')>=60)
      page.locator('#spSearch').fill('Mísseis')
      page.locator('#spSearch').press('Tab')
      check('search filters wizard catalogue',lambda:page.locator('#v5Content').inner_text().find('Mísseis')>=0)
      page.locator('[data-name="Mísseis Mágicos"][data-v5="spell-add"]').click()
      check('spellbook populates original spell sheet',lambda:val(page,'DNDDebug.getState().spells[1].includes("Mísseis Mágicos")'))
      page.locator('[data-v5panel="items"]').click()
      page.locator('#gearSelect').select_option('Espada longa')
      page.locator('[data-v5="equip"]').click()
      check('equipment attack + inventory',lambda:val(page,'DNDDebug.getState().items.some(x=>x.name==="Espada longa") && DNDDebug.getState().attacks.some(x=>x.name==="Espada longa")'))
      page.locator('#gearSelect').select_option('Armadura de placas');page.locator('[data-v5="equip"]').click()
      check('armor updates AC source field',lambda:val(page,'DNDDebug.getState().fields.armor')=='Armadura de placas')
      page.locator('[data-v5panel="feats"]').click();page.locator('#featSelect').select_option('Alerta');page.locator('[data-v5="feat-add"]').click()
      check('feat Alert applies +5 initiative',lambda:val(page,'DNDV5.initBonus(DNDDebug.getMutableState())')==5)
      page.locator('[data-v5panel="valid"]').click()
      check('validator active and warnings',lambda:page.locator('.v5-issue').count()>=1)
      page.locator('[data-v5panel="levels"]').click()
      check('level-up changes player level',lambda:(page.locator('[data-v5="level-up"]').click(),val(page,'Number(DNDDebug.getState().fields.level)')==2)[-1])
      page.locator('[data-v5panel="multi"]').click()
      # enough to test calculations with direct state mutation
      check('multiclass prerequisites return diagnostics',lambda:val(page,'DNDV5.canMulticlass(DNDDebug.getMutableState(),"Guerreiro").missing.length')>=0)
      def multiclass():
          page.evaluate('''()=>{const s=DNDDebug.getMutableState();s.fields.className='Guerreiro';s.fields.level='7';s.abilities.str='16';s.abilities.con='14';s.abilities.int='14';s.v5.secondaryClass='Mago';s.v5.secondaryLevel=3;DNDDebug.recalc()}''')
          assert val(page,'DNDV5.levels(DNDDebug.getMutableState()).primary')==4
          assert val(page,'DNDDebug.getSlots().totals.slice(0,3).join()')=='4,2,0'
          assert val(page,'DNDDebug.getHP().total')>0
      check('multiclass HP + combined slots',multiclass)
      page.locator('[data-v5panel="resources"]').click()
      check('class resources panel loads',lambda:page.locator('.v5-resource').count()>=1)
      page.locator('[data-v5panel="pdf"]').click()
      page.emulate_media(media='print')
      outfile=OUTPUT/'preview_print.pdf'
      page.pdf(path=str(outfile),format='A4',print_background=True)
      import fitz
      pdf=fitz.open(str(outfile));npage=len(pdf)
      check('PDF export prints original 3 sections, excludes V5',lambda:all('Construtor de Heróis' not in pg.get_text() for pg in pdf) and npage>=3)
      print('PDF page count',npage)
      page.emulate_media(media='screen')
      page.locator('[data-v5panel="guide"]').click()
      page.screenshot(path=str(OUTPUT/'preview_desktop.png'),full_page=True)
      mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
      setup(mobile);mobile.locator('[data-tab="v5"]').click()
      mobile.screenshot(path=str(OUTPUT/'preview_mobile.png'),full_page=True)
      check('mobile layout no horizontal overflow',lambda:mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'))
      check('no JS errors desktop',lambda:len(errors)==0)
      browser.close()
      (OUTPUT/'test_results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
      print('\nRESULT',sum(x[1]=='PASS' for x in results),'/',len(results))
      if any(x[1]!='PASS' for x in results):raise SystemExit(1)
if __name__=='__main__':main()