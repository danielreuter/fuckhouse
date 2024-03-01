import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player } from "@/lib/game/player";

interface Props {
  player: Player;
  winner: Player;
}

export function WinnerModal({ player, winner }: Props) {
  return (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {winner === player ? "You won!" : "You lost!"}
          </DialogTitle>
          <DialogDescription>
            Your king got smooshed. Better luck next time!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Leave a note for your AI to learn from
            </Label>
            <Input
              id="note"
              defaultValue="Write something here"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="submit">Save changes</Button>
          <Button type="button">Play again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
