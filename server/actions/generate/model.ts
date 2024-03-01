import OpenAI from "openai";
import { identifier } from "./shared";
import { OpenAIStream } from "ai";
import z from "@/packages/mod";
import { createJsonSchema } from "@/lib/utils";
import { openAI } from "@/lib/openai";
import { move } from "@/lib/game/move";

type OpenAIConfig = OpenAI.ChatCompletionCreateParamsStreaming;
type OpenAIOutput = ReadableStream<any>;

export type LanguageModelAny = LanguageModel<any>;

type config<T extends LanguageModelAny> = T["_"]["config"];
// type input<T extends LanguageModelAny> = T['_']['input']
type output<T extends LanguageModelAny> = T["_"]["output"];

export class LanguageModel<
  Args extends z.ZodTypeAny,
  Input extends Args["_output"] = Args["_output"],
> {
  readonly identifier: string;

  readonly _!: {
    readonly args: Args;
    readonly input: Input;
    readonly output: OpenAIOutput;
    readonly config: OpenAIConfig;
  };

  readonly args: Args;
  readonly configure: (input: Input) => OpenAIConfig;

  constructor(
    identifier: string,
    args: Args,
    configure: (input: Input) => OpenAIConfig,
  ) {
    this.identifier = identifier;
    this.args = args;
    this.configure = configure;
  }

  parse(json: unknown): Input {
    return this.args.parse(json);
  }

  async infer(input: Input): Promise<OpenAIOutput> {
    const config = this.configure(input);
    console.log("here's the config", JSON.stringify(config, null, 2));
    const res = await openAI(config);
    return OpenAIStream(res);
  }

  async run(json: unknown): Promise<OpenAIOutput> {
    const { infer, parse } = this;
    return await infer(parse(json));
  }

  static create<
    Args extends z.ZodTypeAny,
    Input extends Args["_output"],
    Configure extends (input: Input) => OpenAIConfig,
  >(
    identifier: string,
    args: Args,
    configure: Configure,
  ): LanguageModel<Args, Input> {
    return new LanguageModel(identifier, args, configure);
  }
}

const language = LanguageModel.create;

export const SmartLanguage = language(
  "smart",
  z.object({
    request: z.string(),
    board: z.string(),
    turn: z.string(),
    history: z.string().array(),
  }),
  ({ request, board, turn, history }) => ({
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "system",
        content:
          "You are responsible for formatting a user's requested chess move into a valid move, " +
          turn +
          " to play. White is uppercase letters, black is lowercase. You must ALWAYS use this special notation. Do not use normal chess notation. You have to specify the square you're moving from, and the square you're moving to, even if you're taking a queen or a king -- same notation no matter what." +
          "P = pawn\nR = rook\nN = knight\nB = bishop\nQ = queen\nK = king\n" +
          "Note that in this version of chess, you can make as many moves as you want simultaneously. " +
          "Sometimes the user will say something like 'take that pawn' -- you should infer their intention if not" +
          " spelled out explicitly, and then do that. Don't reply as text, be sure to only use your tools. " +
          "The board is currently in the following state: \n\n" +
          board +
          " \n\n" +
          "Move history (most recent first): \n" +
          history.reverse().join("\n"),
      },
      {
        role: "user",
        content: "Request from player " + turn + ": " + request,
      },
    ],
    stream: true,
    tools: [
      {
        type: "function",
        function: {
          name: "writeMove",
          description: "Format a move for a user",
          parameters: createJsonSchema(move),
        },
      },
    ],
  }),
);

// export class LanguageModel<
//   Args extends ModTypeAny,
// > {

//   static readonly [identifier]: string = 'LanguageModel';

//   readonly _!: {
//     readonly args: Args;
//     // readonly input: Input;
//     readonly output: OpenAIOutput;
//     readonly config: OpenAIConfig;
//   }

//   constructor(configure: (input: Input) => OpenAIConfig) {
//     this.configure = configure;
//   }

//   configure: (input: Input) => config<this>;

//   async run(input: Input): Promise<output<this>> {
//     const config = this.configure(input);
//     const res = await openai.chat.completions.create(config);
//     return OpenAIStream(res)
//   }

//   static create<
//     I extends any,
//     DefineArgs extends any,
//     Define extends (args: DefineArgs) => (input: I) => OpenAIConfig
//   >(
//     args: DefineArgs,
//     define: Define
//   ): LanguageModel<I> {
//     return new LanguageModel(define(args));
//   }
// }
