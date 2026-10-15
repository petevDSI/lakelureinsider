// Landing page for the "WANTED: Edmund" festival flyer QR code.
// Route: /edmund  (file location: src/app/edmund/page.tsx)
// Layout concept: the poster, continued. Cream paper, black ink, one barn-red accent,
// slab-serif headlines, typewriter "case file" details, then the story, then the shop.

import type { Metadata } from "next";
import Link from "next/link";
import { EdmundPeeks } from "@/components/EdmundPeeks";

export const metadata: Metadata = {
  title: "Edmund: How a Stray Goat Took Over Lake Lure | Lake Lure Insider",
  description:
    "The story of Edmund, the Kiko goat who wandered into Lake Lure and into everyone's heart. Read the whole story and get the shirt.",
  alternates: { canonical: "/edmund" },
  openGraph: {
    title: "WANTED: Edmund, Lake Lure's most wanted goat",
    description:
      "How a stray Kiko goat took over Lake Lure. The whole story, plus shirts, hats and stickers.",
    url: "/edmund",
    type: "article",
    images: ["/images/edmund-police-escort.jpg"],
  },
};

// Plain <img> on purpose: product mockups come from Shopify's CDN.
function Pic(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img loading="lazy" decoding="async" {...props} alt={props.alt ?? ""} />;
}

const CDN = "https://cdn.shopify.com/s/files/1/0999/2228/0768/files/";

const PRODUCTS = [
  {
    name: "Edmund for Mayor Vintage Badge Tee",
    price: "From $23.50",
    note: "The campaign badge. The one people asked for.",
    img: CDN + "unisex-classic-tee-sapphire-front-6a996552d0389.jpg?v=1788437866",
  },
  {
    name: "Lake Life. Goat Life. Heavyweight Tee",
    price: "From $28.50",
    note: "Edmund, chest-deep in the lake, Chimney Rock behind him.",
    img: CDN + "unisex-garment-dyed-heavyweight-t-shirt-berry-front-6a9ac69a7195e.jpg?v=1788528327",
  },
  {
    name: "100 Dam Years Edmund Goat Float Tee",
    price: "From $15.50",
    note: "Supervising the dam's 100th birthday from an inner tube.",
    img: CDN + "unisex-staple-t-shirt-heather-true-royal-front-6ab08dc021036.jpg?v=1789955544",
  },
  {
    name: "Chimney Rock Escape Artist Hoodie",
    price: "From $44.00",
    note: "Back print: “If they chase me, I run faster.”",
    img: CDN + "unisex-premium-pullover-hoodie-white-front-6a997f2571624.jpg?v=1788444471",
  },
  {
    name: "Edmund in Shades Dad Hat",
    price: "$18.50",
    note: "Sunglasses on. Ten colors.",
    img: CDN + "classic-dad-hat-navy-front-6a996b6db0555.jpg?v=1788439447",
  },
  {
    name: "Edmund in Shades Sticker",
    price: "From $3.00",
    note: "For the water bottle, the cooler, the truck.",
    img: CDN + "kiss-cut-stickers-white-3x3-default-6a9ac79a56912.jpg?v=1788528543",
  },
];

