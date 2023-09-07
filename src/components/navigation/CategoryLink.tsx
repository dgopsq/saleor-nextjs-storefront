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
        .with("main", () => "text-lg font-medium text-secondary-900")
        .with(
          "sub",
          () =>
            "text-secondary-500 hover:text-secondary-800 text-sm font-medium"
        )
        .exhaustive()}
      onClick={onClick}
    >
      {name}
    </Link>
  );
};
