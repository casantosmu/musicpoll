import Ajv from "ajv";

const ajv = new Ajv.default({
    coerceTypes: true,
});

export default ajv;
