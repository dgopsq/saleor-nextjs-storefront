import { Link } from "@/components/core/Link";
import { homeRoute } from "@/misc/navigation";

/**
 * The Logo component.
 */
export const Logo: React.FC = () => (
  <Link href={homeRoute} className="hover:no-underline">
    <span className="inline-block px-2 py-1 text-xl uppercase font-black text-primary-600 rounded-lg border-4 border-primary-600">
      l o g o
    </span>
  </Link>
);
