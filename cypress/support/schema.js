import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import bookingSchema from '../schemas/booking.json'
import bookingCreateSchema from '../schemas/booking-create.json'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

ajv.addSchema(bookingSchema, 'booking.json')
ajv.addSchema(bookingCreateSchema, 'booking-create.json')

export function validateSchema(data, schema) {
 const validate = ajv.compile(schema)
 const ok = validate(data)
 if (!ok) {
 const details = (validate.errors || [])
 .map(e => `${e.instancePath || '/'} ${e.message}`)
 .join('\n')
 throw new Error(`Schema validation failed:\n${details}`)
 }
}
