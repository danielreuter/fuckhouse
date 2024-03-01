import z, { ZodTypeAny } from "@/packages/mod";
import { Action } from "../../action";

export class Builder {
  readonly identifier?: string;
  constructor(identifier?: string) {
    this.identifier = identifier;
  }
  tag(identifier: string): this {
    // check
    const This = (this as any).constructor;
    return new This(identifier);
  }
  generate<T extends ZodTypeAny>(type: T) {
    const { identifier } = this;
    if (!identifier) throw new Error("Identifier is required");
    return new GeneratorBuilder({ type, identifier });
  }
  static create(identifier?: string) {
    return new Builder(identifier);
  }
}

type Handler<T> = (args: T) => any;

export class GeneratorBuilder<
  T extends ZodTypeAny,
  TModel extends Action<any, any>,
> extends Function {
  readonly type: T;
  readonly model?: TModel;
  readonly identifier: string;

  handler?: Handler<T["_output"]>;

  constructor({
    identifier,
    type,
    model,
  }: {
    identifier: string;
    type: T;
    model?: TModel;
  }) {
    super(identifier);
    this.identifier = identifier;
    this.type = type;
    this.model = model;
    return new Proxy(this, {
      apply: (target: this, thisArg: any, args: Parameters<TModel>) =>
        target._clientCall(...args),
    });
  }

  using<Model extends Action<any, any>>(
    model: Model,
  ): GeneratorBuilder<T, Model> {
    const { type, identifier } = this;
    return new GeneratorBuilder({ identifier, type, model });
  }

  handle(handler: Handler<T["_output"]>): this {
    return this._clientHandle(handler);
  }

  async call(...args: Parameters<TModel>): Promise<ReturnType<TModel>> {
    return this._clientCall(...args);
  }

  /******************* Client Side *********************/

  async _clientCall(...args: Parameters<TModel>): Promise<ReturnType<TModel>> {
    const { model } = this;
    if (!model) throw new Error("Model is not defined");
    return await model(args);
  }

  _clientHandle(handler: Handler<T["_output"]>): this {
    const { handler: prev } = this;
    if (prev) {
      const next: Handler<T["_output"]> = (args) => {
        prev(args);
        handler(args);
      };
      this.handler = next;
    } else {
      this.handler = handler;
    }
    return this;
  }

  /******************* Server Side *********************/
}

const build = Builder.create;

// const generator = build()
//   .alias("wow")
//   .generate(page)
//   .using(smartLanguage)
//   .handle((result) => {
//     console.log(result);
//   })
//   .handle((result) => {
//     console.log(result);
//   });

// const result = generator({
//   left: "hello",
//   right: 10,
// });

// having(
// 	having: ((aliases: this['_']['selection']) => SQL | undefined) | SQL | undefined,
// ): PgSelectWithout<this, TDynamic, 'having'> {
// 	if (typeof having === 'function') {
// 		having = having(
// 			new Proxy(
// 				this.config.fields,
// 				new SelectionProxyHandler({ sqlAliasedBehavior: 'sql', sqlBehavior: 'sql' }),
// 			) as TSelection,
// 		);
// 	}
// 	this.config.having = having;
// 	return this as any;
// }
