import { themes } from '../themes';
import { detectBrand } from '../utils/detectBrand';

const currentBrandKey = detectBrand();
export const brand = themes[currentBrandKey] || themes['default'];
