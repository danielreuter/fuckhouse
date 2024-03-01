// import z from "..";

// interface MethodDef<
//   Name extends string,
//   Args extends z.ZodTuple<any, any> = z.ZodTuple<any, any>,
//   Returns extends z.ZodTypeAny = z.ZodTypeAny,
// > extends z.ZodTypeDef {
//   args: Args;
//   returns: Returns;
//   name: Name;
// }

// export type MethodAny = Method<any, any, any>;

// type Signature<
//   Args extends z.ZodTuple<any, any>,
//   Returns extends z.ZodTypeAny,
// > =
//   Args["_output"] extends Array<any>
//     ? (...args: Args["_output"]) => Returns["_output"]
//     : never;

// export class Method<
//   Name extends string,
//   Args extends z.ZodTuple<any, any>,
//   Returns extends z.ZodTypeAny,
// > {
//   readonly _type!: z.OuterTypeOfFunction<Args, Returns>;
//   readonly _output!: z.OuterTypeOfFunction<Args, Returns>;
//   readonly _input!: z.InnerTypeOfFunction<Args, Returns>;
//   readonly _def!: MethodDef<Name, Args, Returns>;
//   readonly _signature!: Signature<Args, Returns>;

//   constructor(def: MethodDef<Name, Args, Returns>) {
//     this._def = def;
//   }

//   parameters() {
//     return this._def.args;
//   }

//   returnType() {
//     return this._def.returns;
//   }

//   args<Items extends Parameters<(typeof z.ZodTuple)["create"]>[0]>(
//     ...items: Items
//   ): Method<Name, z.ZodTuple<Items, z.ZodUnknown>, Returns> {
//     return new Method({
//       ...this._def,
//       args: z.ZodTuple.create(items).rest(z.ZodUnknown.create()) as any,
//     });
//   }

//   returns<NewReturnType extends z.ZodType<any, any>>(
//     returnType: NewReturnType,
//   ): Method<Name, Args, NewReturnType> {
//     return new Method({
//       ...this._def,
//       returns: returnType,
//     });
//   }

//   static create<N extends string>(
//     name: N,
//   ): Method<N, z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
//   static create(
//     name: string,
//     args?: z.AnyZodTuple,
//     returns?: z.ZodTypeAny,
//     params?: z.RawCreateParams,
//   ) {
//     return new Method({
//       name,
//       args: (args
//         ? args
//         : z.ZodTuple.create([]).rest(z.ZodUnknown.create())) as any,
//       returns: returns || z.ZodUnknown.create(),
//       // ...z.processCreateParams(params),
//     }) as any;
//   }
// }

// export const method = Method.create;
