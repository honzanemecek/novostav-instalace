# Novostav - Instalace

**Site name:** Novostav - Instalace
**Production domain:** novostav-instalace.cz

## What this project is

A rebuild of the presentation website for **Novostav - Instalace**, a Czech family
building & installation firm. The current site at `novostav-instalace.cz` is a WordPress
one-page placeholder reading *"Připravujeme pro vás nové webové stránky"* — this project
replaces it.

There was a real, content-rich site before that (2013, by Pavel Vostrák HW&SW). It is
gone from the web, but it survives as printouts photographed into `old_website_photos/`.
**Those photos are not photos of completed work — they are screenshots of the old site**,
and they are the primary source for what this business actually does. Everything in the
"Services" section below comes from them.

## The business

- **Trading name:** Novostav-Instalace. Legally the trader is **Václav Novotný**
  (the old site branded as *"Václav Novotný - NOVOSTAV"*), but the firm communicates
  outward as Novostav-Instalace and uses `@novostav-instalace.cz` e-mail. Use the
  company name in UI copy; Václav is the person behind it, not the brand.
- **Legal form:** OSVČ (sole trader), **plátce DPH** (VAT-registered). Not an s.r.o.
- **Founded 1993** — *"Jsme firma založena v roce 1993"*. That's 30+ years in the trade
  and the single strongest trust signal the site has. Use it.
- **Shape:** family business. Small. Copy must not pretend to be a 50-person contractor —
  no stock photos of teams in hard hats, no "our nationwide network".
- **Service area:** Středočeský kraj + Praha.
- **Hours:** no fixed opening hours — *"nemáme pevnou pracovní dobu, jsme tu pro vás
  stále"*. Worth saying plainly; it's a genuine differentiator against firms that only
  answer 8–16.

### Contact

| | |
|---|---|
| Phone | +420 602 323 095 |
| E-mail | info@novostav-instalace.cz |
| Office (kancelář) | Švýcarská 2432, 272 01 Kladno 1-Kročehlavy |
| Sídlo (registered seat) | Svárovská 213, 273 51 Červený Újezd (okres Praha-západ) |

**Kladno is the office; Červený Újezd is only the sídlo.** The two addresses are not
old-vs-new — they are seat-vs-workplace, and they serve different purposes on the site.
Kladno is where a customer actually goes (and where the Parador floor samples are on
display), so it is the address for the contact page, the map and the LocalBusiness
structured data. Červený Újezd belongs in the footer's legal line next to the IČO.
Google Business lists the firm at Kladno.

The current placeholder page also links `info@novostavinstalace.cz` (no hyphen) — **that
is almost certainly a typo, do not carry it over.**

The old placeholder had a Facebook icon pointing at a bare `http://facebook.com` stub.
There is no known social profile. Don't ship a social row until there's something real
behind it.

## Services — six pillars, not just plumbing

This is the most important correction to make about this project. The name says
*instalace* and it is easy to assume plumbing only. It is not. The 2013 site sold six
distinct trades, and the 2024 placeholder's inquiry form still offered *elektromontáže*,
*stavební práce* and *instalatérské práce* — a consistent subset.

1. **Stavební práce** — výstavby rodinných domů, rekonstrukce, bytová jádra, výstavby
   dřevěných chatek a pergol, fasády.
2. **Střechy** — veškeré střešní konstrukce, tesařské práce, montáž střešních oken Velux.
   Materiály: betonová krytina, pálená krytina, šindel. Izolace pro ploché střechy.
   Klempířské práce: Cu, TiZn, FeZn, Al.
3. **Elektroinstalace** — kompletní elektroinstalace včetně hromosvodů a revizí.
   Nové stavby, panelové domy, rekonstrukce. Slaboproudé rozvody.
4. **Vodoinstalace** — plastové potrubí PPR, lisované spoje Alpex a elektrotvarovky.
   Odpady typ HT, KG. Montáže sanity.
5. **Topení** — topenářské práce, dodávka a montáž plynových kotlů a ohřívačů, plyn.
   Ekologické topení: solární panely Vaillant a Quantum, tepelná čerpadla Stiebel Eltron.
   Regulace topných systémů. Moderní materiály Alpex, Cu, vše lisované spoje.
6. **Plovoucí podlahy / podlahářské práce** — pokládka podlah značky **Parador**.
   Vzory podlah jsou vystaveny v kanceláři (a reason to visit, worth a CTA).

Also advertised: **architektonická řešení včetně vyřízení formalit** — they'll handle the
paperwork, not just the build.

**Brands to name** (real, from the old site, good material for a logo/trust strip):
Velux · Vaillant · Quantum · Stiebel Eltron · Parador · Alpex.

### Zelená úsporám

The 2013 site advertised registration in the **Zelená úsporám** subsidy programme —
*"Program poběží v letech 2013–2020 a připraven je pro vlastníky soukromých i veřejných
budov. Jako první se pustíme do podpory dokončení komplexní rekonstrukce rodinných domů."*
That programme window has closed; the live successor is **Nová zelená úsporám**. Do not
copy the old wording. If they are still registered under the current scheme it is a
strong selling point and deserves its own section — **needs confirming.**

## Audience

Homeowners, plus developers and builders, in Prague and Central Bohemia. Mostly on
phones, usually comparing two or three local firms at once. Every page has to answer:
*can these people do my job, have they done it before, and how do I reach them.*

A firm that does all six trades has a real advantage to sell here: one contractor for a
whole house instead of coordinating five. The site should lead with that.

## Open questions — not yet answered, do not invent

- **IČO / DIČ.** Required in the footer by law. Searched ARES by name, by "Novostav" and
  by the Červený Újezd address — no match surfaced. Must come from the client.
- **Which pillars are still active in 2026?** The six above are from 2013. The 2024 form
  confirms stavební / elektro / instalatérské are current. **Střechy and podlahy are
  unconfirmed** — a firm can quietly drop a trade in twelve years.
- Current Zelená úsporám / Nová zelená úsporám status.
- Team size and names, certifications and oprávnění (gas work and elektro revize both
  require them — these are trust-section gold if they exist).
- References: named projects, addresses, dates. There are currently **zero** photos of
  actual completed work anywhere in this repo. A "Reference" section cannot ship until
  the client supplies real photography.
- Warranty terms, typical response time, whether they quote free of charge.

## Known inconsistencies elsewhere in this repo

`src/shared/config/site.ts` and `.claude/skills/frontend-design/SKILL.md` currently
describe the business as plumbing/heating/gas only ("voda, topení, plyn"). That predates
the research above and is too narrow. Both need updating once the client confirms which
of the six pillars are live.
