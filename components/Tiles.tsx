/* eslint-disable @next/next/no-img-element */
const INTRO_TILES = ["/tiles/code.webp", "/tiles/atom.webp", "/tiles/touch.webp", "/tiles/rocket.webp"];

export function LetterTile({ letter, tone }: { letter: string; tone: "blue" | "black" }) {
  return (
    <span className="letter-tile" data-letter={letter}>
      <span className={`letter-face letter-face--${tone}`}>
        <img className="tile-img" src={`/tiles/${letter.toLowerCase()}.webp`} alt="" draggable={false} />
      </span>
    </span>
  );
}

/** The four sculpted tiles that live inside the intro sentence. */
export function IntroTile({ index, name }: { index: 0 | 1 | 2 | 3; name: string }) {
  return (
    <span className={`intro-tile intro-tile--img${index % 2 ? " intro-tile--tilt" : ""}`} title={name}>
      <img className="tile-img" src={INTRO_TILES[index]} alt="" draggable={false} />
    </span>
  );
}
