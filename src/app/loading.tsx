import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0">
      <Image
        src="/favicon/icon-128x128.svg"
        alt="Gainz logo"
        width={128}
        height={128}
      />
    </div>
  );
}
