import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
payload.logger.info('Schema push complete')
process.exit(0)
