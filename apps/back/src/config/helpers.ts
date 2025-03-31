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

export const envNum = (name: string) => {
    const value = envStr(name);

    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue)) {
        throw new Error(`${name} env is invalid number`);
    }

    return numValue;
};

export const envEnum = (name: string, allowedValues: string[], defaultValue?: string) => {
    const value = envStr(name, defaultValue);

    if (!allowedValues.includes(value)) {
        throw new Error(`Invalid ${name}. Must be ${allowedValues.join(", ")}`);
    }

    return value;
};
