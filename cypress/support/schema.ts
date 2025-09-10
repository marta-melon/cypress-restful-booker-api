import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function validateSchema(data: unknown, schema: object) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const errors = (validate.errors || []).map((e) => `${e.instancePath} ${e.message}`).join('\n');
    throw new Error(`Schema validation failed:\n${errors}`);
  }
}