const CHAPTERS = [
  {
    label: "He showed up",
    body: "Edmund is a Kiko goat. This summer he wandered into a goat fence near the Rocky Broad River, across from Chimney Rock, and stayed. Nobody invited him. His previous herd-mates had reportedly been captured by Henderson County, which left him on his own.",
  },
  {
    label: "He took the road",
    body: "Then he took over a stretch of Highway 64/74A. Drivers slowed down, pulled over and took pictures, and the photos started landing in local Facebook groups. People began checking on him the way you check on a neighbor.",
  },
  {
    label: "He got a catchphrase",
    body: "Local videographer and muralist Andrea Martin posted a reel of Edmund set to “In the Air Tonight” under #FreeEdmund. It gave him his motto: Don’t fence me in.",
  },
  {
    label: "He ran for mayor",
    body: "A mock campaign graphic appeared in the Lake Lure Local Facebook group, and the replies asked for a T-shirt. Edmund for Mayor was on, with the slogan “A goat we can all get behind.”",
  },
  {
    label: "He’s still here",
    body: "He’s a goat who found a home among people who looked out for him. Proceeds from Edmund merchandise support his caretakers.",
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Special+Elite&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap');

.ed {
  --paper: #f3e9d2;
  --paper-2: #ebdfc3;
  --ink: #1b1712;
  --ink-soft: #4a4035;
  --red: #a8261b;
  --red-dark: #7f1b13;
  --rule: #1b1712;
  --display: 'Alfa Slab One', 'Rockwell', 'Georgia', serif;
  --type: 'Special Elite', 'Courier New', monospace;
  --body: 'Source Serif 4', 'Georgia', serif;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--body);
  font-size: 1.0625rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.ed *, .ed *::before, .ed *::after { box-sizing: border-box; }
.ed a { color: inherit; }
.ed :focus-visible { outline: 3px solid var(--red); outline-offset: 3px; }

.ed-wrap {
  max-width: 62rem;
  margin: 0 auto;
  padding-left: max(1rem, env(safe-area-inset-left, 0px));
  padding-right: max(1rem, env(safe-area-inset-right, 0px));
}

/* HERO */
.ed-hero { padding-block: 1.75rem 2.5rem; text-align: center; border-bottom: 4px double var(--rule); }
.ed-kicker {
  font-family: var(--type); text-transform: uppercase; letter-spacing: .18em;
  font-size: .8rem; color: var(--ink-soft); margin: 0 0 .75rem;
}
.ed-wanted {
  font-family: var(--display); color: var(--red); margin: 0;
  font-size: clamp(3.6rem, 19vw, 9rem); line-height: .95; letter-spacing: .01em;
}
.ed-most {
  font-family: var(--display); font-size: clamp(.95rem, 3.6vw, 1.5rem);
  letter-spacing: .08em; text-transform: uppercase; margin: .5rem 0 1.25rem;
}
.ed-frame {
  margin: 0 auto; max-width: 38rem; border: 6px solid var(--ink);
  background: var(--ink); position: relative;
}
.ed-frame img { display: block; width: 100%; height: auto; max-height: 28rem; object-fit: cover; filter: sepia(.35) contrast(1.05); }
.ed-nameplate {
  background: var(--ink); color: var(--paper); font-family: var(--display);
  font-size: clamp(2rem, 9vw, 3.25rem); line-height: 1; padding: .5rem 0 .6rem; letter-spacing: .04em;
}
.ed-credit { font-family: var(--type); font-size: .72rem; color: var(--ink-soft); margin: .5rem 0 0; }
.ed-tagline { font-family: var(--type); font-size: 1.1rem; margin: 1rem 0 0; }
.ed-h1 {
  font-family: var(--body); font-weight: 600; font-size: clamp(1.25rem, 4.4vw, 1.75rem);
  line-height: 1.25; max-width: 30rem; margin: 1.5rem auto 0; text-wrap: balance;
}
.ed-cta-row { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; margin-top: 1.5rem; }
.ed-btn {
  display: inline-block; font-family: var(--display); text-decoration: none; text-transform: uppercase;
  letter-spacing: .06em; font-size: 1rem; padding: .85rem 1.4rem; border: 3px solid var(--ink);
  background: var(--red); color: #fff5e6; box-shadow: 4px 4px 0 var(--ink);
  transition: transform .12s ease, box-shadow .12s ease;
}
.ed-btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.ed-btn.alt { background: var(--paper); color: var(--ink); }

/* CASE FILE */
.ed-file { padding-block: 2rem; border-bottom: 1px solid var(--rule); }
.ed-file dl { margin: 0 auto; max-width: 40rem; font-family: var(--type); display: grid; gap: .6rem; }
.ed-file .row { display: grid; grid-template-columns: minmax(0, 11rem) minmax(0, 1fr); gap: 1rem; }
.ed-file dt { font-family: var(--display); font-size: .8rem; letter-spacing: .06em; text-transform: uppercase; padding-top: .15rem; }
.ed-file dd { margin: 0; min-width: 0; }
.ed-reward {
  font-family: var(--display); color: var(--red); text-align: center;
  font-size: clamp(1.6rem, 6.5vw, 2.75rem); margin: 1.75rem 0 0; padding-block: .75rem;
  border-top: 3px solid var(--ink); border-bottom: 3px solid var(--ink);
}

/* STORY */
.ed-story { padding-block: 3rem; }
.ed-h2 { font-family: var(--display); font-size: clamp(1.7rem, 6vw, 2.5rem); line-height: 1.1; margin: 0 0 .5rem; text-wrap: balance; }
.ed-lede { color: var(--ink-soft); max-width: 36rem; margin: 0 0 2rem; }
.ed-chapters { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; max-width: 40rem; }
.ed-chapters li { display: grid; grid-template-columns: 1.25rem minmax(0, 1fr); gap: 1rem; position: relative; padding-bottom: 1.75rem; }
.ed-chapters li::before { content: ""; width: .85rem; height: .85rem; background: var(--red); border: 2px solid var(--ink); border-radius: 50%; margin-top: .45rem; z-index: 1; }
.ed-chapters li::after { content: ""; position: absolute; left: .5rem; top: 1.3rem; bottom: 0; width: 2px; background: var(--ink); opacity: .5; }
.ed-chapters li:last-child::after { display: none; }
.ed-chapters h3 { font-family: var(--display); font-size: 1.15rem; margin: 0 0 .25rem; }
.ed-chapters p { margin: 0; }

/* MOTTO BAND */
.ed-motto { background: var(--ink); color: var(--paper); text-align: center; padding-block: 3rem; }
.ed-motto p { margin: 0; }
.ed-motto .big { font-family: var(--display); font-size: clamp(2rem, 9vw, 4.5rem); line-height: 1.05; text-wrap: balance; }
.ed-motto .big em { color: #e0594a; font-style: normal; }
.ed-motto .small { font-family: var(--type); font-size: .85rem; letter-spacing: .12em; text-transform: uppercase; margin-top: 1rem; opacity: .85; }

/* SHOP */
.ed-shop { padding-block: 3rem; }
.ed-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); margin-top: 1.5rem; }
.ed-card { display: flex; flex-direction: column; background: var(--paper-2); border: 2px solid var(--ink); text-decoration: none; min-width: 0; }
.ed-card .ph { aspect-ratio: 1 / 1; background: #fff; border-bottom: 2px solid var(--ink); overflow: hidden; }
.ed-card .ph img { width: 100%; height: 100%; object-fit: contain; display: block; }
.ed-card .info { padding: .9rem 1rem 1.1rem; display: flex; flex-direction: column; gap: .3rem; flex: 1; }
.ed-card h3 { font-family: var(--display); font-size: 1.05rem; line-height: 1.2; margin: 0; }
.ed-card .price { font-family: var(--type); color: var(--red-dark); }
.ed-card .note { font-size: .95rem; color: var(--ink-soft); margin: 0; }
.ed-card:hover h3 { text-decoration: underline; text-decoration-thickness: 2px; }
.ed-shopcta { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.5rem; margin-top: 2rem; }
.ed-caretakers { font-family: var(--type); margin: 0; max-width: 28rem; }

/* HERD / MORE */
.ed-more { padding-block: 2.5rem 3.5rem; border-top: 4px double var(--rule); }
.ed-more ul { list-style: none; padding: 0; margin: 1rem 0 0; display: grid; gap: .6rem; font-family: var(--type); }
.ed-more a { text-decoration-thickness: 2px; text-underline-offset: 3px; }
.ed-fine { font-size: .85rem; color: var(--ink-soft); margin: 2rem 0 0; max-width: 40rem; }

/* WHERE TO FIND HIM */
.ed-spot { padding-block: 0 3rem; }
.ed-spot p { max-width: 40rem; margin: 0 0 1rem; }
.ed-chips { list-style: none; margin: 1.25rem 0 1.5rem; padding: 0; display: flex; flex-wrap: wrap; gap: .5rem; }
.ed-chips li { font-family: var(--type); font-size: .95rem; border: 2px solid var(--ink); padding: .3rem .7rem; background: var(--paper-2); }
.ed-safe { font-family: var(--type); border-left: 4px solid var(--red); padding-left: 1rem; }

@media (max-width: 30rem) {
  .ed-file .row { grid-template-columns: minmax(0, 1fr); gap: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ed-btn { transition: none; }
}
`;

export default function EdmundPage() {
  return (
    <main className="ed">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <EdmundPeeks />

      {/* HERO: continues the poster */}
      <header className="ed-hero">
        <div className="ed-wrap">
          <p className="ed-kicker">Lake Lure Insider presents</p>
          <h1 className="ed-wanted" aria-label="Wanted">WANTED</h1>
          <p className="ed-most">Lake Lure&rsquo;s most wanted</p>

          <figure style={{ margin: 0 }}>
            <div className="ed-frame">
              <Pic
                src="/images/edmund-police-escort.jpg"
                alt="Edmund the goat trotting down a Lake Lure road with a police car, lights flashing, following behind him"
                width={1451}
                height={1084}
                loading="eager"
              />
              <div className="ed-nameplate">EDMUND.</div>
            </div>
          </figure>

          <p className="ed-tagline">Kiko goat. Answers to nothing.</p>
          <p className="ed-h1">How a stray goat took over Lake Lure.</p>

          <div className="ed-cta-row">
            <a className="ed-btn" href="#story">Read the story</a>
            <a className="ed-btn alt" href="#shop">Get the shirt</a>
          </div>
        </div>
      </header>

      {/* CASE FILE: the poster's charges, now with the facts behind them */}
      <section className="ed-file" aria-label="Case file">
        <div className="ed-wrap">
          <dl>
            <div className="row">
              <dt>Wanted for</dt>
              <dd>Stealing the heart of an entire lake town.</dd>
            </div>
            <div className="row">
              <dt>Last seen</dt>
              <dd>On the road between Lake Lure and Bat Cave, through Chimney Rock. Eating kudzu. Climbing steps.</dd>
            </div>
            <div className="row">
              <dt>Known associates</dt>
              <dd>Everyone who stopped to take his picture.</dd>
            </div>
            <div className="row">
              <dt>Warning</dt>
              <dd>Considered adorable and dangerous to your wallet.</dd>
            </div>
          </dl>
          <p className="ed-reward">REWARD: The whole story.</p>
        </div>
      </section>

      {/* STORY */}
      <section className="ed-story" id="story" aria-labelledby="story-h">
        <div className="ed-wrap">
          <h2 className="ed-h2" id="story-h">The whole story</h2>
          <p className="ed-lede">
            Here is how a goat nobody planned for became the most talked-about resident of the Hickory Nut Gorge.
          </p>
          <ol className="ed-chapters">
            {CHAPTERS.map((c) => (
              <li key={c.label}>
                <div>
                  <h3>{c.label}</h3>
                  <p>{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHERE TO FIND HIM */}
      <section className="ed-spot" aria-labelledby="spot-h">
        <div className="ed-wrap">
          <h2 className="ed-h2" id="spot-h">Where to find Edmund</h2>
          <p>
            Edmund roams the road between Lake Lure and Bat Cave, right through Chimney Rock. Most days he is out wandering the road, eating kudzu, climbing steps and doing all the other things goats do.
          </p>
          <ul className="ed-chips">
            <li>Wandering the road</li>
            <li>Eating kudzu</li>
            <li>Climbing steps</li>
            <li>Perching on rocks</li>
            <li>Ignoring fences</li>
          </ul>
          <p className="ed-safe">
            Spot him from a safe place. Pull all the way off the road, keep your distance, and please don&rsquo;t feed him. He answers to nothing, so there are no guarantees.
          </p>
        </div>
      </section>

      {/* MOTTO */}
      <section className="ed-motto" aria-label="Edmund's motto">
        <div className="ed-wrap">
          <p className="big">
            Don&rsquo;t <em>fence</em> me in.
          </p>
          <p className="small">Edmund&rsquo;s unofficial motto &middot; #DontFenceMeIn</p>
        </div>
      </section>

      {/* SHOP */}
      <section className="ed-shop" id="shop" aria-labelledby="shop-h">
        <div className="ed-wrap">
          <h2 className="ed-h2" id="shop-h">Take a piece of Edmund home</h2>
          <p className="ed-lede">
            Shirts, a hoodie, a hat and stickers, all designed here in Lake Lure. Every item is printed on demand and shipped to you.
          </p>

          <div className="ed-grid">
            {PRODUCTS.map((p) => (
              <Link className="ed-card" key={p.name} href="/shop">
                <div className="ph">
                  <Pic src={p.img} alt={p.name} width={600} height={600} />
                </div>
                <div className="info">
                  <h3>{p.name}</h3>
                  <span className="price">{p.price}</span>
                  <p className="note">{p.note}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="ed-shopcta">
            <Link className="ed-btn" href="/shop">See everything in the shop</Link>
            <p className="ed-caretakers">Proceeds from Edmund merchandise support his caretakers.</p>
          </div>
        </div>
      </section>

      {/* MORE */}
      <section className="ed-more" aria-labelledby="more-h">
        <div className="ed-wrap">
          <h2 className="ed-h2" id="more-h">Keep up with Edmund</h2>
          <ul>
            <li>
              <Link href="/edmund-for-mayor">&rarr; Read his campaign platform and join the herd</Link>
            </li>
            <li>
              <Link href="/news/edmund-goat-mayor">&rarr; Read the full news story</Link>
            </li>
            <li>
              <Link href="/">&rarr; More from Lake Lure Insider</Link>
            </li>
          </ul>
          <p className="ed-fine">
            Lake Lure Insider is an independent local news and tourism site covering Lake Lure and Chimney Rock, North Carolina. Edmund for Mayor is a joke the whole town is in on.
          </p>
        </div>
      </section>
    </main>
  );
}
