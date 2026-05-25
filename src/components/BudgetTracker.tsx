/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Check, X, TrendingDown, Target } from './CategoryIcon';

interface BudgetTrackerProps {
  totalAmount: number;
  budget: number;
  onUpdateBudget: (newBudget: number) => void;
}

export function BudgetTracker({ totalAmount, budget, onUpdateBudget }: BudgetTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(budget));
  const [error, setError] = useState('');

  const percentUsed = budget > 0 ? (totalAmount / budget) * 100 : 0;
  const remaining = budget - totalAmount;
  const isOverBudget = remaining < 0;

  // 定義進度條顏色
  const getProgressBarColor = () => {
    if (percentUsed >= 100) return 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500';
    if (percentUsed >= 85) return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400';
    return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400';
  };

  // 定義文字顏色
  const getProgressTextColor = () => {
    if (percentUsed >= 100) return 'text-rose-500 dark:text-rose-400';
    if (percentUsed >= 85) return 'text-amber-500 dark:text-amber-400';
    return 'text-emerald-500 dark:text-emerald-400';
  };

  const handleSave = () => {
    const val = Math.round(parseFloat(editValue));
    if (isNaN(val) || val <= 0) {
      setError('請輸入大於 0 的有效整數預算！');
      return;
    }
    onUpdateBudget(val);
    setError('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(budget));
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
      {/* 裝飾背板，做出高級感 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50/20 dark:from-indigo-950/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* 標題與編輯列 */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
            <Target size={16} />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            預算管理
          </span>
        </div>

        {/* 預算設定和編輯操作 */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.button
              key="edit-trigger"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="button"
              onClick={() => {
                setEditValue(String(budget));
                setIsEditing(true);
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              id="btn-edit-budget"
            >
              <Edit2 size={11} />
              <span>變更預算</span>
            </motion.button>
          ) : (
            <motion.div
              key="edit-input-panel"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5"
            >
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-20 px-2 py-0.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/50 border border-slate-100 dark:border-slate-800 focus:border-indigo-500 rounded-lg text-xs font-bold text-slate-850 dark:text-slate-200 outline-none transition-all"
                placeholder="預算金額"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                id="input-budget-value"
              />
              <button
                type="button"
                onClick={handleSave}
                className="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded"
                title="儲存"
                id="btn-save-budget"
              >
                <Check size={12} strokeWidth={3} />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                title="取消"
                id="btn-cancel-budget"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mb-2 text-[10px] text-rose-500 font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* 數據顯示區 */}
      <div className="grid grid-cols-2 gap-4 mb-4" id="budget-summary">
        {/* 已用預算與百分比 */}
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            每月剩餘額度
          </span>
          <span
            className={`text-lg font-black tracking-tight ${
              isOverBudget ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'
            }`}
            id="budget-remaining-amount"
          >
            {isOverBudget ? '-' : ''}${Math.abs(remaining).toLocaleString('zh-TW')}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 whitespace-nowrap">
            {isOverBudget ? '超支累計' : '尚可隨性消費'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            目前預算額度
          </span>
          <span className="text-lg font-extrabold text-slate-700 dark:text-slate-200" id="budget-total-amount">
            ${budget.toLocaleString('zh-TW')}
          </span>
          <span className={`text-[10px] font-bold mt-0.5 block ${getProgressTextColor()}`}>
            已用 {percentUsed.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 現代簡約進度條 */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-full overflow-hidden border border-slate-100/40 dark:border-slate-800/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentUsed, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${getProgressBarColor()}`}
            id="budget-progress-bar"
          />
        </div>
        
        {/* 超支出警示警告 */}
        <AnimatePresence>
          {percentUsed >= 100 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-[10px] font-medium text-rose-500 dark:text-rose-400 pt-1 leading-normal flex items-center gap-1"
            >
              <TrendingDown size={12} />
              <span>注意：您已超出本月設定的理財預算！</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
