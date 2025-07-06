import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent,  } from "@/components/ui/dialog";
import { Transaction } from "@/app/transactions/page";
import axios from "axios";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  refresh: () => void;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

export default function TransactionList({ transactions, onEdit, refresh }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/transactions/${id}`);
    toast("Transaction Deleted");
    refresh();
  };

  const grouped = transactions.reduce((acc: Record<string, Transaction[]>, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "long",
      year: "numeric"
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    return (
      new Date(grouped[b][0].date).getTime() -
      new Date(grouped[a][0].date).getTime()
    );
  });

  // Pie chart data for the selected month
  const getPieData = (month: string) => {
    const txs = grouped[month] || [];
    const summary: Record<string, number> = {};
    txs.forEach((tx) => {
      summary[tx.category] = (summary[tx.category] || 0) + tx.amount;
    });
    return Object.entries(summary).map(([name, value]) => ({ name, value }));
  };

  return (
    <Card className="h-full shadow-lg border border-gray-200">
      <CardContent className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6 tracking-tight text-primary">Transaction List</h2>
        <ScrollArea className="h-80 pr-2">
          {sortedMonths.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No transactions yet.
            </div>
          ) : (
            <div className="space-y-8">
              {sortedMonths.map((month) => (
                <div key={month}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary/80 border-b border-gray-200 pb-1">
                      {month}
                    </h3>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedMonth(month)}
                    >
                      View Chart
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {grouped[month].map((tx) => (
                      <div
                        key={tx._id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-muted rounded-lg bg-muted/30 hover:bg-muted/50 transition px-4 py-3 shadow-sm"
                      >
                        {/* Left: Amount and Info */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                          <div className="font-semibold text-xl text-green-600 min-w-[90px]">₹{tx.amount}</div>
                          <div className="flex-1">
                            <div className="text-base font-medium">{tx.description}</div>
                            <div className="text-xs text-gray-500">{new Date(tx.date).toDateString()}</div>
                            {tx.category && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <span className="font-semibold">Category:</span>{" "}
                                <span className="capitalize">{tx.category}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Right: Actions */}
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => onEdit(tx)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(tx._id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Pie Chart Modal */}
      <Dialog open={!!selectedMonth} onOpenChange={(open) => !open && setSelectedMonth(null)}>
        <DialogContent className="max-w-md">
          <h4 className="text-lg font-semibold mb-4 text-center">
            {selectedMonth} Expenses
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={selectedMonth ? getPieData(selectedMonth) : []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(selectedMonth ? getPieData(selectedMonth) : []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
