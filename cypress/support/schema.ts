import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import bookingSchema from '../schemas/booking.json'
import bookingCreateSchema from '../schemas/booking-create.json'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

// Zarejestruj schematy pod nazwami, których używają $ref
ajv.addSchema(bookingSchema as object, 'booking.json')
ajv.addSchema(bookingCreateSchema as object, 'booking-create.json')

export function validateSchema(data: unknown, schema: object) {
  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (!valid) {
    const errors = (validate.errors || [])
      .map((e) => `${e.instancePath || '/'} ${e.message}`)
      .join('\n')
    throw new Error(`Schema validation failed:\n${errors}`)
  }
}
