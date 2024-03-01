import { Board } from "@/components/board/board";
import { Chat } from "@/components/chat/chat";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center bg-background">
      {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
        </div>
      </nav> */}

      <main className="relative w-full h-full flex flex-col items-center gap-8 py-4 mt-auto">
        <div className="max-w-xl flex-1 h-full w-full ">
          <Board />
        </div>
        <Chat />
      </main>
    </div>
  );
}
