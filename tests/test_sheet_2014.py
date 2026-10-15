"""Regressão da ficha impressa e dos cálculos de D&D 5e (2014).
Executar: python tests/test_sheet_2014.py
Requer: pip install playwright pymupdf ; python -m playwright install chromium
"""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
import fitz
import threading

ROOT = Path(__file__).resolve().parents[1]

class SilentHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def run():
    checks = []
    errors = []

    def check(name, value):
        checks.append((name, bool(value)))
        print(("PASS " if value else "FAIL ") + name)

    server = ThreadingHTTPServer(
        ("127.0.0.1", 0),
        lambda *args, **kwargs: SilentHandler(*args, directory=str(ROOT), **kwargs),
    )
    threading.Thread(target=server.serve_forever, daemon=True).start()
    address = f"http://127.0.0.1:{server.server_address[1]}/index.html"

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])
            context = browser.new_context(viewport={"width": 1440, "height": 900})
            page = context.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(address, wait_until="domcontentloaded")
            page.wait_for_function("!!window.DNDDebug && !!window.DNDV5")
            check("Três folhas tradicionais", all(page.locator("#" + x).count() == 1 for x in ("sheet", "story", "spells")))
            check("Painéis adicionais preservados", page.locator('[data-tab="v5"]').count() == 1 and page.locator('[data-tab="v6"]').count() == 1)
            page.locator("#btnNew").click()
            page.locator("#name").fill("Ficha de Regressão")
            page.locator("#className").select_option("Guerreiro")
            page.locator("#level").fill("5")
            page.locator('[data-ability="str"]').fill("16")
            page.locator('[data-ability="dex"]').fill("8")
            page.locator('[data-ability="con"]').fill("14")
            page.locator("#armor").select_option("Cota de malha")
            check("CA pesada ignora Destreza negativa", page.locator("#acValue").inner_text() == "16")
            page.locator("#shield").check()
            check("Escudo acrescenta +2", page.locator("#acValue").inner_text() == "18")
            check("PV do guerreiro nível 5 com CON +2", page.locator("#hpMax").inner_text() == "44")
            check("Proficiência +3 nível 5", page.locator("#profBonus").inner_text() == "+3")

            page.locator('[data-tab="story"]').click()
            page.locator("#portraitPreset").select_option("elf")
            check("Retrato alterna sem mudar atributos", page.locator("#portraitPreview").get_attribute("data-portrait") == "elf")
            page.wait_for_timeout(700)
            check("LocalStorage preserva personagens", page.evaluate(
                "() => {const x=JSON.parse(localStorage.getItem('dnd-v3-library'));"
                "return Object.values(x.library).some(v=>v.fields.name==='Ficha de Regressão' && v.fields.portraitPreset==='elf')}"
            ))
            other = context.new_page()
            other.goto(address, wait_until="domcontentloaded")
            other.wait_for_function("!!window.DNDDebug")
            check("Ficha sobrevive a novo carregamento", other.locator("#name").input_value() == "Ficha de Regressão")
            check("Ilustração também sobrevive", other.locator("#portraitPreset").input_value() == "elf")
            other.close()

            page.locator('[data-tab="spells"]').click()
            check("Dez blocos de truques e magias", page.locator("#spellList .spell-level").count() == 10)
            check("Pacto oculto sem multiclasse", page.locator("#pactTracker").is_hidden())
            page.locator('[data-tab="v5"]').click()
            check("Multiclasse preservada", page.locator("#v5Content").count() == 1)

            # Conferir geometria do PDF e a preservação de todas as páginas.
            pdf = page.pdf(format="A4", print_background=True)
            doc = fitz.open(stream=pdf, filetype="pdf")
            check("PDF contém pelo menos as três folhas", len(doc) >= 3)
            check("Texto de identidade presente no PDF", any("Ficha de Regressão" in p.get_text() for p in doc))
            doc.close()

            mobile = browser.new_context(viewport={"width": 390, "height": 844})
            small = mobile.new_page()
            small.goto(address, wait_until="domcontentloaded")
            check("Sem overflow horizontal grave no celular",
                  small.evaluate("document.documentElement.scrollWidth <= innerWidth + 12"))
            check("Sem erros JS no navegador principal", len(errors) == 0)
            mobile.close()
            context.close()
            browser.close()
    finally:
        server.shutdown()

    print(f"RESULTADO: {sum(ok for _, ok in checks)}/{len(checks)}")
    return 0 if all(ok for _, ok in checks) else 1

if __name__ == "__main__":
    raise SystemExit(run())
