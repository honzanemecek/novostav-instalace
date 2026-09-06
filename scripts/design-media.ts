/**
 * Fotografie, které web potřebuje, aby odpovídal návrhu.
 *
 * Stock z Pexels — licence dovoluje komerční užití bez uvedení autora, autora
 * přesto vedeme v popisku média, ať je v administraci na první pohled vidět,
 * co je cizí fotka a co vlastní. `alt` je česky: čte ho odečítač i vyhledávač.
 *
 * Klíč se rovná názvu souboru v knihovně médií (`<klíč>.jpg`) a přes něj se
 * fotky přiřazují ke službám, realizacím a stránkám.
 */
export type DesignMedia = { key: string; url: string; alt: string; credit: string }

export const MEDIA: DesignMedia[] = [
  {
    key: 'sluzba-stavebni-prace',
    url: 'https://images.pexels.com/photos/19688828/pexels-photo-19688828.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Zedník pokládá cihlu do maltového lože na rozestavěné zdi',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-strechy',
    url: 'https://images.pexels.com/photos/27806097/pexels-photo-27806097.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Pálená krytina na sedlové střeše zblízka',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-elektroinstalace',
    url: 'https://images.pexels.com/photos/8961695/pexels-photo-8961695.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Elektrikář vede chráničku s vodiči po zdi rozestavěného domu',
    credit: 'Pexels — Mikael Blomkvist',
  },
  {
    key: 'sluzba-vodoinstalace',
    url: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Instalatér montuje potrubí a šroubení pod zařizovacím předmětem',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-topeni',
    url: 'https://images.pexels.com/photos/20046689/pexels-photo-20046689.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Technická místnost s akumulačními nádržemi a jednotkou tepelného čerpadla',
    credit: 'Pexels',
  },
  {
    key: 'sluzba-podlahy',
    url: 'https://images.pexels.com/photos/7031616/pexels-photo-7031616.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Prázdný pokoj s položenou plovoucí podlahou a velkým oknem',
    credit: 'Pexels — Max Vakhtbovycn',
  },
  {
    key: 'projekt-bytove-jadro',
    url: 'https://images.pexels.com/photos/8143708/pexels-photo-8143708.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Zrekonstruovaná koupelna se sprchovým koutem a šedým obkladem',
    credit: 'Pexels',
  },
  {
    key: 'projekt-krov',
    url: 'https://images.pexels.com/photos/15456627/pexels-photo-15456627.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Nový dřevěný krov s vazníky proti modré obloze',
    credit: 'Pexels',
  },
  {
    key: 'projekt-podlaha',
    url: 'https://images.pexels.com/photos/7031621/pexels-photo-7031621.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Pokoj s čerstvě položenou plovoucí podlahou a bílými stěnami',
    credit: 'Pexels — Max Vakhtbovycn',
  },
  {
    key: 'projekt-tepelne-cerpadlo',
    url: 'https://images.pexels.com/photos/38067300/pexels-photo-38067300.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Venkovní jednotka tepelného čerpadla u zdi rodinného domu',
    credit: 'Pexels',
  },
  {
    key: 'projekt-elektro-byt',
    url: 'https://images.pexels.com/photos/7937305/pexels-photo-7937305.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Řada instalačních krabic s vodiči zapuštěná ve zdi',
    credit: 'Pexels',
  },
  {
    key: 'projekt-novostavba',
    url: 'https://images.pexels.com/photos/31406334/pexels-photo-31406334.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Dokončený rodinný dům s cihlovou fasádou a garáží',
    credit: 'Pexels',
  },
  {
    key: 'projekt-krytina',
    url: 'https://images.pexels.com/photos/37677394/pexels-photo-37677394.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Pokrývač pokládá novou krytinu na střeše rodinného domu',
    credit: 'Pexels',
  },
  {
    key: 'o-nas-parta',
    url: 'https://images.pexels.com/photos/8961555/pexels-photo-8961555.jpeg?auto=compress&cs=tinysrgb&w=1880',
    alt: 'Dva řemeslníci na stavbě rodinného domu při práci',
    credit: 'Pexels — Mikael Blomkvist',
  },
]
