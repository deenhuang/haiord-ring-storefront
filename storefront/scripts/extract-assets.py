from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'public' / 'assets'
root.mkdir(parents=True, exist_ok=True)
regions = {
    'gold-ring': (1, (.03, .427, .232, .585)),
    'silver-ring': (1, (.22, .49, .425, .69)),
    'ring-detail': (1, (.795, .079, .985, .196)),
    'wearing': (1, (.503, .345, .716, .618)),
    'sleep': (2, (.503, .123, .997, .425)),
    'running': (3, (.013, .318, .244, .585)),
    'cycling': (3, (.256, .369, .491, .548)),
    'app': (3, (.561, .035, .934, .23)),
    'swimming': (3, (.564, .66, .937, .855)),
    'charging-case': (4, (.049, .181, .247, .316)),
    'gunmetal-ring': (4, (.527, .478, .746, .641)),
    'rose-ring': (4, (.790, .520, .997, .670)),
    'finishes': (4, (.059, .741, .246, .855)),
    'collection': (4, (.502, .279, .997, .699)),
}
for name, (page, box) in regions.items():
    source = Image.open(f'/tmp/noor-hi-{page}.png').convert('RGB')
    w, h = source.size
    crop = source.crop(tuple(int(n * (w if i % 2 == 0 else h)) for i, n in enumerate(box)))
    crop.save(root / f'{name}.webp', quality=94)
    print(name, crop.size)
