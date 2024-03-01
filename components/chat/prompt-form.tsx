"use client";

import * as React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { useRouter } from "next/navigation";
import { Store } from "@/lib/store";
import Textarea from "react-expanding-textarea";
import { MenuButton } from "@/components/buttons/menu-button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useUi } from "@/lib/hooks/use-ui";
import { ChevronsDown } from "lucide-react";
import { ChatStore } from "@/lib/chat/store";

export interface PromptProps
  extends Pick<ChatStore["data"], "input">,
    Pick<ChatStore["handlers"], "handleSubmit">,
    Pick<ChatStore["setters"], "setInput"> {
  isLoading: boolean;
}

export function NewPromptForm({
  handleSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      ref={formRef}
      className="w-full overflow-hidden"
    >
      <div className="relative flex max-h-60 py-[13px] w-full grow overflow-hidden border-none sm:border">
        <ScrollArea className="pl-6 w-full py-0">
          <div className="h-full w-full flex items-center">
            <Textarea
              className="h-full w-full outline-none py-[18px] px-2 pr-4 mx-2 bg-transparent  text-lg border-[#eaeae3] transition-colors resize-none font-inherit"
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a page you'd like to generate"
              spellCheck={false}
              // className="min-h-[60px] w-full resize-none bg-transparent pr-4 py-[1.3rem] focus-within:outline-none sm:text-md"
            />
          </div>
        </ScrollArea>

        <div className="flex items-center">
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || input === ""}
          >
            {/* <IconArrowElbow className="h-6 w-6" /> */}
            <span className="sr-only">Send message</span>
          </Button>
          {/* <MenuButton
            size="lg"
            variant="menu"
            onClick={() => {
              setIsShowingChat(false);
            }}
          >
            <ChevronsDown className="h-6 w-6" />
          </MenuButton> */}
        </div>
      </div>
    </form>
  );
}
