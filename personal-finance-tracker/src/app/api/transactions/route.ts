import { NextRequest, NextResponse } from 'next/server';
import TransactionModel from '@/model/TransactionModel';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { amount, date, description, category } = body;

    const transaction = await TransactionModel.create({ amount, date, description, category });
    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add transaction', error }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const transactions = await TransactionModel.find().sort({ date: -1 });
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch transactions', error }, { status: 500 });
  }
}

