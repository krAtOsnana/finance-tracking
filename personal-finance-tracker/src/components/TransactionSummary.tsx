import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/app/transactions/page';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
}

export default function TransactionSummary({ transactions }: Props) {
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const recent = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const categoryMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  });

  const categoryBreakdown = Object.entries(categoryMap);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Expense */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expense</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-bold text-green-700">
          ₹{total.toFixed(2)}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {categoryBreakdown.map(([category, amount]) => (
              <li key={category} className="flex justify-between">
                <span className="capitalize">{category}</span>
                <span>₹{amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Most Recent Transaction */}
      <Card>
        <CardHeader>
          <CardTitle>Most Recent</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          {recent ? (
            <>
              <div className="font-semibold">₹{recent.amount}</div>
              <div>{recent.description}</div>
              <div className="text-xs text-gray-500">
                {format(new Date(recent.date), 'dd MMM yyyy')}
              </div>
              <div className="text-xs text-muted-foreground">
                Category: <span className="capitalize">{recent.category}</span>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">No recent transaction</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
