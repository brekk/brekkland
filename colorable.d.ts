export interface Accessibility {
  aa: boolean
  aaLarge: boolean
  aaa: boolean
  aaaLarge: boolean
}

export interface HexContrast {
  hex: string
  contrast: number
  accessibility: Accessibility
}

export interface CompactComparison {
  hex: string
  combinations: HexContrast[]
}

export default function colorable(colors: string[]): CompactComparison[]
