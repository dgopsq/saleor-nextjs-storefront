import {
  UserIcon,
  ShoppingCartIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon as BaseCheckIcon,
  ChevronUpDownIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  HomeIcon as BaseHomeIcon,
  TruckIcon,
  KeyIcon,
  ArrowLeftOnRectangleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export type BaseIconPublicProps = {
  className?: string;
};

type BaseIconProps = BaseIconPublicProps & {
  Icon: React.FC<{ className?: string }>;
};

/**
 * Base icon component.
 */
const BaseIcon: React.FC<BaseIconProps> = ({ className, Icon }) => (
  <Icon className={className} aria-hidden="true" />
);

/**
 * Profile icon component.
 */
export const ProfileIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={UserIcon} {...props} />
);

/**
 * Cart icon component.
 */
export const CartIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={ShoppingCartIcon} {...props} />
);

/**
 * Question icon component.
 */
export const QuestionIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={QuestionMarkCircleIcon} {...props} />
);

/**
 * Success icon component.
 */
export const SuccessIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={CheckCircleIcon} {...props} />
);

/**
 * Failure icon component.
 */
export const FailureIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={XCircleIcon} {...props} />
);

/**
 * Check icon component.
 */
export const CheckIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={BaseCheckIcon} {...props} />
);

/**
 * Up/Down icon component.
 */
export const UpDownIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={ChevronUpDownIcon} {...props} />
);

/**
 *  Hamburger icon component.
 */
export const HamburgerIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={Bars3Icon} {...props} />
);

/**
 * Search icon component.
 */
export const SearchIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={MagnifyingGlassIcon} {...props} />
);

/**
 * Close icon component.
 */
export const CloseIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={XMarkIcon} {...props} />
);

/**
 * Home icon component.
 */
export const HomeIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={BaseHomeIcon} {...props} />
);

/**
 * Shipping icon component.
 */
export const ShippingIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={TruckIcon} {...props} />
);

/**
 * Account icon component.
 */
export const AccountIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={KeyIcon} {...props} />
);

/**
 * Logout icon component.
 */
export const LogoutIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={ArrowLeftOnRectangleIcon} {...props} />
);

/**
 * Order icon component.
 */
export const OrderIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={ShoppingBagIcon} {...props} />
);
