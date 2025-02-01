export const getInterpolatedKey = (str= '', options = {}) =>
    str.replace(/\{(\w+)\}/g, (_, key) => (options[key] ? options[key] : `{${key}}`));

export function validateSchema(schema, payload, res) {
  const { error } = schema.validate(payload, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'ValidationError',
        message: error.details.map(err => err.message),
        statusCode: 400,
      },
    });
  }

  return null; 
}