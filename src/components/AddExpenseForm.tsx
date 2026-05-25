/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { CategoryType, Expense } from '../types';
import { CategoryIcon, Plus, Calendar } from './CategoryIcon';

interface AddExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('food');
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('請輸入支出名稱！');
      return;
    }

    const amount = Math.round(parseFloat(amountStr));
    if (isNaN(amount) || amount <= 0) {
      setError('請輸入大於 0 的有效整數金額！');
      return;
    }

    onAddExpense({
      title: title.trim(),
      amount,
      category: selectedCategory,
      date,
      note: note.trim() || undefined,
    });

    // 重設表單狀態
    setTitle('');
    setAmountStr('');
    setNote('');
  };

  return (
    <div className="w-full">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3.5 flex items-center gap-1.5 pl-0.5">
        <span>新增支出明細</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3.5" id="add-expense-form">
        {/* 1. 支出名稱 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block pl-0.5">
            支出名稱
          </label>
          <input
            type="text"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：午餐拉麵、高鐵票..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/30 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800/60 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            id="input-title"
          />
        </div>

        {/* 2. 支出金額 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block pl-0.5">
            金額 (NT$)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs">
              $
            </span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0"
              className="w-full pl-7 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/30 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800/60 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
              id="input-amount"
            />
          </div>
        </div>

        {/* 3. 類別選擇 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block pl-0.5">
            類別
          </label>
          <div className="grid grid-cols-4 gap-1.5" id="category-selector">
            {Object.values(CATEGORIES).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    backgroundColor: isSelected ? `${cat.color}15` : undefined,
                    borderColor: isSelected ? cat.color : undefined,
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-transparent shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] ring-1 ring-offset-0'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                  id={`cat-btn-${cat.id}`}
                >
                  <span className="text-base leading-none mb-1">{cat.emoji}</span>
                  <span
                    className={`text-[9px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                      isSelected ? cat.textColor : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 消費日期 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block pl-0.5">
            消費日期
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Calendar size={13} />
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-[34px] pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/30 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800/60 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-300 outline-none transition-all cursor-pointer"
              id="input-date"
            />
          </div>
        </div>

        {/* 5. 備註 (選填) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block pl-0.5">
            備註 (選填)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="記錄消費備註..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/30 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800/60 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            id="input-note"
          />
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-500 text-[11px] font-semibold rounded-xl flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 送出按鈕 */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          id="btn-submit-expense"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>記入帳目</span>
        </motion.button>
      </form>
    </div>
  );
}
