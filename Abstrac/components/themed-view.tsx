import { View, type ViewProps, type ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: ColorValue;
  darkColor?: ColorValue;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Check if background is an array (gradient)
  if (Array.isArray(backgroundColor)) {
    return (
      <LinearGradient
        colors={backgroundColor as [ColorValue, ColorValue, ...ColorValue[]]}
        style={[style]}
        {...otherProps}
      />
    );
  }

  return <View style={[{ backgroundColor: backgroundColor as ColorValue }, style]} {...otherProps} />;
}
