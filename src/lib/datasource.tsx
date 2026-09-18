'use client';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { SponsorRecord } from './sponsor-model';

const Context = createContext<SponsorRecord[]>([]);
export function SponsorProvider({records, children}: {records: SponsorRecord[]; children: React.ReactNode}) {
  return <Context.Provider value={records}>{children}</Context.Provider>;
}
export const datasource = { define: <T extends Record<string, string>>(sources: T) => sources };
export const q = { select: <T extends Record<string, string>>(fields: T) => fields };

// Compatibility boundary: keeps the Softr views intact while records originate on the server.
export function useRecords({select, count}: {from: string; select: Record<string, string>; count: number}) {
  const records = useContext(Context);
  const [limit, setLimit] = useState(count);
  const data = useMemo(() => ({pages: [{items: records.slice(0, limit).map(record => ({
    id: record.id,
    fields: Object.fromEntries(Object.entries(select).map(([alias, key]) => [alias, record.fields[key] ?? null])),
  }))}]}), [records, select, limit]);
  return {data, status: 'success', error: null as Error | null, hasNextPage: limit < records.length,
    isFetchingNextPage: false, fetchNextPage: () => setLimit(n => n + count)};
}

export function useRecordCreate(options: {from: string; fields: Record<string, string>}) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);
  const enabled = options.from === 'applications';
  const mutateAsync = useCallback(async (values: unknown) => {
    if (!enabled) throw new Error('This record type cannot be created.');
    setStatus('pending'); setError(null);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'The application could not be saved.');
      setStatus('success');
      return result;
    } catch (cause) {
      const next = cause instanceof Error ? cause : new Error(String(cause));
      setError(next); setStatus('error'); throw next;
    }
  }, [enabled]);
  return {enabled, status, error, mutateAsync};
}
