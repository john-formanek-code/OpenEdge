import { db } from "@/db";
import { hypotheses, activityLogs } from "@/db/schema";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allHypotheses = await db.select().from(hypotheses);
    const allLogs = await db.select().from(activityLogs);
    
    const data = {
      hypotheses: allHypotheses,
      logs: allLogs,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="trade-os-export.json"',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
