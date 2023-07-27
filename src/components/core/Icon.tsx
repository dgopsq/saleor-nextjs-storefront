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
} from "@heroicons/react/24/outline";

type BaseIconPublicProps = {
  className?: string;
};

type BaseIconProps = BaseIconPublicProps & {
  Icon: React.FC<{ className?: string }>;
};

/**
 *
 */
const BaseIcon: React.FC<BaseIconProps> = ({ className, Icon }) => (
  <Icon className={className} aria-hidden="true" />
);

/**
 *
 */
export const ProfileIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={UserIcon} {...props} />
);

/**
 *
 */
export const CartIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={ShoppingCartIcon} {...props} />
);

/**
 *
 */
export const QuestionIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={QuestionMarkCircleIcon} {...props} />
);

/**
 *
 */
export const SuccessIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={CheckCircleIcon} {...props} />
);

/**
 *
 */
export const FailureIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={XCircleIcon} {...props} />
);

/**
 *
 */
export const CheckIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={BaseCheckIcon} {...props} />
);

/**
 *
 */
export const UpDownIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={ChevronUpDownIcon} {...props} />
);

/**
 *
 */
export const HamburgerIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={Bars3Icon} {...props} />
);

/**
 *
 */
export const SearchIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={MagnifyingGlassIcon} {...props} />
);

/**
 *
 */
export const CloseIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={XMarkIcon} {...props} />
);

/**
 *
 */
export const HomeIcon: React.FC<BaseIconPublicProps> = (props) => (
  <BaseIcon Icon={BaseHomeIcon} {...props} />
);
