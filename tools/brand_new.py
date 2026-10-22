#!/usr/bin/env python3
"""Заготовка новой деки стратегии бренда Акрихин.

    python3 tools/brand_new.py <slug> <путь к исходному .pptx> [--name "Latin Name"] [--file Имя_файла]

Подходит для любой деки, не только стратегий брендов: slug — латинское имя папки (decks/brands/<slug>),
--name — заголовок обложки, --file — имя готового файла без _RU/_EN (по умолчанию Akrikhin_OMD_Strategy_<Name>_2027).

Делает:
  1. work/brands/<brand>/source.pptx  — копия исходника;
  2. work/brands/<brand>/src/         — выгрузка tools/extract_deck.py (тексты, данные графиков, media/) + рендер
                                         исходника slide-NN.png (скрытые слайды тоже, через копию без show="0");
  3. decks/brands/<brand>/brand.json  — name / file / slides / source;
  4. decks/brands/<brand>/common.js   — помощники части (video: mp4/avi из source.pptx побайтно, stageTag);
  5. печатает разведку: скрытые слайды, видео (файл, обложка, позиция, обрезка, размер кадра),
     слайды-картинки во весь слайд, метки этапов у левого края — для work/brands/<brand>/TASK.md.
"""
import argparse, os, re, shutil, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMU_TO_PX = 1920 / 12192000


def slide_order(z):
    pres = z.read('ppt/presentation.xml').decode()
    rels = z.read('ppt/_rels/presentation.xml.rels').decode()
    ids = re.findall(r'<p:sldId [^>]*r:id="(rId\d+)"', pres)
    m = {}
    for a, b in re.findall(r'Id="(rId\d+)"[^>]*Target="slides/(slide\d+)\.xml"', rels):
        m[a] = b
    for b, a in re.findall(r'Target="slides/(slide\d+)\.xml"[^>]*Id="(rId\d+)"', rels):
        m[a] = b
    return [m[i] for i in ids]


def media_rels(z, slide):
    r = z.read(f'ppt/slides/_rels/{slide}.xml.rels').decode()
    rels = {}
    for a, b in re.findall(r'Id="(rId\d+)"[^>]*Target="\.\./media/([^"]+)"', r):
        rels[a] = b
    for b, a in re.findall(r'Target="\.\./media/([^"]+)"[^>]*Id="(rId\d+)"', r):
        rels[a] = b
    return rels


