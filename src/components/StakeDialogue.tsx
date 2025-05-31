import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/stake-dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import MagmaLst from "./MagmaLst";

export default function StakeDialog() {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="connect-button-bg rounded-[5px] cursor-pointer p-2">
          Get gMON
        </DialogTrigger>
        <DialogContent className="overflow-auto">
          <DialogTitle className="text-center font-bold text-[27px] mb-[18px]">Get gMON to join Stakewars</DialogTitle>
          <div className="w-full">
            <MagmaLst />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
