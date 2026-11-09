# Vídeo promocional do Loveflix

`loveflix-promo.mp4` — 24 s, vertical 1080×1920 (Reels, Stories, TikTok, Status do WhatsApp), 30 fps, com trilha.

Roteiro: conversa do "tanto faz" → "Chega de tanto faz" → passo 1 (escolher opções no app) → passo 2 (sorteio) → passo 3 (compartilhar o pôster) → chamada final.

## Como regenerar

Com o app rodando em `http://localhost:3123` (`npm run build && npx next start -p 3123`), dentro desta pasta:

```bash
node capture.js "$PWD/assets"        # captura telas reais do app
node render.js "$PWD" frames         # renderiza 720 quadros a partir de promo.html
python3 music.py music.wav           # sintetiza a trilha (numpy)
ffmpeg -framerate 30 -i frames/f%04d.jpg -i music.wav -c:v libx264 -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart loveflix-promo.mp4
```
