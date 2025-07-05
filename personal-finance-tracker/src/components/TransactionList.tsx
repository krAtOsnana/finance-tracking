import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Transaction } from '@/app/transactions/page';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  refresh: () => void;
}

export default function TransactionList({ transactions, onEdit, refresh }: Props) {
  const handleDelete = async (id: string) => {
    await axios.delete(`/api/transactions/${id}`);
    toast("Transaction Deleted")
    refresh();
  };

  const grouped = transactions.reduce((acc: Record<string, Transaction[]>, tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    return new Date(grouped[b][0].date).getTime() - new Date(grouped[a][0].date).getTime();
  });

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
        <ScrollArea className="h-80 pr-2">
          {sortedMonths.length === 0 && (
            <div className="text-muted-foreground text-center py-8">No transactions yet.</div>
          )}
          <div className="space-y-6">
            {sortedMonths.map(month => (
              <div key={month}>
                <h3 className="text-lg font-semibold mb-2">{month}</h3>
                <div className="space-y-2">
                  {grouped[month].map(tx => (
                    <div key={tx._id} className="flex justify-between items-center border p-2 rounded bg-muted/30 hover:bg-muted/50 transition">
                      <div>
                        <div className="font-medium">₹{tx.amount}</div>
                        <div className="text-sm text-gray-500">{new Date(tx.date).toDateString()}</div>
                        <div className="text-sm">{tx.description}</div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(tx)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(tx._id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
