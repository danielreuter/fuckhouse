import { runInference } from "./generate/inference";
import { GeneratorInitializer } from "./generate/generator";

export const actions = {
  generate: runInference,
};
