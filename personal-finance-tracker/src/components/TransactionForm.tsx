'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'; // If you use the cn utility for class merging
import axios from 'axios';
import { Transaction } from '@/app/transactions/page';

interface Props {
  editingTx: Transaction | null;
  clearEdit: () => void;
  refresh: () => void;
}

export default function TransactionForm({ editingTx, clearEdit, refresh }: Props) {
  const [form, setForm] = useState({ amount: '', date: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTx) {
      setForm({
        amount: editingTx.amount.toString(),
        date: editingTx.date.slice(0, 10),
        description: editingTx.description,
      });
    } else {
      setForm({ amount: '', date: '', description: '' });
    }
  }, [editingTx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
      description: form.description,
    };
    try {
      if (editingTx) {
        await axios.put(`/api/transactions/${editingTx._id}`, data);
      } else {
        await axios.post('/api/transactions', data);
      }
      setForm({ amount: '', date: '', description: '' });
      clearEdit();
      refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg border-2 border-muted">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {editingTx ? 'Edit Transaction' : 'Add Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-base">Amount</Label>
          <Input
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            type="number"
            min="0"
            step="0.01"
            className="focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-base">Date</Label>
          <Input
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="Select date"
            type="date"
            className="focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">Description</Label>
          <Input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="focus:ring-2 focus:ring-primary/50"
            maxLength={80}
          />
          <div className="text-xs text-muted-foreground text-right">
            {form.description.length}/80
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 justify-end">
        {editingTx && (
          <Button
            variant="outline"
            onClick={clearEdit}
            disabled={loading}
            className="transition-all"
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading || !form.amount || !form.date || !form.description}
          className={cn(
            "transition-all",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading
            ? (editingTx ? 'Updating...' : 'Adding...')
            : (editingTx ? 'Update Transaction' : 'Add Transaction')}
        </Button>
      </CardFooter>
    </Card>
  );
}
