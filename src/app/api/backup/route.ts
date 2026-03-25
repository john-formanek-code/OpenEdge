import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { getDatabaseUrl, isFileDatabaseUrl } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const databaseUrl = getDatabaseUrl();
    if (!isFileDatabaseUrl(databaseUrl)) {
      return NextResponse.json(
        { error: 'Backup endpoint is only available for file-based local SQLite databases.' },
        { status: 400 }
      );
    }

    const dbPath = path.resolve(process.cwd(), databaseUrl.replace(/^file:/, ''));
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
