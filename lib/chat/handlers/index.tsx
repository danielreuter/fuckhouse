import { StateCreator } from "zustand";
import { ChatRequestOptions, JSONValue, Message } from "ai";
import { Store } from "@/lib/store";

export interface ChatHandlersStore {
  handleInputChange: (e: any) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}

export const createChatHandlersStore: StateCreator<
  Store,
  [],
  [],
  ChatHandlersStore
> = (set, get) => ({
  handleSubmit: async (
    e: React.FormEvent<HTMLFormElement>,
    { options, functions, function_call }: ChatRequestOptions = {},
    metadata?: Object,
  ) => {
    console.log("[handleSubmit] - start");
    const {
      data: { messages: prevMessages, input },
      actions,
      setters,
    } = get().chat;
    const { setInput } = setters;
    const { generateMove } = actions;

    e.preventDefault();
    if (!input) return;
    if (!input?.trim()) return;
    setInput("");

    const messages = prevMessages.concat({
      id: "fuck",
      role: "user",
      content: input,
    });

    await generateMove(messages);
    console.log("[handleSubmit] - end");
  },
  handleInputChange: (e) => {
    const { setInput } = get().chat.setters;
    console.log("Handling input change: ", e.target().value);
    setInput(e.target().value);
  },
});

/*

    if (!blueprint) {
      await triggerRequest({
        endpoint: "api/page/generate-wireframe",
        chatRequest,
        handleStreamedToolCalls: (toolCalls) => {
          // console.log("Handling streamed tool calls", toolCalls);
          try {
            toolCalls.forEach((toolCall) => {
              const { id, type, function: fn } = toolCall;
              if (fn) {
                console.log('Handling streamed tools: looking at function', fn)
                const { name, arguments: args } = fn;
                if (args) {
                  // const parsedArgs = parse(args);
                  const parsedArgs = args as any; // why is this already parsed...
                  switch (name) {
                    case "generateWireframe": {
                      setBlueprint(parsedArgs);
                    }
                    case "insertChildren": {
                      const { path, insertedChildren } = parsedArgs;
                      if (path && insertedChildren) {
                        setBlueprint((originalBlueprint) =>
                          originalBlueprint
                            ? insertBlueprintChildren({
                                originalBlueprint,
                                path,
                                insertedChildren,
                              })
                            : null,
                        );
                      }
                    }
                    case "editNode": {
                      const { editPath, editedNode } = parsedArgs;
                      if (editPath && editedNode) {
                        setBlueprint((originalBlueprint) =>
                          originalBlueprint
                            ? editBlueprint({
                                originalBlueprint,
                                editPath,
                                editedNode,
                              })
                            : editedNode,
                        );
                      }
                    }
                  }
                }
              }
            });
          } catch (err) {
            console.warn("[handleStreamedFunctionCall]: ", err);
          }
          
        },
        callbacks: {
          onFinish: async (message) => {
            const currentBlueprint = get().page.data.blueprint;
            const annotatedBlueprint = !currentBlueprint ? {} : new BlueprintEditor(currentBlueprint).annotatedBlueprint;
            const stringifiedBlueprint = JSON.stringify(annotatedBlueprint);
            const secondChatRequest = createChatRequest(
              [{
                id: 'new', 
                role: 'user' as const, 
                content: stringifiedBlueprint,
              }, ...messagesToSend, ],
              {
                options: {
                  body: {
                    blueprint: currentBlueprint
                  }
                }
              }
            );
            if (!currentBlueprint) return;
            const editor = new BlueprintEditor(currentBlueprint)
            await triggerRequest({
              endpoint: "api/page/edit-blueprint-array",
              chatRequest: secondChatRequest,
              handleStreamedToolCalls: (toolCalls) => {
                // console.log("Handling streamed tool calls", toolCalls);
                try {
                  toolCalls.forEach((toolCall) => {
                    const { id, type, function: fn } = toolCall;
                    if (fn) {
                      console.log('Handling streamed tools: looking at function', fn)
                      const { name, arguments: args } = fn;
                      if (args) {
                        // const parsedArgs = parse(args);
                        const parsedArgs = args as any; // why is this already parsed...
                        switch (name) {
                          case "generateWireframe": {
                            setBlueprint(parsedArgs);
                          }
                          case "insertChildren": {
                            const { path, insertedChildren } = parsedArgs;
                            if (path && insertedChildren) {
                              setBlueprint((originalBlueprint) =>
                                originalBlueprint
                                  ? insertBlueprintChildren({
                                      originalBlueprint,
                                      path,
                                      insertedChildren,
                                    })
                                  : null,
                              );
                            }
                          }
                          case "editVariousNodes": {
                            const { edits } = parsedArgs;
                            if (edits) {
                              edits.forEach((edit: any) => {
                                const { path, editedFields } = edit;
                                if (path && editedFields) {

                                  editor.makeEdit(path, editedFields)
                                  setBlueprint(editor.reconstruct())
                                }
                              })
                            }
                          }
                          case "editNode": {
                            const { editPath, editedNode } = parsedArgs;
                            if (editPath && editedNode) {
                              setBlueprint((originalBlueprint) =>
                                originalBlueprint
                                  ? editBlueprint({
                                      originalBlueprint,
                                      editPath,
                                      editedNode,
                                    })
                                  : editedNode,
                              );
                            }
                          }
                        }
                      }
                    }
                  });
                } catch (err) {
                  console.warn("[handleStreamedFunctionCall]: ", err);
                }
                
              },
            }); 
          }
        }
      });
    } else {
      const currentBlueprint = get().page.data.blueprint;
            const annotatedBlueprint = !currentBlueprint ? {} : new BlueprintEditor(currentBlueprint).annotatedBlueprint;
            const stringifiedBlueprint = JSON.stringify(annotatedBlueprint);
            const secondChatRequest = createChatRequest(
              [{
                id: 'new', 
                role: 'user' as const, 
                content: stringifiedBlueprint,
              }, ...messagesToSend, ],
              {
                options: {
                  body: {
                    blueprint: currentBlueprint
                  }
                }
              }
            );
            if (!currentBlueprint) return;
            const editor = new BlueprintEditor(currentBlueprint)
            await triggerRequest({
              endpoint: "api/page/edit-blueprint-array",
              chatRequest: secondChatRequest,
              handleStreamedToolCalls: (toolCalls) => {
                // console.log("Handling streamed tool calls", toolCalls);
                try {
                  toolCalls.forEach((toolCall) => {
                    const { id, type, function: fn } = toolCall;
                    if (fn) {
                      console.log('Handling streamed tools: looking at function', fn)
                      const { name, arguments: args } = fn;
                      if (args) {
                        // const parsedArgs = parse(args);
                        const parsedArgs = args as any; // why is this already parsed...
                        switch (name) {
                          case "generateWireframe": {
                            setBlueprint(parsedArgs);
                          }
                          case "insertChildren": {
                            const { path, insertedChildren } = parsedArgs;
                            if (path && insertedChildren) {
                              setBlueprint((originalBlueprint) =>
                                originalBlueprint
                                  ? insertBlueprintChildren({
                                      originalBlueprint,
                                      path,
                                      insertedChildren,
                                    })
                                  : null,
                              );
                            }
                          }
                          case "editVariousNodes": {
                            const { edits } = parsedArgs;
                            if (edits) {
                              edits.forEach((edit: any) => {
                                const { path, editedFields } = edit;
                                if (path && editedFields) {

                                  editor.makeEdit(path, editedFields)
                                  setBlueprint(editor.reconstruct())
                                }
                              })
                            }
                          }
                          case "editNode": {
                            const { editPath, editedNode } = parsedArgs;
                            if (editPath && editedNode) {
                              setBlueprint((originalBlueprint) =>
                                originalBlueprint
                                  ? editBlueprint({
                                      originalBlueprint,
                                      editPath,
                                      editedNode,
                                    })
                                  : editedNode,
                              );
                            }
                          }
                        }
                      }
                    }
                  });
                } catch (err) {
                  console.warn("[handleStreamedFunctionCall]: ", err);
                }
              },
            }); 

*/
