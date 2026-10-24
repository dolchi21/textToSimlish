# @dolchi21/texttosimlish

Convierte texto en voz sintetizada con sonido estilo Simlish usando Web Audio API.

## Instalación

```sh
npm install @dolchi21/texttosimlish
```

## Uso

```js
const { textToSimlish, stopSimlish } = require("@dolchi21/texttosimlish");

textToSimlish("Hello, how are you?");

// Para detener la reproducción actual:
stopSimlish();
```

`textToSimlish` devuelve una promesa y requiere un navegador con `AudioContext`.
Invócala como respuesta a una interacción del usuario para que el navegador
permita iniciar la reproducción de audio.