import { ZodTypeAny, input, output } from "@/packages/mod";

export type Action<T extends ZodTypeAny, Data> = (
  input: input<T>,
) => Promise<Data>;

export type ServerCodeFn<T extends ZodTypeAny, Data> = (
  parsedInput: output<T>,
) => Promise<Data>;

export const action = <const T extends ZodTypeAny, const Data>(
  schema: T,
  serverCode: ServerCodeFn<T, Data>,
): Action<T, Data> => {
  return async (clientInput) => {
    try {
      const parsedInput = await schema.parse(clientInput);
      const data = ((await serverCode(parsedInput)) ?? null) as Data;
      return data;
    } catch (e: unknown) {
      throw e;
    }
  };
};
