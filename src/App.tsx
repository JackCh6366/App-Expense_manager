/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense, CategoryType } from './types';
import { DEFAULT_BUDGET } from './constants';
import {
  TrendingDown,
  Sparkles,
  Trash2,
  FileSpreadsheet,
  Plus,
  SlidersHorizontal
} from './components/CategoryIcon';
import { AddExpenseForm } from './components/AddExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { DonutChart } from './components/DonutChart';
import { BudgetTracker } from './components/BudgetTracker';

// 輔助函式：取得離今天 offset 天數的日期字串 YYYY-MM-DD
const getDateOffset = (offset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// 精美範例數據
const INITIAL_DEMO_EXPENSES = (): Expense[] => [
  {
    id: 'demo-1',
    title: '深夜豚骨拉麵 🍜',
    amount: 280,
    category: 'food',
    date: getDateOffset(0),
    note: '與好友聚餐享用，叉燒超多',
  },
  {
    id: 'demo-2',
    title: '高鐵北高返程車票 🚄',
    amount: 1490,
    category: 'transport',
    date: getDateOffset(0),
    note: '週末返鄉探親車票',
  },
  {
    id: 'demo-3',
    title: '無印良品手動折傘 ☔',
    amount: 390,
    category: 'shopping',
    date: getDateOffset(1),
    note: '突然下大雨，急需備用傘',
  },
  {
    id: 'demo-4',
    title: '週末雙人電影票 🎬',
    amount: 640,
    category: 'entertainment',
    date: getDateOffset(2),
    note: '看最新上映的漫威科幻電影',
  },
  {
    id: 'demo-5',
    title: '感冒就醫健保掛號 💊',
    amount: 200,
    category: 'health',
    date: getDateOffset(4),
    note: '換季過敏不適，去診所拿藥',
  },
  {
    id: 'demo-6',
    title: '全聯有機鮮乳與雞胸肉 🥛',
    amount: 320,
    category: 'food',
    date: getDateOffset(5),
    note: '準備下週的減脂高蛋白便當',
  },
];

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(DEFAULT_BUDGET);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  
  // 行動裝置專用的分頁控制：'overview' (數據概覽) | 'add' (新增記帳) | 'list' (明細列表)
  const [activeMobileTab, setActiveMobileTab] = useState<'overview' | 'add' | 'list'>('overview');

  // 1. 初始化讀取 LocalStorage
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses_tracker_data');
    const storedBudget = localStorage.getItem('expenses_tracker_budget');

    if (storedExpenses) {
      try {
        setExpenses(JSON.parse(storedExpenses));
      } catch (e) {
        console.error('Failed to parse expenses data', e);
        setExpenses(INITIAL_DEMO_EXPENSES());
      }
    } else {
      // 首次進入載入演示數據，避免畫面空洞
      const demoData = INITIAL_DEMO_EXPENSES();
      setExpenses(demoData);
      localStorage.setItem('expenses_tracker_data', JSON.stringify(demoData));
    }

    if (storedBudget) {
      const bValue = parseFloat(storedBudget);
      if (!isNaN(bValue)) {
        setBudget(bValue);
      }
    }
  }, []);

  // 2. 當資料變化時存入 LocalStorage
  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('expenses_tracker_data', JSON.stringify(newExpenses));
  };

  const handleUpdateBudget = (newBudget: number) => {
    setBudget(newBudget);
    localStorage.setItem('expenses_tracker_budget', String(newBudget));
    triggerAlert('預算變更完成，目前記帳本已更新！');
  };

  // 3. 業務操作：新增與刪除
  const handleAddExpense = (newExpData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...newExpData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    triggerAlert(`已成功記入「${newExpData.title}」$${newExpData.amount}！`);
    
    // 如果在手機端記帳完成，貼心地切換回概覽頁
    setActiveMobileTab('overview');
  };

  const handleDeleteExpense = (id: string) => {
    const expToDelete = expenses.find(e => e.id === id);
    const updated = expenses.filter((e) => e.id !== id);
    saveExpenses(updated);
    if (expToDelete) {
      triggerAlert(`已刪除「${expToDelete.title}」理財記錄。`);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('確定要清空所有的記帳記錄嗎？此步驟將無法還原。')) {
      saveExpenses([]);
      setSelectedCategory(null);
      triggerAlert('已重置為全新狀態。');
    }
  };

  const handleLoadDemo = () => {
    const demoData = INITIAL_DEMO_EXPENSES();
    saveExpenses(demoData);
    setSelectedCategory(null);
    triggerAlert('已重置並加載 6 筆範例記帳數據！');
  };

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000); // 4秒後消逝
  };

  // 4. 下載/匯出今日小帳紀錄
  const handleExportTodayTxt = () => {
    const today = getDateOffset(0);
    const todayExpenses = expenses.filter(e => e.date === today);

    if (todayExpenses.length === 0) {
      triggerAlert('⚠️ 您今天尚未新增任何消費記錄，無法匯出喔！');
      return;
    }

    const CATEGORY_NAMES: Record<CategoryType, string> = {
      food: '餐飲食品 🍔',
      transport: '交通接駁 🚄',
      shopping: '購物血拼 🛍️',
      entertainment: '娛樂生活 🎬',
      health: '醫療保健 💊',
      housing: '居家生活 🏠',
      other: '其他雜項 📦',
    };

    let textContent = `========================================\n`;
    textContent += `       Expense Manager - 今日小帳記帳單\n`;
    textContent += `       日期：${today}\n`;
    textContent += `========================================\n\n`;

    let todaySum = 0;
    todayExpenses.forEach((exp, idx) => {
      const categoryName = CATEGORY_NAMES[exp.category] || exp.category;
      textContent += `${idx + 1}. 【${categoryName}】${exp.title}\n`;
      textContent += `   金額：NT$ ${Math.round(exp.amount).toLocaleString('zh-TW')} 元\n`;
      if (exp.note) {
        textContent += `   備註：${exp.note}\n`;
      }
      textContent += `----------------------------------------\n`;
      todaySum += exp.amount;
    });

    textContent += `\n今日交易總筆數：${todayExpenses.length} 筆\n`;
    textContent += `今日累計消費額：NT$ ${Math.round(todaySum).toLocaleString('zh-TW')} 元\n\n`;
    textContent += `========================================\n`;
    textContent += `產出時間：${new Date().toLocaleString('zh-TW')}\n`;
    textContent += `此資料由個人裝置本機產出，祝您理財順心！\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Expense_Manager_${today}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerAlert('📥 已成功匯出今日小帳！您可以自選存放的位置。');
  };

  // 5. 各種即時金額統計
  const todayStr = getDateOffset(0);
  const currentMonthStr = todayStr.substring(0, 7); // 'YYYY-MM'

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const monthExpenseAmount = expenses
    .filter((e) => e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  const uniqueDatesCount = new Set(expenses.map(e => e.date)).size || 1;
  const dailyAverage = Math.round(totalExpenseAmount / uniqueDatesCount);
  const budgetLeft = budget - monthExpenseAmount;

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans flex flex-col lg:flex-row overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 pb-20 lg:pb-0">
      {/* 1. 優雅通告浮動 Banner */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 bg-slate-900 border border-slate-800 text-white font-semibold text-xs rounded-full shadow-2xl flex items-center gap-2.5 max-w-sm sm:max-w-md"
            id="global-floating-toast"
          >
            <span className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
              <Sparkles size={13} />
            </span>
            <span className="truncate">{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 左側控制面板 Desktop Sidebar */}
      <aside className="w-full lg:w-[320px] bg-white border-b lg:border-r border-slate-205 lg:border-slate-200/80 p-5 lg:p-8 flex flex-col shrink-0 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <span className="text-xl">💳</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Expense Manager</h1>
              <p className="text-[10px] font-bold text-slate-400 font-sans">極簡隨手記帳</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="px-2.5 py-1.5 hover:bg-slate-50 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 transition-all flex items-center gap-1 cursor-pointer"
              id="btn-load-demo-mobile"
            >
              <Sparkles size={11} className="text-amber-500" />
              <span>載入範本</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1.5 hover:bg-rose-50 hover:text-rose-600 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-400 transition-all flex items-center gap-1 cursor-pointer"
              id="btn-clear-all-mobile"
            >
              <Trash2 size={11} />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 表單：在桌面側欄完美顯示，在行動裝置上則使用 Tab 專屬版面隱藏 */}
        <div className="hidden lg:block border-t border-slate-100 pt-5">
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </div>

        {/* 實用提示 / 指南卡片 */}
        <div className="mt-auto hidden lg:block p-4 bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 rounded-2xl">
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold leading-relaxed">
            💡 小撇步：點選右側圓環統計圖之類別，明細會立即為您篩選該類別；再次點選即可還原！
          </p>
        </div>
      </aside>

      {/* 3. 右側主內容顯示區 Main Section */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* 頂部 Spending Overview 橫幅 */}
        <header className="bg-white px-6 py-6 lg:px-10 lg:py-8 border-b border-slate-201 lg:border-slate-200/85">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Welcome, Alex Chen</p>
                <button
                  type="button"
                  onClick={handleExportTodayTxt}
                  className="px-2 py-0.5 bg-indigo-50 dark:bg-slate-900 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] rounded transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-[1.02]"
                  id="btn-export-today-txt"
                >
                  <span>📥 匯出今日小帳 (.txt)</span>
                </button>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">消費與預算概覽</h2>
            </div>
            
            <div className="text-left md:text-right flex flex-col self-stretch md:self-auto justify-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1 font-sans">
                累計總支出額 (TOTAL EXPENDITURE)
              </p>
              <div className="text-3xl lg:text-4xl font-light text-slate-900 flex items-baseline">
                <span className="text-lg font-bold text-slate-400 mr-1 font-sans">NT$</span>
                <span className="font-extrabold">{Math.round(totalExpenseAmount).toLocaleString('zh-TW')}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 行動裝置專屬分頁切換區 (RWD 體驗大幅優化) */}
        <div className="p-6 lg:p-10 flex flex-col gap-6">
          
          {/* 行動網頁端的核心分頁內容渲染 */}
          <div className="block lg:hidden">
            {activeMobileTab === 'overview' && (
              <div className="space-y-6">
                {/* 1. 數據指標卡 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-204/60 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">累計消費筆數</p>
                    <p className="text-3xl font-black mt-1 text-slate-800" id="stat-transactions-mobile">
                      {expenses.length} <span className="text-xs font-semibold text-slate-400">筆筆交易</span>
                    </p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-slate-204/60 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">每日平均支出</p>
                    <p className="text-3xl font-black mt-1 text-indigo-600" id="stat-daily-avg-mobile">
                      ${dailyAverage.toLocaleString('zh-TW')} <span className="text-xs font-semibold text-slate-400">元 / 天</span>
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-204/60 shadow-sm">
                    <p className={`text-xs font-bold uppercase tracking-wider ${budgetLeft >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {budgetLeft >= 0 ? '可用預算餘額' : '目前超出預算'}
                    </p>
                    <p className="text-3xl font-black mt-1 text-slate-800" id="stat-budget-left-mobile">
                      ${Math.abs(budgetLeft).toLocaleString('zh-TW')}
                    </p>
                  </div>
                </div>

                {/* 2. 預算配置 */}
                <BudgetTracker
                  totalAmount={monthExpenseAmount}
                  budget={budget}
                  onUpdateBudget={handleUpdateBudget}
                />

                {/* 3. 分配比例圖 */}
                <DonutChart
                  expenses={expenses}
                  onSelectCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              </div>
            )}

            {activeMobileTab === 'add' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">新增收支明細</h3>
                  <button
                    onClick={() => setActiveMobileTab('overview')}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg"
                  >
                    返回概覽
                  </button>
                </div>
                <AddExpenseForm onAddExpense={handleAddExpense} />
              </div>
            )}

            {activeMobileTab === 'list' && (
              <div className="flex flex-col">
                <ExpenseList
                  expenses={expenses}
                  onDeleteExpense={handleDeleteExpense}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            )}
          </div>

          {/* 傳統案頭端 (Desktop Layout) - 只要在大於等於 lg 寬度時才顯示，極為穩定 */}
          <div className="hidden lg:flex flex-col gap-6 w-full">
            {/* 指標儀表 3 欄 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">累計消費筆數</p>
                <p className="text-3xl font-black mt-1.5 text-slate-800" id="stat-transactions">
                  {expenses.length} <span className="text-xs font-semibold text-slate-400">筆筆交易</span>
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">每日平均支出</p>
                <p className="text-3xl font-black mt-1.5 text-indigo-600" id="stat-daily-avg">
                  ${dailyAverage.toLocaleString('zh-TW')} <span className="text-xs font-semibold text-slate-400">元 / 天</span>
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <p className={`text-xs font-bold uppercase tracking-wider ${budgetLeft >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {budgetLeft >= 0 ? '可用預算餘額' : '目前超出預算'}
                </p>
                <p className="text-3xl font-black mt-1.5 text-slate-800" id="stat-budget-left">
                  ${Math.abs(budgetLeft).toLocaleString('zh-TW')}
                </p>
              </div>
            </div>

            {/* 雙重主要卡片組合 */}
            <div className="grid grid-cols-2 xl:grid-cols-12 gap-6 items-start">
              {/* 左側：預算控制儀表 & 分配餅圖 (佔 5 欄) */}
              <div className="xl:col-span-5 space-y-6 w-full">
                <BudgetTracker
                  totalAmount={monthExpenseAmount}
                  budget={budget}
                  onUpdateBudget={handleUpdateBudget}
                />

                <DonutChart
                  expenses={expenses}
                  onSelectCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              </div>

              {/* 右側：消費交易明細列表 (佔 7 欄) */}
              <div className="xl:col-span-7 flex flex-col w-full">
                <ExpenseList
                  expenses={expenses}
                  onDeleteExpense={handleDeleteExpense}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </div>
          </div>

          {/* 底邊橫幅，載入範本 / 重設按鈕 (桌面版顯示) */}
          <footer className="bg-white p-5 border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 block">💡</span>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed text-center sm:text-left">
                本地儲存技術：資料僅保留在您個人的瀏覽器中，完全安全且絕不洩漏。
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                id="btn-load-demo-footer"
              >
                <Sparkles size={12} className="text-amber-500" />
                <span>載入演示範本</span>
              </button>
              
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg text-xs font-bold text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                id="btn-clear-all-footer"
              >
                <Trash2 size={12} />
                <span>清除全部記錄</span>
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* 4. 行動裝置專屬底端精美導航欄 (Mobile Bottom Tab Bar Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-lg">
        <button
          onClick={() => setActiveMobileTab('overview')}
          className={`flex flex-col items-center justify-center w-20 py-1 transition-all rounded-xl ${
            activeMobileTab === 'overview'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <SlidersHorizontal size={18} className="mb-0.5" />
          <span className="text-[10px] tracking-tight">數據概覽</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('add')}
          className="relative -top-4 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 cursor-pointer active:scale-95 transition-transform"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setActiveMobileTab('list')}
          className={`flex flex-col items-center justify-center w-20 py-1 transition-all rounded-xl ${
            activeMobileTab === 'list'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <FileSpreadsheet size={18} className="mb-0.5" />
          <span className="text-[10px] tracking-tight">明細記錄</span>
        </button>
      </div>
    </div>
  );
}
