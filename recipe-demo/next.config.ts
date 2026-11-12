import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Stops `next dev` writing AGENTS.md and CLAUDE.md into this folder when it
  // detects a coding agent. This is a frozen comparison artifact, so those files
  // are diff noise rather than something a future contributor benefits from.
  agentRules: false,
};

export default nextConfig;
