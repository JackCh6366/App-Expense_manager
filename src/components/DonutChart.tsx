/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Expense, CategoryType } from '../types';
import { CATEGORIES } from '../constants';
import { CategoryIcon } from './CategoryIcon';

interface DonutChartProps {
  expenses: Expense[];
  onSelectCategory?: (category: CategoryType | null) => void;
  selectedCategory: CategoryType | null;
}

export function DonutChart({ expenses, onSelectCategory, selectedCategory }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1. 按類別統計金額
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<CategoryType, number>);

  const totalAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // 2. 轉換為繪圖資料
  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as CategoryType,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (totalAmount === 0 || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[260px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
          <span className="text-xl">📊</span>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">目前尚無足夠數據</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">新增支出後在此將呈現動態分配圖</p>
      </div>
    );
  }

  // 3. SVG 圓環圖幾何參數
  const radius = 60;
  const strokeWidth = 14;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  
  let accumulatedPercent = 0;

  // 動態決定中央要顯示的內容
  const activeItem = hoveredIndex !== null 
    ? chartData[hoveredIndex] 
    : selectedCategory 
      ? chartData.find(d => d.category === selectedCategory) 
      : null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-between">
        <span>支出類別佔比</span>
        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">點擊分類可篩選</span>
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
        {/* 左側 SVG 圓環 */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* 圓環底色 */}
            <circle
              cx="80"
              cy="80"
              r={innerRadius}
              fill="transparent"
              stroke="#f1f5f9"
              className="dark:stroke-slate-800/40"
              strokeWidth={strokeWidth}
            />

            {/* 各個類別的圓弧段 */}
            {chartData.map((item, index) => {
              const categoryInfo = CATEGORIES[item.category];
              const strokeLength = (item.percentage / 100) * circumference;
              const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
              accumulatedPercent += item.percentage;

              const isSelected = selectedCategory === item.category;
              const isHovered = hoveredIndex === index;
              
              // 醒目狀態：如果有選中或 hover，其他變淡，當前加寬
              const strokeW = isHovered || isSelected ? strokeWidth + 2 : strokeWidth;
              const opacity = hoveredIndex !== null 
                ? (isHovered ? 1 : 0.6) 
                : (selectedCategory === null ? 1 : (isSelected ? 1 : 0.5));

              return (
                <circle
                  key={item.category}
                  cx="80"
                  cy="80"
                  r={innerRadius}
                  fill="transparent"
                  stroke={categoryInfo.color}
                  strokeWidth={strokeW}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap={item.percentage < 99 ? "round" : "butt"}
                  className="transition-all duration-300 cursor-pointer"
                  style={{ opacity }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(selectedCategory === item.category ? null : item.category);
                    }
                  }}
                  id={`donut-slice-${item.category}`}
                />
              );
            })}
          </svg>

          {/* 圓環中央文字 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
            {activeItem ? (
              <div className="fade-in transition-all duration-200">
                <span className="text-xl leading-none block mb-0.5" id="donut-center-emoji">
                  {CATEGORIES[activeItem.category].emoji}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block" id="donut-center-name">
                  {CATEGORIES[activeItem.category].name}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block mt-0.5" id="donut-center-amount">
                  ${activeItem.amount.toLocaleString('zh-TW')}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                  {activeItem.percentage.toFixed(1)}%
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
                  總支出
                </span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 block leading-tight mt-0.5" id="donut-center-total">
                  ${totalAmount.toLocaleString('zh-TW')}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                  共 {expenses.length} 筆
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 右側類別清單與圖例說明 */}
        <div className="flex-1 w-full max-h-[170px] overflow-y-auto pr-1 space-y-2">
          {chartData.map((item, index) => {
            const categoryInfo = CATEGORIES[item.category];
            const isSelected = selectedCategory === item.category;
            const isHovered = hoveredIndex === index;

            return (
              <button
                key={item.category}
                type="button"
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-200 ${
                  isSelected 
                    ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700/60' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                } ${isHovered ? 'shadow-sm' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(selectedCategory === item.category ? null : item.category);
                  }
                }}
                id={`donut-legend-btn-${item.category}`}
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: categoryInfo.color }}
                  />
                  <div className={`p-1 rounded-lg ${categoryInfo.bgLight}`}>
                    <CategoryIcon name={categoryInfo.icon} className={categoryInfo.textColor} size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {categoryInfo.name}
                  </span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200" id={`legend-amount-${item.category}`}>
                    ${item.amount.toLocaleString('zh-TW')}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
