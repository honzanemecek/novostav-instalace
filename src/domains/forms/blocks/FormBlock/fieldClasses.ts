/**
 * Vzhled vstupních polí formuláře.
 *
 * `src/shared/ui/` je výstup registry CLI a ručně se needituje, takže se
 * odchylky od návrhu dosazují tady, na místě použití: 44px dotykový cíl,
 * žádný stín a **focus ring se nikdy neodstraňuje** — jen se vrací na 2px
 * s odsazením, jak ho definuje `globals.css`.
 */
export const formFieldClasses =
  'min-h-11 shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-0'
