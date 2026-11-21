import type { NextConfig } from 'next';
// This temporary preview is read-only and can be hosted as static files.
const config: NextConfig = { devIndicators: false, output: 'export' };
export default config;
