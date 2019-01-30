import test from 'ava';
import { isUserOrg, filterByUserOrg } from './common-handlers';

const payload: any = {
  accessAttributes: {
    subject: {
      organisation_id: 'this is my organisation',
    },
  },
};
const propertyPath = ['this', 'is', 'a', 'deeply', 'nested', 'organisation_id'];

const notAllFromUserOrg = [
  {some: {useless: 'property'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is not my organisation'}}}}}},
  {some: {useless: 'property'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is not organisation'}}}}}},
  {some: {useless: 'value'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'prop'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'sign'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'stuff'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
];
const someMissingProp = [
  {some: {useless: 'property'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is not my organisation'}}}}}},
  {some: {useless: 'property'}, this: 'is a deeply nested organisation_id'},
  {some: {useless: 'value'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'prop'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'sign'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'stuff'}, this: {is: {a: {deeply: 'nested organisation_id'}}}},
];
const allUserOrg = [
  {some: {useless: 'property'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'property'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'value'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'prop'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'sign'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
  {some: {useless: 'stuff'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
];

test('isUserOrg returns an error if some of the resources do not match the criteria', async (t: any) => {
  try {
    await isUserOrg(payload, propertyPath, notAllFromUserOrg);
    t.fail('an error should have been thrown now');
  } catch (err) {
    t.is(err.message, 'user does not have access to all the required resources');
  }
});

test('isUserOrg returns an error if some of the resources do not have the correct property', async (t: any) => {
  try {
    await isUserOrg(payload, propertyPath, someMissingProp);
    t.fail('an error should have been thrown now');
  } catch (err) {
    t.is(err.message, 'user does not have access to all the required resources');
  }
});

test('isUserOrg returns the collection if all is good', async (t: any) => {
  try {
    const result = await isUserOrg(payload, propertyPath, allUserOrg);
    t.deepEqual(result, allUserOrg, 'the same collection should be returned');
  } catch (err) {
    t.fail(`unexpected error -> ${err.toString()}`);
  }
});

test(
  'filterByUserOrg returns only the elements that pass the test if some of the resources do not match the criteria',
  async (t) => {
    try {
      const result = await filterByUserOrg(payload, propertyPath, notAllFromUserOrg);
      t.deepEqual(result, [
        {some: {useless: 'value'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
        {some: {useless: 'prop'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
        {some: {useless: 'sign'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
        {some: {useless: 'stuff'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
      ], 'only keep the proper elements of the collection');
    } catch (err) {
      t.fail(`unexpected error -> ${err.toString()}`);
    }
  },
);

test(
  `filterByUserOrg returns only the elements that have a property that matches the criteria
  error if some of the resources do not have the correct property`,
  async (t) => {
    try {
      const result = await filterByUserOrg(payload, propertyPath, someMissingProp);
      t.deepEqual(result, [
        {some: {useless: 'value'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
        {some: {useless: 'prop'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
        {some: {useless: 'sign'}, this: {is: {a: {deeply: {nested: {organisation_id: 'this is my organisation'}}}}}},
      ], 'only keep the proper elements of the collection');
    } catch (err) {
      t.fail(`unexpected error -> ${err.toString()}`);
    }
  },
);

test('filterByUserOrg returns the entire collection if they all pass', async (t: any) => {
  try {
    const result = await isUserOrg(payload, propertyPath, allUserOrg);
    t.deepEqual(result, allUserOrg, 'the same collection should be returned');
  } catch (err) {
    t.fail(`unexpected error -> ${err.toString()}`);
  }
});
