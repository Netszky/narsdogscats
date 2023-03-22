export const parseDate = (date: string | Date): Date => {
    let timestamp: number;
    if (typeof date === 'string') {
        timestamp = Date.parse(date);
    } else {
        timestamp = date.getTime();
    }
    const parsedDate = new Date(timestamp);
    console.log(parsedDate);
    return parsedDate;
};