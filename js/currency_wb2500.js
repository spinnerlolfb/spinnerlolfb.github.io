var currencyText = $('.js-bonus-sum')

var data = {
  ar: '500000 ARS',
  au: '3750 AUD',
  br: '12500 R$',
  ca: '3750 C$',
  cl: '2000000 CLP$',
  co: '10000000 COP',
  gh: '17500 GHS',
  hu: '875000 Ft',
  in: '250000 ₹',
  jp: '375000 ¥',
  ke: '337500 KES',
  mx: '50000 MEX$',
  ng: '1250000 ₦',
  no: '25000 kr',
  nz: '3750 NZ$',
  pe: '10000 S/',
  ph: '150000 ₱',
  pl: '12500 zł',
  se: '25000 SEK',
  tz: '7500000 TSh',
  us: '2500 $',
  uy: '100000 UYU',
  vi: '65000000 đ',
  cf: '1625000 ₣',
  ro: '12500 lei',
  dk: '20000 kr',
  ch: '2500 ₣',
}
var country = $('body').data('country')

currencyText.html(data[country] || '300%')
