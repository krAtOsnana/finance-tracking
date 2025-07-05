import { NextRequest, NextResponse } from 'next/server';
import TransactionModel from '@/model/TransactionModel';
import dbConnect from '@/lib/dbConnect';

// PUT /api/transactions/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } =await context.params;
    const body = await req.json();

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTransaction) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, transaction: updatedTransaction });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update transaction', error }, { status: 500 });
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } =await context.params;

    const deleted = await TransactionModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete transaction', error }, { status: 500 });
  }
}
