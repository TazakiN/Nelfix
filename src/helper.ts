import * as hbs from 'hbs';

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});
