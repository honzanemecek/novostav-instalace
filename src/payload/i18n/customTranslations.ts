import type { NestedKeysStripped } from '@payloadcms/translations'

/**
 * Project-specific admin UI terms, available in collection configs.
 *
 * Add matching keys under `custom` for both locales, then reference them from
 * a config file:
 *
 *   import type { TFunction } from '@payloadcms/translations'
 *   import type { CustomTranslationsKeys } from '@/payload/i18n/customTranslations'
 *   const t = (key: CustomTranslationsKeys) => {
 *     return ({ t }: { t: TFunction }) => (t as unknown as TFunction<CustomTranslationsKeys>)(key)
 *   }
 *   // field: { label: t('custom:myTerm') }
 */
export const customTranslations = {
  cs: {
    custom: {},
  },
  en: {
    custom: {},
  },
}

export type CustomTranslationsObject = typeof customTranslations.en
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>
