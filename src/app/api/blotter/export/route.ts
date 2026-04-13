import { getBlotter } from "@/lib/actions/hypotheses";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getBlotter();
    
    // Create CSV header
    let csv = "TIMESTAMP,TICKER,SIDE,PRICE,SIZE,FEE,HYPOTHESIS_ID\n";
    
    // Append rows
    for (const exec of data) {
      const timestamp = exec.executedAt ? exec.executedAt.toISOString() : '';
      csv += `${timestamp},${exec.symbol},${exec.side.toUpperCase()},${exec.price},${exec.size},${exec.fee || 0},${exec.hypothesisId}\n`;
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="openedge-blotter-export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Blotter export failed' }, { status: 500 });
  }
}
