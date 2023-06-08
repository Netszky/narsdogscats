export const getConfig = (key: string): string => {
    return process.env[key] ?? "";
};