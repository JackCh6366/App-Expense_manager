/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  HeartPulse,
  Home,
  Tag,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  X,
  Trash2,
  Plus,
  Search,
  Filter,
  Check,
  ChevronDown,
  Sparkles,
  Info,
  SlidersHorizontal,
  FileSpreadsheet,
  RefreshCw,
  Edit2,
  Target
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ name, className = '', size = 20 }: IconProps) {
  switch (name) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} size={size} />;
    case 'Car':
      return <Car className={className} size={size} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} size={size} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} size={size} />;
    case 'HeartPulse':
      return <HeartPulse className={className} size={size} />;
    case 'Home':
      return <Home className={className} size={size} />;
    default:
      return <Tag className={className} size={size} />;
  }
}

// 導出其他輔助 Icons，方便統一導入與管理
export {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  X,
  Trash2,
  Plus,
  Search,
  Filter,
  Check,
  ChevronDown,
  Sparkles,
  Info,
  SlidersHorizontal,
  FileSpreadsheet,
  RefreshCw,
  Edit2,
  Target
};
