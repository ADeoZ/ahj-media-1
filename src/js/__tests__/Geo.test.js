import GEO from '../Geo';

test.each([
  ['First correct', '51.50851, −0.12572', { latitude: '51.50851', longitude: '−0.12572' }],
  ['Second correct', '-51.50851,0.12572', { latitude: '-51.50851', longitude: '0.12572' }],
  ['Third correct', '[51.50851, 5.12572]', { latitude: '51.50851', longitude: '5.12572' }],
  ['First Incorrect', 'test', { error: 'incorrect' }],
  ['Second Incorrect', '12', { error: 'incorrect' }],
  ['Third Incorrect', '123,13', { error: 'incorrect' }],
])(('check geo coords'), (_, input, expected) => {
  const geo = new GEO();
  const result = geo.geoInputFormat(input);
  expect(result).toStrictEqual(expected);
});
