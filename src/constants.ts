/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CategoryInfo, CategoryType } from './types';

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  food: {
    id: 'food',
    name: '餐飲食品',
    icon: 'UtensilsCrossed',
    color: '#f97316', // orange-500
    bgLight: 'bg-orange-50 dark:bg-orange-950/20',
    textColor: 'text-orange-600 dark:text-orange-400',
    emoji: '🍔',
  },
  transport: {
    id: 'transport',
    name: '交通出行',
    icon: 'Car',
    color: '#3b82f6', // blue-500
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    emoji: '🚗',
  },
  shopping: {
    id: 'shopping',
    name: '購物消費',
    icon: 'ShoppingBag',
    color: '#ec4899', // pink-500
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    textColor: 'text-pink-600 dark:text-pink-400',
    emoji: '🛍️',
  },
  entertainment: {
    id: 'entertainment',
    name: '休閒娛樂',
    icon: 'Gamepad2',
    color: '#a855f7', // purple-500
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    emoji: '🎮',
  },
  health: {
    id: 'health',
    name: '醫療保健',
    icon: 'HeartPulse',
    color: '#10b981', // emerald-500
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    emoji: '🏥',
  },
  housing: {
    id: 'housing',
    name: '居家生活',
    icon: 'Home',
    color: '#06b6d4', // cyan-500
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/20',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    emoji: '🏠',
  },
  other: {
    id: 'other',
    name: '其他支出',
    icon: 'Tag',
    color: '#64748b', // slate-500
    bgLight: 'bg-slate-50 dark:bg-slate-950/20',
    textColor: 'text-slate-600 dark:text-slate-400',
    emoji: '🏷️',
  },
};

export const DEFAULT_BUDGET = 20000; // 預設每月預算
