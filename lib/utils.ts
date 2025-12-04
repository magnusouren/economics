import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatNumberToNOK = (num: number) => {
    return num.toLocaleString('no-NO', {
        style: 'currency',
        currency: 'NOK',
        maximumFractionDigits: 0,
    });
};
