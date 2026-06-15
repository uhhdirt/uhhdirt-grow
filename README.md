# UHH DIRT — site

A flood of memory disguised as consumable art. This repo holds the three reference
pages that define the look and behavior of the site. Treat them as the **style guide /
model** — new issue pages and sections get built from these.

## Structure

```
uhhdirt/
├── index.html                  # the Compaq "door" → home (map + bookshelf + nav)
├── donate.html                 # donate page
├── issues/
│   └── 001-he-no-here.html     # Issue 001 — He No Here (the issue-page template)
├── assets/
│   └── img/
│       └── he-no-here-label.jpg  # cropped hero art (see note below)
└── README.md
```

## Preview locally

Open `index.html` in a browser, or run a tiny static server from the repo root:

```
python3 -m http.server 8000     # then visit http://localhost:8000
```

Click the Compaq to enter. Nav links cross-connect (`Home`, `Donate`, and the
`Issue 001` book-spine all work). `About` and `Dig In The Dirt` are stubs (`#`) until
those sections exist — Dig In The Dirt will point at the grow tracker.

## The three pages

- **index.html** — Page 1 is the Compaq door (black, click to enter, no nav). Click
  boots you into the home view: black, a placeholder map rectangle dead center, the
  persistent section nav top-right, and the releases shelved bottom-left as vertical
  book-spines. Arriving at `index.html#home` skips the door.
- **issues/001-he-no-here.html** — full-screen label-art hero → scroll past the break
  into a still, elegant essay reading space. The red "Is it good?" bookmark tab on the
  right edge expands to the Main Source verdict.
- **donate.html** — same reading motif. Donate box up top, Paul's blurb below.

## Conventions (the actual style guide)

**Tone.** Crude on purpose up top, elegant and still below. The contrast is the point.
True-to-source beats polished.

**Copy.** Paul writes ALL copy — essays, verdicts, blurbs, headlines. Empty slots in the
markup are marked with `[ brackets ]`. Don't fill them with invented voice.

**Color (Issue 001 theme).**
- yellow `#F4C91B`, label red `#E8332B` / compaq red `#c0202e`, cyan `#4FC3DD`
- paper `#F3F2ED`, ink `#1a1714`, void `#0c0c0d`, bone `#d8d4c8`
- Each issue carries its *own* art theme; the book-spine box + text color match it
  (001 = yellow box / red text).

**Type.** Condensed display (`Arial Narrow`/Impact stack), monospace for labels/nav,
an elegant serif (`Iowan/Palatino/Georgia` stack) for reading.

**Navigation.** Persistent section nav (`Home · About · Dig In The Dirt · Donate`),
top-right, on every real page. Color adapts to the background (dark on light pages,
bone on black). The Compaq door is the only page with no nav.

**Home = a bookshelf.** Issues are vertical book-spines laid out in a horizontal row,
growing over time. The map sits center and must never overlap the shelf.

**Issue page.** Hero art + strain only (no descriptor text). Strain genetics sit on
their own line so spillover aligns under the first strain name. The Main Source verdict
is a collapsible red bookmark tab on the right edge — tab CTA stays consistent across
issues ("Is it good?"), the panel body holds the unique per-issue verdict.

**Restraint.** Flat, still, generous negative space. Motion is reserved (the Compaq
boot; a tabled flood interaction). No gratuitous animation.

## Notes / TODO

- The hero image is cropped from Sarah's flattened label mockup. Replace with a clean
  exported art file (ideally the figure on transparent) when available.
- The Venmo link (`donate.html`) points to `venmo.com/u/paulwalkercares` — confirm it
  resolves to the right profile.
- `About` and a real `Dig In The Dirt` (grow tracker) page still to come.
- Persistence is per-page right now; a shared CSS/token file is a sensible refactor once
  the page set stabilizes.

Artwork by @sarahleegrillo · created by Dave Ellis (RIP), Stephen Ellis and Matt Franklin,
with help from Pete Wolff, 1997, NJ.
