import re,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
r=lambda f:open('src/'+f).read()
css=r('fonts.css')+r('style.css')
js='\n'.join(r(f) for f in ['config.js','core.js','parents.js','app.js'])
html=f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Calendário do xixi</title>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0D2340">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Calendário do xixi">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="robots" content="noindex,nofollow">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" href="icons/icon-192.png">
<link rel="preload" href="fonts/open-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<style>
{css}
</style></head><body>
<main id="app"></main>
<script>
{js}
</script></body></html>
'''
open('index.html','w').write(html)
v=re.search(r"APP_V='([^']+)'",js).group(1)
sw=open('src/sw.js').read().replace('__V__',v)
open('sw.js','w').write(sw)
print(len(html),'bytes; v',v)
