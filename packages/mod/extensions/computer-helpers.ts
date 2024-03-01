// import { Store } from "@/lib/store";
// import {
//   ZodTypeAny,
//   ZodEffects,
//   def,
//   ZodType,
//   input,
//   output,
//   AnyZodObject,
//   ZodObject,
//   objectUtil,
//   ZodTypeDef,
//   MethodAny,
// } from "..";

// export namespace ext {
//   export type mergeMapping<
//     T extends ZodTypeAny,
//     isComputer extends boolean,
//     Creates extends ZodTypeAny,
//     Mapping extends (arg: T["_output"]) => Creates["_input"],
//     Alias extends string = Creates["_def"]["identifier"] extends undefined
//       ? never
//       : Creates["_def"]["identifier"],
//   > = isComputer extends true
//     ? objectUtil.flatten<
//         Omit<T["_output"], "create"> & {
//           create: T["_output"]["create"] & {
//             [K in Alias]: Mapping;
//           };
//         }
//       >
//     : objectUtil.flatten<
//         { data: T["_output"] } & {
//           create: {
//             [K in Alias]: Mapping;
//           };
//         }
//       >;

//   export type newComputer<
//     isComputer extends boolean,
//     T extends ZodType<any, any, any, any>,
//     NewOut,
//     Input,
//     Output,
//     Def extends ZodTypeDef,
//   > = isComputer extends true
//     ? ZodEffects<T, NewOut, Input, true>
//     : T extends AnyZodObject
//       ? ZodEffects<
//           ZodObject<
//             ReturnType<T["_def"]["shape"]>,
//             T["_def"]["unknownKeys"],
//             T["_def"]["catchall"],
//             Output,
//             Input,
//             true
//           >,
//           NewOut,
//           Input,
//           true
//         >
//       : ZodEffects<ZodType<Input, Def, Output, true>, NewOut, Input, true>;

//   export type constructorInput<
//     wasComputer extends boolean,
//     isMutator extends boolean,
//     Output,
//     Setter = isMutator extends true
//       ? { set: (fn: (store: Store) => void) => void }
//       : {},
//     Indicators = isMutator extends true
//       ? { _isComputer: true; _isMutator: true }
//       : { _isComputer: true },
//   > = wasComputer extends true
//     ? Output & Setter & Indicators
//     : { _: Output } & Setter & Indicators;

//   export type computer<
//     wasComputer extends boolean,
//     isMutator extends boolean,
//     T extends ZodType<any, any, any, any>,
//     Input,
//     Output,
//     Def extends ZodTypeDef,
//     M extends MethodAny,
//     C extends (
//       input: constructorInput<wasComputer, isMutator, Output>,
//     ) => M["_signature"],
//     Setter = isMutator extends true
//       ? { set: (fn: (store: Store) => void) => void }
//       : {},
//     TempOut = wasComputer extends true
//       ? Output & { [k in M["_def"]["name"]]: ReturnType<C> } & Setter
//       : { _: Output } & { [k in M["_def"]["name"]]: ReturnType<C> } & Setter,
//     NewOut = objectUtil.flatten<TempOut>,
//   > = wasComputer extends true
//     ? ZodEffects<T, NewOut, Input, true>
//     : T extends AnyZodObject
//       ? ZodEffects<
//           ZodObject<
//             ReturnType<T["_def"]["shape"]>,
//             T["_def"]["unknownKeys"],
//             T["_def"]["catchall"],
//             Output,
//             Input,
//             true
//           >,
//           NewOut,
//           Input,
//           true
//         >
//       : ZodEffects<ZodType<Input, Def, Output, true>, NewOut, Input, true>;
// }
// export namespace ext2 {
//   type IsType<T, Condition, True, False> = T extends Condition ? True : False;
//   type IsFunction<T> = IsType<T, Function, true, false>;

//   type mutatorData<isMutator extends boolean> = IsType<
//     isMutator,
//     true,
//     { _isMutator: true; set: (fn: (store: Store) => void) => void },
//     {}
//   >;

//   export type constructorInput<
//     wasComputer extends boolean,
//     isMutator extends boolean,
//     Output,
//   > = wasComputer extends true
//     ? Output & mutatorData<isMutator>
//     : { _: Output } & { _isComputer: true } & mutatorData<isMutator>;

//   type innerType<
//     T extends ZodTypeAny,
//     Input,
//     Def extends ZodTypeDef,
//     Output,
//   > = T extends AnyZodObject
//     ? ZodObject<
//         ReturnType<T["_def"]["shape"]>,
//         T["_def"]["unknownKeys"],
//         T["_def"]["catchall"],
//         Output,
//         Input,
//         true
//       >
//     : ZodType<Input, Def, Output, true>;

//   export type computer<
//     wasComputer extends boolean,
//     T extends ZodType<any, any, any, any>,
//     Input,
//     Output,
//     Def extends ZodTypeDef,
//     ComputerInput,
//     ComputerOutput,
//   > = ZodEffects<
//     innerType<T, Input, Def, Output>,
//     objectUtil.flatten<ComputerOutput>,
//     objectUtil.flatten<ComputerInput>,
//     true
//   >;
// }

// // export type newComputer<
// //     T extends ZodTypeAny,
// //     isComputer extends boolean,
// //     NewOut,
// //     Input,
// //     Output,
// //     Def extends ZodTypeDef
// //   > = isComputer extends true
// //     ? ZodEffects<T, NewOut, input<T>, true>
// //     : T extends AnyZodObject
// //       ? ZodEffects<
// //         ZodObject<
// //           ReturnType<T["_def"]["shape"]>,
// //           T["_def"]["unknownKeys"],
// //           T["_def"]["catchall"],
// //           output<T>,
// //           input<T>,
// //           true
// //         >,
// //         NewOut,
// //         input<T>,
// //         true
// //       >
// //     : ZodEffects<
// //       ZodType<input<T>, def<T>, output<T>, true>,
// //       NewOut,
// //       input<T>,
// //       true
// //     >
