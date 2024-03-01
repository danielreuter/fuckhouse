import { useStore } from "../store";

export const useChat = () =>
  useStore(({ chat: { data, handlers, setters, actions } }) => {
    const { input, messages, isLoading, error, extraMetadata } = data;
    const { handleInputChange, handleSubmit } = handlers;
    const {
      setMessages,
      setInput,
      setError,
      setIsLoading,
      setAbortController,
    } = setters;
    const { append, reload, stop } = actions;
    return {
      messages,
      error,
      append,
      reload,
      stop,
      setMessages, // uses the messages ref
      input,
      setInput,
      handleInputChange,
      handleSubmit,
      isLoading,
    };
  });
