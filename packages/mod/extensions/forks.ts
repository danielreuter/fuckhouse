import z from "..";

interface DiscriminatorOutput<
  T extends string,
  U extends [T, ...T[]],
  L extends string,
> {
  name: L;
  types: {
    [k in U[number]]: {
      [l in L]: z.ZodLiteral<k>;
    };
  };
  tuple: U;
}

export const discriminator = <
  T extends string,
  U extends [T, ...T[]],
  L extends string,
>(
  name: L,
  items: U,
): DiscriminatorOutput<T, U, L> => {
  const types: any = {};
  for (const item of items) {
    types[item] = { [name]: z.literal(item) };
  }
  return {
    name,
    types,
    tuple: items,
  };
};

export function discriminatorSubset<
  T extends string,
  U extends [T, ...T[]],
  L extends string,
  V extends [T, ...T[]],
>(
  discriminator: DiscriminatorOutput<T, U, L>,
  subsetItems: V,
): DiscriminatorOutput<T, V, L> {
  // Ensure that the subsetItems are a subset of the original items
  if (!subsetItems.every((item) => discriminator.tuple.includes(item))) {
    throw new Error("Subset items must be a subset of the original items.");
  }

  const subsetTypes: any = {};
  for (const item of subsetItems) {
    subsetTypes[item] = { [discriminator.name]: z.literal(item) };
  }

  return {
    name: discriminator.name,
    types: subsetTypes,
    tuple: subsetItems,
  };
}

export type inferDiscriminator<T extends DiscriminatorOutput<any, any, any>> =
  T["tuple"][number];