def probe(path):
    try:
        out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                              'stream=width,height:format=duration', '-of', 'csv=p=0', path],
                             capture_output=True, text=True).stdout.split()
        return ' '.join(out)
    except FileNotFoundError:
        return '(ffprobe не найден)'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('brand', help='латинский slug, например azelik')
    ap.add_argument('source', help='исходный .pptx')
    ap.add_argument('--name', help='название бренда латиницей для обложки и имени файла (по умолчанию — из slug)')
    ap.add_argument('--file', help='имя готового файла без _RU/_EN (по умолчанию Akrikhin_OMD_Strategy_<Name>_2027)')
    a = ap.parse_args()

    brand = a.brand
    name = a.name or brand.capitalize()
    W = os.path.join(ROOT, 'work', 'brands', brand)
    D = os.path.join(ROOT, 'decks', 'brands', brand)
    os.makedirs(W, exist_ok=True)
    os.makedirs(D, exist_ok=True)
    src_pptx = os.path.join(W, 'source.pptx')
    shutil.copyfile(a.source, src_pptx)

    # 2. выгрузка и рендер исходника (со скрытыми слайдами)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'extract_deck.py'), src_pptx, os.path.join(W, 'src')],
                   check=True, stdout=subprocess.DEVNULL)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'deck_render.py'), src_pptx, '--name', f'{brand}_src'],
                   check=True, stdout=subprocess.DEVNULL)
    rdir = os.path.join(ROOT, 'out', 'render', f'{brand}_src')
    for f in sorted(os.listdir(rdir)):
        if f.endswith('.png'):
            shutil.copyfile(os.path.join(rdir, f), os.path.join(W, 'src', f))

    z = zipfile.ZipFile(src_pptx)
    order = slide_order(z)

    # 3. brand.json (не перезаписываем, если уже есть)
    file_base = a.file or f"Akrikhin_OMD_Strategy_{name.replace(' ', '_')}_2027"
    bj = os.path.join(D, 'brand.json')
    if not os.path.exists(bj):
      with open(bj, 'w', encoding='utf-8') as fh:
        fh.write('{ "name": "%s", "file": "%s", "slides": %d, "source": "work/brands/%s/source.pptx" }\n'
                 % (name, file_base, len(order), brand))

    # 4. common.js из шаблона
    tpl = open(os.path.join(ROOT, 'decks', 'brands', '_template', 'common.js'), encoding='utf-8').read()
    common = os.path.join(D, 'common.js')
    if not os.path.exists(common):
        open(common, 'w', encoding='utf-8').write(tpl.replace('__BRAND__', brand).replace('__NAME__', name))

    # 5. разведка
    print(f'Дека: {name} ({brand}), слайдов: {len(order)}')
    print(f'brand.json → file: {file_base}_RU.pptx / _EN.pptx')
    hidden, videos, full, stages = [], [], [], {}
    os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
    tmp = os.path.join(ROOT, 'out', f'.probe_{brand}')
    for i, s in enumerate(order, 1):
        x = z.read(f'ppt/slides/{s}.xml').decode()
        if 'show="0"' in x[:800]:
            hidden.append(i)
        rels = media_rels(z, s)
        for mm in re.finditer(r'<p:pic>.*?</p:pic>', x, re.S):
            sp = mm.group(0)
            if 'videoFile' in sp:
                nm = re.search(r'name="([^"]*)"', sp).group(1)
                emb = re.search(r'p14:media[^>]*r:embed="(rId\d+)"', sp)
                blip = re.search(r'<a:blip r:embed="(rId\d+)"', sp)
                off = re.search(r'<a:off x="(-?\d+)" y="(-?\d+)"/><a:ext cx="(\d+)" cy="(\d+)"', sp)
                X, Y, Wd, H = [round(int(v) * EMU_TO_PX) for v in off.groups()]
                crop = re.search(r'<a:srcRect([^>]*)/>', sp)
                media = rels.get(emb.group(1)) if emb else None
                info = ''
                if media:
                    open(tmp, 'wb').write(z.read('ppt/media/' + media))
                    info = probe(tmp)
                videos.append((i, nm, media, rels.get(blip.group(1)) if blip else None, f'{X},{Y} {Wd}x{H}',
                               crop.group(1).strip() if crop else '', info))
            off = re.search(r'<a:off x="(-?\d+)" y="(-?\d+)"/><a:ext cx="(\d+)" cy="(\d+)"', sp)
            if off and 'videoFile' not in sp:
                Wd, H = round(int(off.group(3)) * EMU_TO_PX), round(int(off.group(4)) * EMU_TO_PX)
                if Wd >= 1800 and H >= 950:
                    full.append(i)
        # метка этапа: короткая надпись КАПСОМ латиницей в текстовом поле, начинающемся левее слайда (x < 0)
        for sp in re.findall(r'<p:sp>.*?</p:sp>', x, re.S):
            off = re.search(r'<a:off x="(-?\d+)"', sp)
            txt = ' '.join(re.findall(r'<a:t>([^<]+)</a:t>', sp)).strip()
            if off and int(off.group(1)) < 0 and re.fullmatch(r'[A-Z][A-Z &;]{2,28}', txt):
                stages[i] = txt.replace('&amp;', '&')
    if os.path.exists(tmp):
        os.remove(tmp)
    print('Скрытые слайды:', hidden or 'нет')
    print('Слайды-картинки во весь слайд:', sorted(set(full)) or 'нет')
    if stages:
        print('Метки у левого края (этапы?):', ', '.join(f'{k}: {v}' for k, v in stages.items()))
    if videos:
        print('Видео (слайд · имя · файл · обложка · позиция px · обрезка · кадр/длительность):')
        for v in videos:
            print('  ', ' · '.join(str(t) for t in v))
    else:
        print('Видео: нет')
    print(f'\nДальше: work/brands/{brand}/TASK.md по шаблону work/brands/TASK_TEMPLATE.md, затем части decks/brands/{brand}/part_*.js')


if __name__ == '__main__':
    main()
