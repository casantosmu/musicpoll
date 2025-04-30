export const envStr = (name: string, defaultValue?: string) => {
    const value = process.env[name];

    if (value !== undefined) {
        return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }

    throw new Error(`${name} env not found`);
};

export const envInt = (name: string, defaultValue?: number) => {
    const value = envStr(name, defaultValue?.toString());

    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue)) {
        throw new Error(`${name} env is invalid int`);
    }

    return numValue;
};

export const envBool = (name: string, defaultValue?: boolean) => {
    const value = envStr(name, defaultValue?.toString());

    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }

    throw new Error(`${name} env is invalid boolean`);
};

export const envEnum = (name: string, allowedValues: string[], defaultValue?: string) => {
    const value = envStr(name, defaultValue);

    if (!allowedValues.includes(value)) {
        throw new Error(`Invalid ${name}. Must be ${allowedValues.join(", ")}`);
    }

    return value;
};
