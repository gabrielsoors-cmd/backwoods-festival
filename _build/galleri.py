#!/usr/bin/env python3
"""
Bygger bildgalleriet på galleri.html och bildlistan i sitemap.xml.

Bilderna och deras alt-texter står i _build/galleri.json. Lägg till eller ta
bort en bild där och kör sedan:

    python3 _build/galleri.py

Skriptet skriver om allt mellan
    <!-- BW-GALLERI START -->  …  <!-- BW-GALLERI SLUT -->     i galleri.html
    <!-- BW-GALLERI-BILDER START --> … <!-- BW-GALLERI-BILDER SLUT -->  i sitemap.xml
Kräver Pillow (pip install pillow) för att läsa bildernas mått.
"""
import html
import json
import pathlib
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit('Pillow saknas: kör  pip install pillow')

ROT = pathlib.Path(__file__).resolve().parent.parent
FOTO = ROT / 'images' / 'foto'
DOMAN = 'https://backwoodsfestival.se/'


def storlekar(namn):
    """Returnerar [(bredd, höjd, sökväg)] för de webp-storlekar som finns."""
    ut = []
    for s in (800, 1600, 2400):
        fil = FOTO / f'{namn}-{s}.webp'
        if fil.exists():
            with Image.open(fil) as im:
                ut.append((im.width, im.height, f'images/foto/{fil.name}'))
    if not ut:
        sys.exit(f'Hittar inga filer för {namn} i images/foto/')
    return ut


def bild_html(b):
    s = storlekar(b['namn'])
    liten = s[0]
    stor = s[-1]
    srcset = ', '.join(f'{p} {w}w' for w, h, p in s[:2])
    alt = html.escape(b['alt'], quote=True)
    return (
        f'                    <a class="forstora" href="{stor[2]}" data-forstora>\n'
        f'                        <img src="{liten[2]}" srcset="{srcset}"\n'
        f'                             sizes="(min-width: 1000px) 370px, (min-width: 640px) 31vw, 50vw"\n'
        f'                             width="{liten[0]}" height="{liten[1]}" loading="lazy" decoding="async"\n'
        f'                             alt="{alt}">\n'
        f'                    </a>'
    )


def main():
    data = json.loads((ROT / '_build' / 'galleri.json').read_text(encoding='utf-8'))
    delar = []
    sitemap = []
    for i, g in enumerate(data['grupper']):
        klass = 'sektion galleri-grupp' + (' sektion--bark2' if i % 2 else '')
        bilder = '\n'.join(bild_html(b) for b in g['bilder'])
        delar.append(
            f'        <section class="{klass}" id="{g["id"]}" aria-labelledby="rubrik-{g["id"]}">\n'
            f'            <div class="matt">\n'
            f'                <h2 id="rubrik-{g["id"]}">{html.escape(g["rubrik"])}</h2>\n'
            f'                <p>{html.escape(g["text"])}</p>\n'
            f'                <div class="murverk">\n'
            f'{bilder}\n'
            f'                </div>\n'
            f'            </div>\n'
            f'        </section>'
        )
        for b in g['bilder']:
            stor = storlekar(b['namn'])[-1][2]
            sitemap.append(
                f'    <image:image><image:loc>{DOMAN}{stor}</image:loc></image:image>'
            )

    sida = ROT / 'galleri.html'
    text = sida.read_text(encoding='utf-8')
    ny = re.sub(
        r'(<!-- BW-GALLERI START[^>]*-->\n)(.*?)([ \t]*<!-- BW-GALLERI SLUT -->)',
        lambda m: m.group(1) + '\n\n'.join(delar) + '\n        ' + m.group(3).strip(),
        text, flags=re.S)
    sida.write_text(ny, encoding='utf-8')

    karta = ROT / 'sitemap.xml'
    xml = karta.read_text(encoding='utf-8')
    xml = re.sub(
        r'(<!-- BW-GALLERI-BILDER START -->\n)(.*?)([ \t]*<!-- BW-GALLERI-BILDER SLUT -->)',
        lambda m: m.group(1) + '\n'.join(sitemap) + '\n    ' + m.group(3).strip(),
        xml, flags=re.S)
    karta.write_text(xml, encoding='utf-8')

    antal = sum(len(g['bilder']) for g in data['grupper'])
    print(f'Galleriet uppdaterat: {antal} bilder i {len(data["grupper"])} grupper.')


if __name__ == '__main__':
    main()
