import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv.default({
    coerceTypes: true,
});
addFormats.default(ajv);

export default ajv;
