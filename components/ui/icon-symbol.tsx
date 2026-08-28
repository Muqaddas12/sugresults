import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

const MAPPING: Record<string, ComponentProps<typeof Ionicons>['name']> = {
  'house.fill': 'school',
  'paperplane.fill': 'download',
  'school': 'school',
  'download': 'download',
  'chevron.right': 'chevron-forward',
};

export type IconSymbolName = keyof typeof MAPPING | string;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  const iconName = MAPPING[name] || (name as ComponentProps<typeof Ionicons>['name']) || 'school';
  return <Ionicons color={color as string} size={size} name={iconName} style={style} />;
}
