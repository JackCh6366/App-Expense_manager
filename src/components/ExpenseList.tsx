/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense, CategoryType } from '../types';
import { CATEGORIES } from '../constants';
import { CategoryIcon, Trash2, Search, SlidersHorizontal, RefreshCw } from './CategoryIcon';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType | null) => void;
}

type SortType = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export function ExpenseList({
  expenses,
  onDeleteExpense,
  selectedCategory,
  onSelectCategory,
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('date-desc');

  // 計算並篩選列表
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. 關鍵字篩選
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(term) ||
          (exp.note && exp.note.toLowerCase().includes(term))
      );
    }

    // 2. 類別篩選
    if (selectedCategory) {
      result = result.filter((exp) => exp.category === selectedCategory);
    }

    // 3. 排序方式
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [expenses, searchTerm, selectedCategory, sortBy]);

  // 重置所有過濾
  const handleResetFilters = () => {
    setSearchTerm('');
    onSelectCategory(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col h-full min-h-[400px]">
      {/* 頂部篩選與搜尋面板 */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>支出明細</span>
            <span className="px-2 py-0.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold rounded-full">
              {filteredAndSortedExpenses.length} 筆
            </span>
          </h3>
          
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 py-1.5 pl-2.5 pr-8 rounded-xl outline-none cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_10px_center] bg-no-repeat"
              id="select-sort"
            >
              <option value="date-desc">日期：最新優先</option>
              <option value="date-asc">日期：最舊優先</option>
              <option value="amount-desc">金額：從高到低</option>
              <option value="amount-asc">金額：從低到高</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* 搜尋框 */}
          <div className="sm:col-span-8 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋項目或備註備註..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/60 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              id="input-search"
            />
          </div>

          {/* 快速篩選標籤 */}
          <div className="sm:col-span-4 flex items-center justify-end gap-2 text-xs">
            {selectedCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 border border-indigo-100/50 dark:border-indigo-900/40 font-bold rounded-2xl cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-950/40 transition-all shadow-sm"
                id="btn-clear-category-filter"
              >
                <span>已篩：{CATEGORIES[selectedCategory].name}</span>
                <span className="text-sm font-semibold">×</span>
              </button>
            )}
            
            {(searchTerm || selectedCategory) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold cursor-pointer border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all"
                id="btn-reset-filters"
              >
                <RefreshCw size={11} />
                <span>清除條件</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 滾動滾動主體區 */}
      <div className="flex-1 overflow-y-auto max-h-[480px] pr-1" id="expenses-scroller">
        <AnimatePresence initial={false}>
          {filteredAndSortedExpenses.length > 0 ? (
            <div className="space-y-2.5">
              {filteredAndSortedExpenses.map((expense) => {
                const cat = CATEGORIES[expense.category];
                return (
                  <motion.div
                    key={expense.id}
                    layoutId={expense.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="group relative flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-800/30 border border-slate-100/60 dark:border-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700/60 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-transparent"
                    id={`expense-item-${expense.id}`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* 左側分類精美 Icon */}
                      <div className={`p-2.5 rounded-2xl ${cat.bgLight} shadow-sm shrink-0 flex items-center justify-center`}>
                        <CategoryIcon name={cat.icon} className={cat.textColor} size={18} />
                      </div>

                      {/* 中間文字 */}
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {expense.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-800/80 px-1.5 py-0.5 rounded-lg">
                            {expense.date}
                          </span>
                        </div>
                        {expense.note && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate italic font-medium">
                            {expense.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 右側操作及金額 */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100" id={`expense-amount-${expense.id}`}>
                          ${expense.amount.toLocaleString('zh-TW')}
                        </span>
                      </div>

                      {/* 刪除按鈕：大螢幕 Hover 顯示，觸控終端始終點擊 */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-rose-500/80 hover:text-rose-600 dark:text-rose-400/90 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer shadow-sm sm:shadow-none"
                        title="刪除此筆記錄"
                        id={`btn-delete-${expense.id}`}
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-12 text-center h-[300px] border-2 border-dashed border-slate-100 dark:border-slate-800/60 rounded-3xl"
              id="empty-list-state"
            >
              {/* 設計極簡的 empty state 插畫 */}
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4 text-2xl shadow-sm">
                🔍
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {expenses.length === 0 ? '開始你的第一筆理帳' : '找不到符合條件的明細'}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1 mb-4">
                {expenses.length === 0
                  ? '點擊右方的新增支出卡片，輸入名稱與金額，開啟輕鬆的日常財務追蹤。'
                  : '請嘗試清空關鍵字或重置類別，以取得所有的支出紀錄列表。'}
              </p>
              
              {(searchTerm || selectedCategory) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all"
                  id="btn-reset-empty-filters"
                >
                  重置搜尋
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
