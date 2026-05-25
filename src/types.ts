/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 'food' | 'transport' | 'shopping' | 'entertainment' | 'health' | 'housing' | 'other';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  bgLight: string; // tailwind light bg color class
  textColor: string; // tailwind text color class
  emoji: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  date: string;
  note?: string;
}

export interface MonthBudget {
  amount: number;
  month: string; // YYYY-MM
}
