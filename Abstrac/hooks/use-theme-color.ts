/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import type { ColorValue } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor<T extends keyof typeof Colors.light & keyof typeof Colors.dark>(
  props: { light?: ColorValue; dark?: ColorValue },
  colorName: T
): T extends 'background' ? ColorValue | string[] : ColorValue {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps as T extends 'background' ? ColorValue | string[] : ColorValue;
  } else {
    return Colors[theme][colorName] as T extends 'background' ? ColorValue | string[] : ColorValue;
  }
}
