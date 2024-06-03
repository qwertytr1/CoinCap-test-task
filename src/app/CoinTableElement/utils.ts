export const formatValue = (value: string | number) => {
    const num = Number(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}b`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}m`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}k`;
    return num.toFixed(2);
  };