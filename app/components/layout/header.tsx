import Image from "next/image";
import logo from "@/public/logo.png";
export default function Header() {
  return (
    <div className="bg-[#1674D2] flex items-center h-[50px] p-[20px] justify-center">
      <div className="flex items-center gap-[8px]">
        <Image src={logo} alt="logo" height={20} width={20} />
        <span className="text-white font-bold">NUMRAH VIDEO GENERATOR</span>
      </div>
    </div>
  );
}
