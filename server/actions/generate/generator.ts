import OpenAI from "openai";
import { identifier } from "./shared";
import { LanguageModelAny, SmartLanguage } from "./model";
import { executeInference } from "./inference";
import z from "@/packages/mod";

const taggedTypes = {
  // [Component.entity.tag]: Component,
  // [Page.entity.tag]: Page,
};

export type GeneratorInitializerAny = GeneratorInitializer<any>;

export class GeneratorInitializer<T extends z.ZodTypeAny> {
  static readonly [identifier]: string = "GeneratorInitializer";

  readonly _: {
    readonly type: T;
  };

  constructor({ type }: { type: T }) {
    this._ = { type };
  }

  public model<TModel extends LanguageModelAny>(model: TModel) {
    return new GeneratorBuilder({ type: this._.type, model, injections: {} });
  }

  static create<T extends z.ZodTypeAny>(type: T): GeneratorInitializer<T> {
    return new GeneratorInitializer({ type });
  }
}

export type GeneratorBuilderAny = GeneratorBuilder<any, any>;

export type Injection<T extends z.ZodTypeAny> = (output: T["_output"]) => any;

export type Injections<T extends z.ZodTypeAny> = {
  [key: string]: Injection<T>;
};

export type InjectedData<I extends Injections<any>> = {
  [K in keyof I]: ReturnType<I[K]>;
};

export class GeneratorBuilder<
  T extends z.ZodTypeAny,
  TModel extends LanguageModelAny,
  TProgram extends T["_output"] = T["_output"],
> {
  static readonly [identifier]: string = "LanguageModel";

  readonly _!: {
    readonly program: TProgram;
  };

  readonly type: T;
  readonly model: TModel;
  readonly injections: Injections<T>;

  constructor({
    type,
    model,
    injections,
  }: {
    type: T;
    model: TModel;
    injections: Record<string, any>;
  }) {
    this.type = type;
    this.model = model;
    this.injections = injections;
  }

  applyInjections(program: TProgram): InjectedData<Injections<T>> {
    const result: any = {};
    for (const key in this.injections) {
      result[key] = this.injections[key](program);
    }
    return result;
  }

  async execute(input: TModel["_"]["input"]) {
    return await executeInference(this.model.identifier, input);
  }

  async run(json: unknown) {
    return await this.model.run(json);
  }

  static create<
    T extends z.ZodTypeAny,
    TModel extends LanguageModelAny,
    Injections extends Record<string, (output: TModel["_"]["output"]) => any>,
  >(
    type: T,
    model: TModel,
    injections: Injections,
  ): GeneratorBuilder<T, TModel> {
    return new GeneratorBuilder({ type, model, injections });
  }
}

const actions = {
  generate: GeneratorInitializer.create,
};
