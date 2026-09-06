import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en } from '@payloadcms/translations/languages/en'
import { cs } from '@payloadcms/translations/languages/cs'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/domains/posts/collections/Categories'
import { Company } from '@/domains/company/global'
import { Media } from '@/domains/media/collection'
import { Pages } from '@/domains/pages/collection'
import { Posts } from '@/domains/posts/collections/Posts'
import { Projects } from '@/domains/projects/collection'
import { Services } from '@/domains/services/collection'
import { Users } from '@/domains/users/collection'
import { Footer } from '@/domains/layout/footer/config'
import { Header } from '@/domains/layout/header/config'
import { plugins } from './plugins'
import { defaultLexical } from './fields/defaultLexical'
import { customTranslations } from './i18n/customTranslations'
import { getServerSideURL } from '@/shared/utils/getURL'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/payload/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/payload/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  collections: [Pages, Services, Projects, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  i18n: {
    supportedLanguages: { cs, en },
    translations: customTranslations,
  },
  localization: {
    locales: ['cs', 'en'],
    defaultLocale: 'cs',
  },
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    mcpPlugin({
      collections: {
        posts: {
          enabled: true,
        },
        categories: {
          enabled: true,
        },
        pages: {
          enabled: true,
        },
        services: {
          enabled: true,
        },
        projects: {
          enabled: true,
        },
      },
    }),
  ],
  globals: [Header, Footer, Company],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
