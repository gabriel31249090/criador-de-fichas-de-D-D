from playwright.sync_api import sync_playwright
from pathlib import Path
import json
r=Path(__file__).parent/'src'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 pg=b.new_page(viewport={'width':1200,'height':900});errors=[];pg.on('pageerror',lambda err:errors.append(str(err)))
 html=(r/'index.html').read_text()
 for m in ('<link rel="stylesheet" href="style.css">','<script src="rules2014.js"></script>','<script src="app.js"></script>','<script src="v5.js"></script>'):html=html.replace(m,'')
 pg.set_content(html);pg.add_style_tag(content=(r/'style.css').read_text());pg.add_script_tag(content="Object.defineProperty(window,'localStorage',{configurable:true,value:{db:{},getItem(k){return this.db[k]||null},setItem(k,v){this.db[k]=v}}});")
 for m in ('rules2014.js','app.js','v5.js'):pg.add_script_tag(content=(r/m).read_text())
 def expect(expr,expected,msg):
  val=pg.evaluate(expr);assert val==expected,(msg,val,expected);print('PASS',msg)
 pg.locator('#className').select_option('Guerreiro');pg.locator('#level').fill('3');pg.locator('#attr-str').fill('16');pg.locator('#attr-dex').fill('14');pg.locator('#attr-con').fill('14')
 pg.locator('[data-tab="v5"]').click();pg.locator('[data-v5panel="subclasses"]').click()
 pg.locator('#sub-Guerreiro').select_option('Cavaleiro Arcano')
 expect('DNDDebug.getState().v5.subclasses.Guerreiro','Cavaleiro Arcano','subclass saved')
 expect('DNDDebug.getSlots().totals[0]',2,'Eldritch Knight lvl3 gets 2 slots')
 pg.locator('[data-v5panel="levels"]').click();pg.locator('#upClass').select_option('Guerreiro');pg.locator('#upChoice').select_option('+2 em atributo');pg.locator('[data-v5="level-up"]').click()
 expect('Number(DNDDebug.getState().fields.level)',4,'level-up to 4')
 # return to level 3 to test feat acquisition at level 4
 pg.evaluate("(()=>{const s=DNDDebug.getMutableState();s.fields.level='3';DNDDebug.recalc()})()")
 pg.locator('[data-v5panel="levels"]').click();pg.locator('#upChoice').select_option('Talento');pg.locator('[data-v5="level-up"]').click()
 pg.locator('#featSelect').select_option('Robusto');pg.locator('[data-v5="feat-add"]').click()
 expect('Number(DNDDebug.getState().fields.level)',4,'feat progression auto advances level')
 expect('DNDDebug.getState().fields.featTough',True,'feat Tough changes HP formula')
 pg.locator('#level').fill('8') if pg.locator('#level').is_visible() else pg.evaluate("(()=>{DNDDebug.getMutableState().fields.level='8';DNDDebug.recalc()})()")
 pg.locator('[data-v5panel="multi"]').click();pg.locator('#multiClass').select_option('Mago');pg.locator('#multiLevel').fill('3')
 pg.evaluate("(()=>{DNDDebug.getMutableState().abilities.int='14';DNDDebug.recalc()})()")
 pg.locator('#multiClass').select_option('Mago');pg.locator('#multiLevel').fill('3');pg.locator('[data-v5="apply-multi"]').click()
 expect('DNDDebug.getState().v5.secondaryLevel',3,'multiclass apply through UI')
 expect('DNDV5.levels(DNDDebug.getMutableState()).primary',5,'multiclass primary counts')
 expect("document.querySelector('#v5HitDieWrap').hidden",False,'multiclass hit dice selection appears')
 pg.locator('[data-v5panel="resources"]').click()
 pg.locator('[data-v5panel="feats"]').click()
 pg.locator('#featSelect').select_option('Alerta');pg.locator('[data-v5="feat-add"]').click()
 pg.locator('[data-tab="sheet"]').click()
 expect("document.getElementById('initiative').textContent",'+7','feat Alert with DEX 14 correct initiative')
 pg.wait_for_timeout(450)
 saved=pg.evaluate('JSON.parse(localStorage.getItem("dnd-v3-library"))')
 assert saved['library'][saved['active']]['v5']['secondaryClass']=='Mago'
 print('PASS V5 JSON persisted in original library')
 assert not errors,errors
 print('ALL EXTENDED TESTS PASS');b.close()