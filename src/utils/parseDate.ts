export const parseDate = (date: string | Date): Date => {
    let timestamp: number;
    if (typeof date === 'string') {
        timestamp = Date.parse(date);
        console.log("timezkdjafakkldf", timestamp);
    } else {
        timestamp = date.getTime();
    }
    const parsedDate = new Date(timestamp);
    console.log(parsedDate);
    return parsedDate;
};