#!/usr/bin/env python3
"""
Synkar gemensamma delar (head, sidhuvud, sidfot) till alla sidor.

Sajten är vanlig HTML på GitHub Pages, utan byggsteg. För att slippa ändra
menyn på sju ställen ligger de gemensamma delarna här i _build/partials/
och kopieras in mellan markeringar i varje sida:

    <!-- BW:GEMENSAM-HEAD START -->  ...  <!-- BW:GEMENSAM-HEAD SLUT -->
    <!-- BW:SIDHUVUD START -->       ...  <!-- BW:SIDHUVUD SLUT -->
    <!-- BW:SIDFOT START -->         ...  <!-- BW:SIDFOT SLUT -->

Ändra i partials/, kör sedan:  python3 _build/sync.py
Allt utanför markeringarna rörs inte. Mappen _build publiceras inte
(GitHub Pages hoppar över mappar som börjar med understreck).
"""
import pathlib
import re
import sys

ROT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROT / '_build' / 'partials'

DELAR = {
    'GEMENSAM-HEAD': 'head.html',
    'SIDHUVUD': 'header.html',
    'SIDFOT': 'footer.html',
}


def fyll(mall: str, sida: str) -> str:
    # 404-sidan visas på godtycklig adress, så den behöver absoluta sökvägar.
    if sida == '404.html':
        r, hem = '/', '/'
    else:
        r, hem = '', './'
    text = mall.replace('{R}', r).replace('{HEM}', hem)
    # Markera aktuell sida i menyn
    text = re.sub(
        r'(<a [^>]*data-sida="%s")' % re.escape(sida),
        r'\1 aria-current="page"',
        text,
    )
    return text


def main() -> int:
    sidor = sorted(ROT.glob('*.html'))
    andrade = 0
    for fil in sidor:
        html = fil.read_text(encoding='utf-8')
        ny = html
        for namn, partial in DELAR.items():
            monster = re.compile(
                r'(<!-- BW:%s START -->\n)(.*?)([ \t]*<!-- BW:%s SLUT -->)' % (namn, namn),
                re.S,
            )
            if not monster.search(ny):
                continue
            innehall = fyll((PARTIALS / partial).read_text(encoding='utf-8'), fil.name).rstrip('\n')
            ny = monster.sub(lambda m: m.group(1) + innehall + '\n    ' + m.group(3).strip(), ny)
        if ny != html:
            fil.write_text(ny, encoding='utf-8')
            andrade += 1
            print('uppdaterad:', fil.name)
    print(f'{andrade} av {len(sidor)} sidor uppdaterade.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
