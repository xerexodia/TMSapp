import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

interface Colors {
  primary: string;
  secondary: string;
  dark: string;
  green: string;
  blueLavande: string;
  blueViolance: string;
  blueElectrique: string;
  grey: string;
  brand: string;
  lightGrey: string;
  tertiary: string;
  red: string;
}
export const colors: Colors = {
  primary: '#fff',
  secondary: '#fafafa',
  tertiary: '#e5e7eb',
  dark: '#000',
  green: '#0c5600',
  blueLavande: '#817bed',
  blueViolance: '#978bed',
  blueElectrique: '#7576ec',
  lightGrey: '#e5e5e5',
  grey: '#7c8a98',
  brand: '#7b65ec',
  red: '#ef4444',
};
// font size
interface Fonts {
  xxl: number;
  xl: number;
  l: number;
  m: number;
  s: number;
  xs: number;
  xxs: number;
}
export const fonts: Fonts = {
  xxl: 48,
  xl: 35,
  l: 26,
  m: 20,
  s: 18,
  xs: 16,
  xxs: 14,
};

// general container
export const Container = styled.View`
  background-color: ${colors.primary};
  height: ${height}px;
`;

// label input
export const Label = styled.Text`
  font-size: ${fonts.s}px;
  color: ${colors.dark};
  font-weight: 400;
`;

//error Text
export const ErrorText = styled.Text`
  font-size: ${fonts.xs}px;
  color: ${colors.red};
  font-weight: 400;
`;
