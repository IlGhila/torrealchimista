# Fasce di sfondo

Generate da `background.png` (3764x6688) con ffmpeg.

| fascia     | y iniziale | altezza | sezione      |
|------------|-----------:|--------:|--------------|
| hero       |          0 |    2040 | Home         |
| band       |       2040 |    1125 | La band      |
| disco      |       3165 |    1195 | Discografia  |
| concerti   |       4360 |     834 | Concerti     |
| media      |       5194 |     758 | Media        |
| contatti   |       5952 |     736 | Contatti     |

Per rigenerarle:

```sh
slice () {   # $1 nome  $2 y  $3 altezza
  ffmpeg -y -i background.png -vf "crop=3764:$3:0:$2,scale=2400:-1:flags=lanczos" -q:v 80 "assets/bg/$1-2x.webp"
  ffmpeg -y -i background.png -vf "crop=3764:$3:0:$2,scale=1400:-1:flags=lanczos" -q:v 80 "assets/bg/$1-1x.webp"
}
slice hero 0 2040 ; slice band 2040 1125 ; slice disco 3165 1195
slice concerti 4360 834 ; slice media 5194 758 ; slice contatti 5952 736
```

I colori piatti usati come base delle sezioni sono campionati dalle fasce
stesse e stanno in `assets/css/style.css` (`--blu-hero`, `--crema-band`, ecc.).
