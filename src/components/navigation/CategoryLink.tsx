import { Link } from "@/components/core/Link";
import { generateCategoryRoute } from "@/misc/navigation";
import { match } from "ts-pattern";

type Props = {
  variant: "main" | "sub";
  slug: string;
  name: string;
  onClick?: () => void;
};

/**
 * Link to a specific category.
 */
export const CategoryLink: React.FC<Props> = ({
  variant,
  slug,
  name,
  onClick,
}) => {
  const route = generateCategoryRoute(slug);

  return (
    <Link
      href={route}
      className={match(variant)
        .with("main", () => "text-lg font-medium text-gray-900")
        .with(
          "sub",
          () => "text-gray-500 hover:text-gray-800 text-sm font-medium"
        )
        .exhaustive()}
      onClick={onClick}
    >
      {name}
    </Link>
  );
};
