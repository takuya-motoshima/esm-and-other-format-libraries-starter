import {add} from '~/mylib';
test('Add 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});