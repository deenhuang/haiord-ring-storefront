// Confirmed regional offers, not a live currency conversion.
export const prices = {
  USD: { deposit: 30, launch: 199, retail: 349 },
  CNY: { deposit: 199, launch: 1399, retail: 2399 },
};
export const formatPrice = (currency, amount) => currency === 'SAR'
  ? `SAR ${amount.toLocaleString('en-US')}`
  : `${currency === 'USD' ? '$' : '¥'}${amount.toLocaleString('en-US')} ${currency}`;
export function validateReservation({ email, country, accepted }, language = 'en') {
  const zh = language === 'zh';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return zh ? '请输入有效的邮箱地址。' : 'Please enter a valid email address.';
  if (!country.trim()) return zh ? '请选择国家或地区。' : 'Please select your country or region.';
  if (!accepted) return zh ? '请阅读并勾选预览说明后继续。' : 'Please acknowledge the preview terms to continue.';
  return '';
}
