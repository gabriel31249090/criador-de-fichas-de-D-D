from playwright.sync_api import sync_playwright
from pathlib import Path
BASE=Path(__file__).resolve().parent
HTML=(BASE/'site.html').read_text(encoding='utf-8')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
    page=context.new_page();page.evaluate('''() => {window.__store=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__store.has(k)?window.__store.get(k):null,setItem:(k,v)=>window.__store.set(k,String(v)),removeItem:k=>window.__store.delete(k)}})}''');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML,wait_until='load')
    print('initial',page.title(),page.locator('.ability-row').count(),'errors',errors)
    assert not errors
    page.locator('#className').select_option(label='Guerreiro')
    page.locator('#level').fill('5')
    page.locator('#race').select_option(label='Anão')
    page.locator('#subrace').select_option('Colina')
    page.locator('#attr-str').fill('14');page.locator('#attr-dex').fill('10');page.locator('#attr-con').fill('14');page.locator('#attr-wis').fill('12')
    print('dwarf',page.locator('#final-con').inner_text(),page.locator('#mod-con').inner_text(),page.locator('#hpMax').inner_text(),page.locator('#racialHPNote').inner_text())
    assert page.locator('#final-con').inner_text()=='16'
    assert page.locator('#mod-con').inner_text()=='+3'
    assert page.locator('#hpMax').inner_text()=='54'
    page.locator('#rule-featTough').check()
    assert page.locator('#hpMax').inner_text()=='64'
    page.locator('#rule-featTough').uncheck()
    page.locator('#race').select_option(label='Elfo')
    page.locator('#subrace').select_option('Floresta')
    print('forest elf speed',page.locator('#speed').input_value(),'HP',page.locator('#hpMax').inner_text())
    assert page.locator('#speed').input_value()=='10.5'
    assert page.locator('#hpMax').inner_text()=='44'
    page.locator('#race').select_option(label='Meio-Elfo')
    page.locator('#attr-cha').fill('14')
    assert page.locator('#final-cha').inner_text()=='16'
    assert page.locator('#final-con').inner_text()=='15'
    page.locator('#raceExtra1').select_option('str')
    assert page.locator('#final-str').inner_text()=='15'
    page.locator('#raceAuto').uncheck()
    assert page.locator('#final-str').inner_text()=='14'
    page.locator('#raceAuto').check()
    page.locator('#className').select_option(label='Feiticeiro')
    page.locator('#race').select_option(label='Elfo');page.locator('#subrace').select_option('Alto Elfo')
    page.locator('#rule-draconicSoul').check()
    assert page.locator('#hpMax').inner_text()=='37',page.locator('#hpMax').inner_text()
    assert page.locator('#acValue').inner_text()=='14'
    page.locator('#mageArmor').check();assert page.locator('#acValue').inner_text()=='14'
    page.locator('#mageArmor').uncheck()
    page.locator('#className').select_option(label='Clérigo')
    page.locator('#attr-wis').fill('16')
    page.locator('button[data-tab="spells"]').click()
    print('guide',page.locator('#magicGuide').inner_text())
    assert 'Magias preparadas: 8.' in page.locator('#magicGuide').inner_text()
    page.locator('button[data-tab="sheet"]').click()
    page.locator('#initiativeExtra').fill('2')
    assert page.locator('#initiative').inner_text()=='+3'
    page.locator('#hpCurrent').fill('0')
    page.locator('#deathRoll').click()
    assert 'd20:' in page.locator('#deathResult').inner_text()
    page.locator('button[data-tab="tools"]').click()
    page.locator('#concDamage').fill('26')
    page.locator('#concRoll').click()
    assert 'CD 13' in page.locator('#concResult').inner_text()
    with page.expect_download() as info:page.locator('#btnExport').click()
    assert info.value.suggested_filename.endswith('.json')
    print('ALL HTML TESTS PASSED; browser errors:',errors)
    assert not errors,errors
    mobile=context.new_page();mobile.set_viewport_size({'width':390,'height':844});mobile.evaluate('''() => {window.__store=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__store.has(k)?window.__store.get(k):null,setItem:(k,v)=>window.__store.set(k,String(v))}})}''');errs=[];mobile.on('pageerror',lambda e:errs.append(str(e)));mobile.set_content(HTML,wait_until='load')
    print('mobile overflow',mobile.evaluate('document.documentElement.scrollWidth > innerWidth'), 'errors',errs)
    assert not errs
    assert not mobile.evaluate('document.documentElement.scrollWidth > innerWidth')
    page.screenshot(path=str(BASE/'preview_desktop.png'),full_page=True)
    mobile.screenshot(path=str(BASE/'preview_mobile.png'),full_page=True)
    browser.close()