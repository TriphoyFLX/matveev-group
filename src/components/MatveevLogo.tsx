/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTheme } from '../theme';

type MatveevLogoProps = {
  className?: string;
  variant?: 'auto' | 'light' | 'dark';
};

export default function MatveevLogo({ className = 'h-4 w-auto', variant = 'auto' }: MatveevLogoProps) {
  const { theme } = useTheme();
  const useLightLogo = variant === 'dark' ? false : variant === 'light' ? true : theme === 'light';
  const src = useLightLogo ? '/matveevGroupLogo-black.svg' : '/matveevGroupLogo.svg';

  return (
    <img
      src={src}
      alt="Matveev Group"
      className={className}
      width={useLightLogo ? 24 : 24}
      height={16}
    />
  );
}
