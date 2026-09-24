# ffmpeg 9:16 (optional)

After recording a window capture:

```
ffmpeg -i raw.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -r 30 -c:v libx264 -pix_fmt yuv420p -an blobtide-reel.mp4
```

Keep clips under 20 seconds. No voiceover required; gate numbers are the hook.
