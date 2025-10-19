import { Camera } from "lucide-react";
import { Avatar } from "./ui/Avatar";

export default function AvatarEdit() {
  return (
    <>
      <Avatar className="size-72" />
      <Camera className="absolute transform translate-x-[200px] translate-y-[-50px] bg-slate-800 rounded-full text-white size-12 p-3 cursor-pointer" />
    </>
  );
}
