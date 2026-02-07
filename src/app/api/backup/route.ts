import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.resolve(process.cwd(), 'sqlite.db');
    const fileBuffer = await readFile(dbPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/x-sqlite3',
        'Content-Disposition': 'attachment; filename="trade-os-backup.db"',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}
