const test = require('node:test');
const assert = require('node:assert/strict');
const { colors } = require('../theme/palette.cjs');

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

const text = [
  ['ink', 'canvas'], ['ink', 'surface'], ['muted', 'canvas'], ['muted', 'surface'],
  ['placeholder', 'surface'], ['placeholder', 'focusWash'], ['white', 'action'], ['white', 'brand'],
  ['textOnBrand', 'brand'], ['error', 'surface'], ['error', 'errorWash'],
  ['success', 'successWash'], ['warning', 'warningWash'],
];
const controls = [['border', 'surface'], ['border', 'canvas'], ['focusBorder', 'surface'], ['focusBorder', 'focusWash']];

test('text and control color pairs meet WCAG contrast thresholds', () => {
  for (const [foreground, background, minimum] of [...text.map((pair) => [...pair, 4.5]), ...controls.map((pair) => [...pair, 3])]) {
    const first = luminance(colors[foreground]);
    const second = luminance(colors[background]);
    const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    assert.ok(ratio >= minimum, `${foreground}/${background} is ${ratio.toFixed(2)}:1, below ${minimum}:1`);
  }
});
