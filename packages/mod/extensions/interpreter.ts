// import { Store } from "@/lib/store";
// import z, { MethodAny, isValid } from "..";

// interface InterpreterDef<
//   Alias extends string,
//   T extends z.ZodTypeAny,
//   Constructors,
//   Creators,
// > extends z.ZodTypeDef {
//   alias?: Alias;
//   schema: T;
//   constructors: () => Constructors;
//   creators: () => Creators;
//   typeName: "interpreter";
// }

// type Constructor<M extends MethodAny, PrevOutput> = (
//   input: PrevOutput & { set: (fn: (store: Store) => void) => void },
// ) => M["_signature"];

// type ConstructorShape = {
//   [k: string]: (...args: any[]) => any;
// };

// type CreatorShape = {
//   [k: string]: (...args: any[]) => any;
// };

// type OutputShape = {
//   _: any;
//   _isComputer: true;
// } & {
//   [k: string]: (...args: any[]) => any;
// } & {
//   create: {
//     [k: string]: () => any;
//   };
// };

// type Methods<
//   Constructors extends ConstructorShape,
//   Creators extends CreatorShape,
// > = {
//   [k in keyof Constructors]: ReturnType<Constructors[k]>;
// } & {
//   create: {
//     [k in keyof Creators]: () => ReturnType<Creators[k]>;
//   };
// };

// type interpreterOutput<
//   Inner extends z.ZodTypeAny,
//   Constructors extends ConstructorShape,
//   Creators extends CreatorShape,
// > = z.objectUtil.flatten<
//   {
//     _: Inner["_output"];
//     _isComputer: true;
//   } & Methods<Constructors, Creators>
// >;

// export class ZodInterpreter<
//   Alias extends string,
//   Inner extends z.ZodTypeAny,
//   Constructors extends ConstructorShape,
//   Creators extends CreatorShape,
//   Output extends OutputShape = interpreterOutput<Inner, Constructors, Creators>,
//   Input = Inner["_input"],
// > extends z.ZodType<
//   Output,
//   InterpreterDef<Alias, Inner, Constructors, Creators>,
//   Input
// > {
//   innerType() {
//     return this._def.schema;
//   }

//   _parse(input: z.ParseInput): z.ParseReturnType<this["_output"]> {
//     const { status, ctx } = this._processInputParams(input);

//     const result = this._def.schema._parseSync({
//       data: ctx.data,
//       path: ctx.path,
//       parent: ctx,
//       set: ctx.set, // +
//       log: ctx.log,
//     });

//     if (isValid(result)) {
//       const data = result.value;

//       const constructors = this._def.constructors();
//       const creators = this._def.creators();

//       const innerWithConstructedMethods = Object.keys(constructors).reduce(
//         (acc, alias) => {
//           const constructor = constructors[alias];
//           return {
//             ...acc,
//             [alias]: function (...args: any[]): any {
//               const current = this;
//               const newMethod = constructor(current as any);
//               if (ctx.log) {
//                 console.log("Calling fn: ", alias);
//                 console.log("  args: ", args);
//               }
//               const result = newMethod(...args);
//               if (ctx.log) {
//                 console.log("  result:", result);
//               }
//               return result;
//             },
//           };
//         },
//         {
//           _: data,
//         } as any,
//       );

//       return {
//         status: "valid" as const,
//         value: {
//           ...innerWithConstructedMethods,
//           create: Object.keys(creators).reduce((acc, alias) => {
//             const creator = creators[alias];
//             return {
//               ...acc,
//               [alias]: () => {
//                 // note arrow function
//                 const current = this;
//                 const result = creator(current as any);
//                 if (ctx.log) {
//                   console.log("Calling creator: ", alias);
//                   console.log("  result:", result);
//                 }
//                 return () => result;
//               },
//             };
//           }, {}),
//         },
//       };
//     } else {
//       return result;
//     }
//   }

//   function<
//     M extends MethodAny,
//     C extends Constructor<M, Output>,
//     NewConstructors extends ConstructorShape = Constructors & {
//       [k in M["_def"]["name"]]: C;
//     },
//   >(
//     method: M,
//     constructor: C,
//   ): ZodInterpreter<Alias, Inner, NewConstructors, Creators> {
//     return new ZodInterpreter({
//       ...this._def,
//       constructors: () => ({
//         ...this._def.constructors(),
//         [method._def.name]: constructor,
//       }),
//     }) as any;
//   }

//   creates<
//     T extends z.ZodTypeAny,
//     Creator extends (arg: Output) => T["_input"],
//     Name extends string,
//     NewCreators extends CreatorShape = Creators & {
//       [k in Name]: () => ReturnType<Creator>;
//     },
//   >(
//     type: T,
//     name: Name,
//     creator: Creator,
//   ): ZodInterpreter<Alias, Inner, Constructors, NewCreators> {
//     return new ZodInterpreter({
//       ...this._def,
//       creators: () => ({
//         ...this._def.creators(),
//         [name]: creator,
//       }),
//     }) as any;
//   }
// }
