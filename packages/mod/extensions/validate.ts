import { Primitive, z } from "..";
import _ from "lodash";

interface ComputerOutput {
  _isComputer: true;
}

function unwrap(output: any): any {
  if (Array.isArray(output)) {
    return unwrapArray(output);
  } else if (typeof output === "object" && output !== null) {
    if (isComputerOutput(output)) {
      const { _isComputer, ...rest } = _.omitBy(output, _.isFunction);
      return unwrap(rest);
    } else {
      return unwrapObject(output);
    }
  } else {
    return output;
  }
}

function unwrapArray<T>(output: T[]): any {
  return output.map((item) => unwrap(item));
}

function unwrapObject<O extends object>(output: O): any {
  const finalObject = {} as any;
  for (const key of Object.keys(output)) {
    const value = (output as any)[key];
    finalObject[key] = unwrap(value);
  }
  return finalObject;
}

function isComputerOutput(value: any): value is ComputerOutput {
  return value && typeof value === "object" && "_isComputer" in value;
}

export function validate<T extends z.ZodTypeAny>(
  type: T,
  input: T["_output"],
): T["_input"] {
  const validatedInput = unwrap(input);
  // console.warn("validatedInput", validatedInput);
  type.parse(validatedInput); // do it again to be sure
  return validatedInput;
}

export const dump = unwrap;
