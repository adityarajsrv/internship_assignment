# Beliv8 Recreation - Remotion Video Template

Original reference video : [https://in.pinterest.com/pin/897623769505756366/](https://in.pinterest.com/pin/965811082605963960/)

A pixel-accurate Remotion recreation of the **"beliv8"** motion-graphics template
(an automated workflow-builder demo: *Initial Outreach → Wait for 5 days →
Responded / Didn't Respond → follow-up emails → Renewals*), built as part of
the video-template technical assignment.

The goal was to match the reference video as closely as possible - layout,
typography, motion timing, easing, colors, icons, and small interaction
details (an AI-style "select → erase → retype" text edit, a magic-wand badge
with sparkles, a camera that pans/zooms through the scene like a Whimsical/Miro
demo, and a page-flip close on the final overview card).

## What's in this project

```
src/
  Root.tsx          registers the composition (id, duration, fps, dimensions)
  template.tsx       the entire recreation - camera system, icons, connectors,
                      email cards, edit animation, and the final CTA beat
package.json
remotion.config.ts
```

Everything is self-contained inside `template.tsx` - no external image/font
assets are used. All icons (paper plane, envelope, clock, check, X, magic
wand, text cursor, mouse cursor) are hand-drawn inline SVG, and the typeface
is loaded via `@remotion/google-fonts/Quicksand`.

## How it's built

- **A virtual camera** (`camKeyframes`) pans and zooms across a single fixed
  "world" of absolutely-positioned elements, rather than repositioning each
  element per scene - this is what gives the push-in/pull-back feel of the
  reference instead of a flat slideshow.
- **Every node/pill/card animates in with a spring**, not a linear tween, for
  the soft pop-in feel throughout.
- **Text reveals character-by-character** rather than fading in as whole
  lines, including a scripted "select the wrong word → erase it → retype the
  right one, highlighted in green" moment inside one of the follow-up email
  cards, with a custom blinking I-beam cursor tracking the edit.
- **Connectors are hand-drawn SVG paths** (not straight `<div>` borders) that
  draw themselves on with `strokeDashoffset`, including a proper forked
  branch (`ForkConnector`) for the Responded / Didn't Respond split.
- **The closing beat** pulls the camera back to reveal the whole flow inside
  a framed card, which settles into place with a page-flip (`rotateY`,
  pivoting from its right edge) before a mouse cursor animates in and clicks
  the "Renewals" button, with a ripple and button-press feedback.

Total runtime: **536 frames @ 30fps ≈ 17.9 seconds**.

## Commands

**Install dependencies**

```console
npm i
```

**Start Remotion Studio** (live, scrubbable preview - the primary way to
review timing against the reference video frame-by-frame)

```console
npm run dev
```

**Render the final video**

```console
npx remotion render src/index.ts Beliv8Recreation out/final.mp4
```

(Confirm your entry file name matches - check what `Root.tsx` is registered
through if it isn't `src/index.ts`.)

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Reviewing against the reference

Useful frame ranges to scrub to in Remotion Studio when comparing against the
original video:

| Frames | Beat |
|---|---|
| 0–32 | Logo, hero pill intro, settle to top |
| 32–124 | "Email" detour pill + demo card (collapses before frame 196) |
| 196–268 | "Wait for 5 days" pill fills in |
| 268–297 | Fork splits into Responded / Didn't Respond |
| 305–420 | Left follow-up card: zoom in, read, watch the text edit animate |
| 430–467 | Right follow-up card: zoom in, read |
| 484–536 | Pull back to framed overview, page-flip settle, cursor clicks Renewals |

## Deliverables checklist

- [x] `src/template.tsx` - complete recreation
- [x] No external asset files required (fonts loaded via package, all
      graphics are inline SVG)
- [x] `out/final.mp4` - render with the command above before submitting
- [x] Whole project folder - runs via `npm i && npm run dev` from a clean
      clone with no machine-specific setup

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

Remotion's [Discord server](https://discord.gg/6VzzNDwUwV).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).