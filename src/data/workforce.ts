/* Source of truth for the portfolio's workforce floor.
   Mirrors the roster in the private ai-workforce repo (docs/org.md):
   six functions plus the chief-of-staff hub, 25 roles total. */

export type WorkforceMode = 'all' | 'subagent';

export interface WorkforceRole {
  name: string;
  owns: string;
  mode: WorkforceMode;
}

export interface WorkforceFunction {
  id: 'product' | 'prototype' | 'research' | 'marketing' | 'support' | 'security';
  label: string;
  accent: string;
  handoff: string;
  roles: WorkforceRole[];
}

export const workforceHub: WorkforceRole & { label: string } = {
  label: 'Leadership',
  name: 'chief-of-staff',
  owns: 'weekly plan, OKRs, handoffs',
  mode: 'all',
};

export const workforceFunctions: WorkforceFunction[] = [
  {
    id: 'product',
    label: 'Product & Eng',
    accent: '#7aa2f7',
    handoff: 'plan → design → build → review',
    roles: [
      { name: 'pm', owns: 'PRD, acceptance criteria, backlog', mode: 'all' },
      { name: 'architect', owns: 'ADR, API/data contracts', mode: 'subagent' },
      { name: 'builder', owns: 'implementation + tests + PR', mode: 'all' },
      { name: 'reviewer', owns: 'code review', mode: 'subagent' },
      { name: 'qa', owns: 'test plan, e2e, regression', mode: 'subagent' },
      { name: 'release', owns: 'release note, deploy dispatch', mode: 'subagent' },
      { name: 'sre', owns: 'health, capacity, dependency risk', mode: 'subagent' },
      { name: 'librarian', owns: 'docs, runbooks, decision log', mode: 'subagent' },
    ],
  },
  {
    id: 'prototype',
    label: 'Prototype',
    accent: '#bb9af7',
    handoff: 'user flow → clickable preview',
    roles: [
      { name: 'ux-designer', owns: 'flows, wireframes, states', mode: 'subagent' },
      { name: 'prototyper', owns: 'clickable HTML + preview link', mode: 'subagent' },
      { name: 'design-critic', owns: 'heuristic review, decision memo', mode: 'subagent' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    accent: '#7dcfff',
    handoff: 'market brief → user evidence → metrics',
    roles: [
      { name: 'market-researcher', owns: 'market/competitor/pricing, cited', mode: 'subagent' },
      { name: 'user-researcher', owns: 'interviews, usability, personas', mode: 'subagent' },
      {
        name: 'data-analyst',
        owns: 'event definitions, funnels, weekly metrics',
        mode: 'subagent',
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    accent: '#ff9e64',
    handoff: 'content draft → growth test',
    roles: [
      { name: 'marketing-lead', owns: 'positioning, channels, budget', mode: 'subagent' },
      { name: 'content-seo', owns: 'content drafts, SEO briefs', mode: 'subagent' },
      { name: 'growth', owns: 'experiments, CRO, activation', mode: 'subagent' },
      { name: 'brand-designer', owns: 'identity, creative assets', mode: 'subagent' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    accent: '#9ece6a',
    handoff: 'triage → incident timeline',
    roles: [
      { name: 'prod-support', owns: 'first response, triage, timeline', mode: 'subagent' },
      { name: 'incident-commander', owns: 'severity, decisions, comms cadence', mode: 'all' },
      { name: 'customer-comms', owns: 'status updates, support replies', mode: 'subagent' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    accent: '#f7768e',
    handoff: 'advisory → patch → review',
    roles: [
      { name: 'sec-intel', owns: 'advisories, weekly bulletin', mode: 'subagent' },
      { name: 'patch-engineer', owns: 'dependency/vulnerability patches', mode: 'subagent' },
      { name: 'sec-reviewer', owns: 'auth/upload/crypto/dependency review', mode: 'subagent' },
    ],
  },
];

export const workforceRoles = [workforceHub, ...workforceFunctions.flatMap((fn) => fn.roles)];

export const workforceRoleCount = workforceRoles.length;
