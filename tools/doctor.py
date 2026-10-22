#!/usr/bin/env python3
"""Проверка окружения для сборки презентаций Акрихин.

    python3 tools/doctor.py

Печатает по каждому компоненту OK / НЕТ и как поставить. Код выхода 1, если не хватает обязательного.
Обязательное: node ≥ 18 и пакеты npm, python3 с python-pptx / lxml / Pillow, LibreOffice (soffice), pdftoppm (poppler),
unzip, шрифт Tahoma. Желательное: ffprobe (ffmpeg) — для дек с видео.
"""
import glob, importlib, json, os, platform, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAC = platform.system() == 'Darwin'
LINUX = platform.system() == 'Linux'
problems = 0


def say(ok, name, detail='', hint='', required=True):
    global problems
    mark = 'OK ' if ok else ('НЕТ' if required else 'нет')
    print(f'[{mark}] {name}' + (f' — {detail}' if detail else ''))
    if not ok:
        if required:
            problems += 1
        if hint:
            print(f'       → {hint}')


def ver(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=30).stdout.strip().splitlines()[0]
    except Exception:  # noqa: BLE001
        return ''


def soffice_path():
    for p in [os.environ.get('SOFFICE'), shutil.which('soffice'), shutil.which('libreoffice'),
              '/Applications/LibreOffice.app/Contents/MacOS/soffice']:
        if p and os.path.exists(p):
            return p
    return None


def has_tahoma():
    paths = ['/System/Library/Fonts/Supplemental/Tahoma.ttf', '/Library/Fonts/Tahoma.ttf',
             os.path.expanduser('~/Library/Fonts/Tahoma.ttf'), 'C:/Windows/Fonts/tahoma.ttf']
    if any(os.path.exists(p) for p in paths):
        return True
    if shutil.which('fc-list'):
        out = subprocess.run(['fc-list'], capture_output=True, text=True).stdout.lower()
        return 'tahoma' in out
    return bool(glob.glob('/usr/share/fonts/**/[Tt]ahoma*.ttf', recursive=True))


def main():
    print(f'Корень проекта: {ROOT}')
    brew = 'brew install' if MAC else ('sudo apt install' if LINUX else 'установите')

    node = ver(['node', '--version'])
    ok = bool(node) and int(node.lstrip('v').split('.')[0]) >= 18
    say(ok, 'node ≥ 18', node or 'не найден', f'{brew} node')
    pkg = os.path.join(ROOT, 'node_modules', 'pptxgenjs', 'package.json')
    say(os.path.exists(pkg), 'npm-пакеты (pptxgenjs, sharp, react-icons)',
        json.load(open(pkg))['version'] if os.path.exists(pkg) else 'не установлены', 'npm ci  (в корне проекта)')

    say(sys.version_info >= (3, 9), 'python ≥ 3.9', platform.python_version(), 'поставьте python3')
    for mod, pipname in [('pptx', 'python-pptx'), ('lxml', 'lxml'), ('PIL', 'Pillow')]:
        try:
            m = importlib.import_module(mod)
            say(True, f'python: {pipname}', getattr(m, '__version__', ''))
        except ImportError:
            say(False, f'python: {pipname}', 'не установлен', 'python3 -m pip install --user -r requirements.txt')

    so = soffice_path()
    say(bool(so), 'LibreOffice (soffice) — рендер слайдов в PNG', so or 'не найден',
        'brew install --cask libreoffice' if MAC else f'{brew} libreoffice  (или SOFFICE=/путь/к/soffice)')
    say(bool(shutil.which('pdftoppm')), 'pdftoppm (poppler)', shutil.which('pdftoppm') or 'не найден',
        f'{brew} poppler' if MAC else f'{brew} poppler-utils')
    say(bool(shutil.which('unzip')), 'unzip', shutil.which('unzip') or 'не найден', f'{brew} unzip')
    say(has_tahoma(), 'шрифт Tahoma', '' if has_tahoma() else 'не найден',
        'на macOS и Windows есть из коробки; на Linux: поставьте ttf-mscorefonts или скопируйте tahoma.ttf/tahomabd.ttf в ~/.fonts')
    say(bool(shutil.which('ffprobe')), 'ffprobe (ffmpeg) — разведка видео в исходниках', shutil.which('ffprobe') or 'не найден',
        f'{brew} ffmpeg', required=False)

    lp = os.path.join(ROOT, 'local.json')
    out = json.load(open(lp)).get('outDir', 'output') if os.path.exists(lp) else 'output'
    print(f'Готовые деки: {os.path.abspath(os.path.join(ROOT, out))}  (local.json → outDir)')

    for home, name in [(os.environ.get('CODEX_HOME', os.path.expanduser('~/.codex')), 'Codex'),
                       (os.path.expanduser('~/.claude'), 'Claude')]:
        sk = os.path.join(home, 'skills', 'akrikhin-brand-deck', 'SKILL.md')
        if os.path.exists(sk):
            txt = open(sk, encoding='utf-8').read()
            say(ROOT in txt, f'скилл для {name}', sk if ROOT in txt else 'указывает на другую папку проекта',
                './install.sh  (переустановит скилл с этим корнем)', required=False)

    print('\nВсё готово.' if not problems else f'\nНе хватает обязательного: {problems}. Поставьте и запустите проверку снова.')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
