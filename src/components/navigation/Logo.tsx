import { Link } from "@/components/core/Link";
import { homeRoute } from "@/misc/navigation";
import Image from "next/image";

/**
 *
 */
export const Logo: React.FC = () => (
  <Link href={homeRoute}>
    <Image
      src="https://tailwindui.com/img/logos/mark.svg"
      alt=""
      className="h-8 w-auto"
      width={100}
      height={100}
    />
  </Link>
);
