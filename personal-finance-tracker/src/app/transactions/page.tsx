'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import TransactionChart from '@/components/TransactionChart';
import TransactionSummary from '@/components/TransactionSummary';

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const res = await axios.get('/api/transactions');
    setTransactions(res.data.transactions);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">

      {/* summary card */}
      <div>
        <TransactionSummary transactions={transactions}/>
      </div>
      
       {/* Chart at the bottom, full width */}
       <div>
        <TransactionChart transactions={transactions} />
      </div>

      
      {/* Form and List Side-by-Side */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 w-full">
          <TransactionForm
            editingTx={editingTx}
            clearEdit={() => setEditingTx(null)}
            refresh={fetchTransactions}
          />
        </div>
        <div className="md:w-2/3 w-full">
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTx}
            refresh={fetchTransactions}
          />
        </div>
      </div>

     
    </div>
  );
}
