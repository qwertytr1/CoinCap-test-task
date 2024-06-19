import { CurrencyEntity } from "../interfaces";

export const formatValue = (value: string | number) => {
    const num = Number(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}b`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}m`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}k`;
    return num.toFixed(2);
};
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  } as T;
}
export const setStorageItem = (key:string, value:CurrencyEntity[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getStorageItem = (key:string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};