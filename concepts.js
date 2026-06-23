// Atlas index: domains, concept-type colours, language-level metadata, relationship chains
import { A } from './data/a.js';
import { A2 } from './data/a2.js';
import { A3 } from './data/a3.js';
import { B } from './data/b.js';
import { B2 } from './data/b2.js';
import { C } from './data/c.js';
import { C2 } from './data/c2.js';
import { D } from './data/d.js';
import { D2 } from './data/d2.js';
import { E } from './data/e.js';
import { E2 } from './data/e2.js';
import { E3 } from './data/e3.js';
import { E4 } from './data/e4.js';

export const CONCEPTS = [...A, ...A2, ...A3, ...B, ...B2, ...C, ...C2, ...D, ...D2, ...E, ...E2, ...E3, ...E4];

export { PAGES } from './pages.js';

// 13 coverage-gate domains. Accent colours share lightness & chroma, vary hue (oklch).
export const DOMAINS = [
  { id:'structures',   label:'Data Structures & ADTs',        short:'Structures',   hue:25  },
  { id:'algos',        label:'Algorithms & Paradigms',        short:'Algorithms',   hue:55  },
  { id:'paradigms',    label:'Programming Paradigms',         short:'Paradigms',    hue:88  },
  { id:'fp',           label:'Functional & Monadic',          short:'Functional',   hue:140 },
  { id:'types',        label:'Type Systems',                  short:'Types',        hue:168 },
  { id:'concurrency',  label:'Concurrency & Parallelism',     short:'Concurrency',  hue:205 },
  { id:'hardware',     label:'SIMD & Hardware Execution',     short:'Hardware',     hue:248 },
  { id:'memory',       label:'Memory & Resources',            short:'Memory',       hue:285 },
  { id:'reliability',  label:'Reliability & Defensive',       short:'Reliability',  hue:318 },
  { id:'architecture', label:'Design & Architecture',         short:'Architecture', hue:5   },
  { id:'testing',      label:'Testing & Verification',        short:'Testing',      hue:42  },
  { id:'security',     label:'Security',                      short:'Security',     hue:118 },
  { id:'observability',label:'Observability & Performance',   short:'Observability',hue:228 },
];

export const DOMAIN_MAP = Object.fromEntries(DOMAINS.map(d => [d.id, d]));
export const domainColor = (id, l=0.62, c=0.105) => {
  const d = DOMAIN_MAP[id]; if (!d) return 'oklch(0.6 0 0)';
  return `oklch(${l} ${c} ${d.hue})`;
};
export const domainTint = (id, l=0.96, c=0.03) => domainColor(id, l, c);

// Language support levels (the SUPPORT dimension), with colour + rank.
export const LEVELS = {
  NATIVE:    { label:'Native',    rank:6, l:0.58, c:0.13, hue:150, blurb:'Directly represented by the language' },
  STD:       { label:'Std lib',   rank:5, l:0.58, c:0.12, hue:245, blurb:'Provided by the standard library / runtime' },
  ECO:       { label:'Ecosystem', rank:4, l:0.62, c:0.10, hue:195, blurb:'Provided by a mature ecosystem library/framework' },
  ENCODABLE: { label:'Encodable', rank:3, l:0.70, c:0.12, hue:78,  blurb:'Practical via conventions / manual encoding' },
  AWKWARD:   { label:'Awkward',   rank:2, l:0.66, c:0.14, hue:45,  blurb:'Possible but non-idiomatic or disproportionately hard' },
  UNSUITABLE:{ label:'Unsuitable',rank:1, l:0.60, c:0.11, hue:25,  blurb:'Technically possible but normally inappropriate' },
  UNKNOWN:   { label:'Unknown',   rank:0, l:0.70, c:0.005,hue:250, blurb:'Insufficient evidence' },
};
export const levelColor = (lvl) => { const m = LEVELS[lvl]||LEVELS.UNKNOWN; return `oklch(${m.l} ${m.c} ${m.hue})`; };

export const LANGS = [
  { id:'c',    label:'C' },
  { id:'cpp',  label:'C++' },
  { id:'cs',   label:'C#' },
  { id:'java', label:'Java' },
  { id:'rust', label:'Rust' },
];

// Cross-category relationship chains — the centrepiece. node.id links to a concept when present.
export const RELATIONSHIPS = [
  {
    id:'fp-concurrency',
    title:'Functional core → fearless concurrency',
    caption:'Eliminating shared mutable state at the value level removes whole classes of concurrency hazard.',
    nodes:[
      { id:'functional-programming', label:'Functional programming', domain:'fp' },
      { id:'immutability',           label:'Immutability',           domain:'fp' },
      { id:'persistent-data-structures', label:'Persistent structures', domain:'fp' },
      { label:'Structural sharing', domain:'fp' },
      { label:'Safe concurrent reads', domain:'concurrency' },
    ],
  },
  {
    id:'monadic-errors',
    title:'Monadic composition → defensive error handling',
    caption:'Encoding failure in the type turns error handling into composable data flow rather than hidden control flow.',
    nodes:[
      { id:'monad',         label:'Monadic composition', domain:'fp' },
      { id:'result-either', label:'Result / Either',     domain:'fp' },
      { label:'Explicit failure context', domain:'fp' },
      { label:'Pipeline composition', domain:'fp' },
      { id:'fail-fast',     label:'Defensive error handling', domain:'reliability' },
    ],
  },
  {
    id:'dod-simd',
    title:'Data-oriented design → SIMD throughput',
    caption:'Shaping data for the cache is what makes vectorisation and game/HPC-scale performance possible.',
    nodes:[
      { id:'data-oriented-design',   label:'Data-oriented design', domain:'paradigms' },
      { id:'structure-of-arrays',    label:'Structure of Arrays',  domain:'memory' },
      { label:'Contiguous memory', domain:'memory' },
      { id:'cache-blocking',         label:'Cache locality',       domain:'hardware' },
      { id:'simd',                   label:'SIMD suitability',     domain:'hardware' },
      { id:'ecs',                    label:'Game-engine / HPC',    domain:'architecture' },
    ],
  },
  {
    id:'ownership-systems',
    title:'Ownership & borrowing → systems-grade safety',
    caption:'A compile-time ownership discipline yields determinism and data-race freedom without a GC.',
    nodes:[
      { id:'ownership-borrowing',  label:'Ownership & borrowing', domain:'memory' },
      { id:'raii',                 label:'Deterministic cleanup', domain:'memory' },
      { label:'No use-after-free', domain:'memory' },
      { id:'lock-free',            label:'Concurrency guarantees', domain:'concurrency' },
      { label:'Systems / embedded', domain:'memory' },
    ],
  },
  {
    id:'circuit-resilience',
    title:'Circuit breaker → distributed resilience',
    caption:'Local failure-isolation primitives compose into system-wide graceful degradation.',
    nodes:[
      { id:'circuit-breaker', label:'Circuit breaker', domain:'reliability' },
      { label:'Failure isolation', domain:'reliability' },
      { id:'bulkhead',        label:'Graceful degradation', domain:'reliability' },
      { id:'retry-backoff',   label:'Resilient retries', domain:'reliability' },
      { id:'microservices',   label:'Cloud / fintech', domain:'architecture' },
    ],
  },
  {
    id:'adt-safety',
    title:'Algebraic data types → unrepresentable bugs',
    caption:'Modelling data as sum/product types plus exhaustive matching pushes whole error classes to compile time.',
    nodes:[
      { id:'algebraic-data-types', label:'Algebraic data types', domain:'fp' },
      { id:'pattern-matching',     label:'Exhaustive matching', domain:'fp' },
      { id:'option-maybe',         label:'Option instead of null', domain:'fp' },
      { label:'No null-deref / missing case', domain:'types' },
      { id:'static-dynamic-typing',label:'Compile-time guarantees', domain:'types' },
    ],
  },
  {
    id:'test-pyramid',
    title:'Test pyramid → fearless refactoring',
    caption:'Layered, increasingly rigorous tests turn a codebase into something safe to change.',
    nodes:[
      { id:'unit-testing',          label:'Unit tests', domain:'testing' },
      { id:'property-based-testing',label:'Property-based tests', domain:'testing' },
      { id:'mutation-testing',      label:'Mutation testing', domain:'testing' },
      { label:'Trustworthy suite', domain:'testing' },
      { label:'Confidence to refactor', domain:'reliability' },
    ],
  },
  {
    id:'consensus-consistency',
    title:'Consensus → strong consistency',
    caption:'Agreeing on an ordered log is the foundation that makes a distributed store behave like one machine.',
    nodes:[
      { id:'raft',                label:'Raft consensus', domain:'algos' },
      { label:'Replicated log (majority quorum)', domain:'algos' },
      { label:'Linearizable state machine', domain:'algos' },
      { id:'two-phase-commit',    label:'Atomic commit', domain:'algos' },
      { id:'microservices',       label:'Distributed databases', domain:'architecture' },
    ],
  },
  {
    id:'arena-latency',
    title:'Arena allocation → predictable latency',
    caption:'Bulk-lifetime allocation sidesteps GC pauses and fragmentation where tail latency is sacred.',
    nodes:[
      { id:'arena-allocation', label:'Arena / region', domain:'memory' },
      { label:'No per-object free', domain:'memory' },
      { label:'No GC pause / fragmentation', domain:'memory' },
      { label:'Bounded tail latency', domain:'hardware' },
      { id:'ecs',              label:'Games / trading', domain:'architecture' },
    ],
  },
  {
    id:'async-scale',
    title:'Event loop → massive I/O concurrency',
    caption:'Cooperative suspension lets a handful of threads serve enormous numbers of connections.',
    nodes:[
      { id:'event-loop',            label:'Event loop / reactor', domain:'concurrency' },
      { id:'async-await',           label:'Async / await', domain:'concurrency' },
      { id:'structured-concurrency',label:'Structured concurrency', domain:'concurrency' },
      { id:'backpressure',          label:'Backpressure', domain:'concurrency' },
      { label:'C10k+ servers', domain:'observability' },
    ],
  },
  {
    id:'security-depth',
    title:'Threat modelling → zero trust',
    caption:'Security is a layered discipline: identify threats, minimise privilege, and never trust implicitly.',
    nodes:[
      { id:'threat-modeling', label:'Threat modelling', domain:'security' },
      { id:'least-privilege', label:'Least privilege', domain:'security' },
      { id:'defense-in-depth',label:'Defence in depth', domain:'security' },
      { id:'zero-trust',      label:'Zero-trust architecture', domain:'security' },
    ],
  },
  {
    id:'solid-maintainability',
    title:'SOLID principles → maintainable systems',
    caption:'The object-design principles compound: each reduces coupling, and together they buy changeability and testability.',
    nodes:[
      { id:'single-responsibility', label:'Single responsibility', domain:'architecture' },
      { id:'open-closed-principle', label:'Open-closed', domain:'architecture' },
      { id:'dependency-inversion',  label:'Dependency inversion', domain:'architecture' },
      { label:'Loose coupling', domain:'architecture' },
      { label:'Maintainable & testable', domain:'testing' },
    ],
  },
  {
    id:'observability-reliability',
    title:'Telemetry → data-driven reliability',
    caption:'You cannot improve what you cannot see: signals feed objectives, and error budgets turn reliability into a decision.',
    nodes:[
      { id:'metrics',             label:'Metrics', domain:'observability' },
      { id:'distributed-tracing', label:'Distributed tracing', domain:'observability' },
      { id:'slo-sli',             label:'SLOs / SLIs', domain:'observability' },
      { label:'Error budget', domain:'reliability' },
      { id:'canary-release',      label:'Safe, fast releases', domain:'observability' },
    ],
  },
  {
    id:'adt-implementation',
    title:'ADT → implementation → complexity → fit',
    caption:'An abstract data type names the contract; the concrete structure you pick fixes the complexity profile and thus the workloads it suits.',
    nodes:[
      { id:'queue-adt',    label:'Priority queue (ADT)', domain:'structures' },
      { id:'binary-heap',  label:'Binary heap (impl)', domain:'structures' },
      { label:'O(log n) push / pop-min', domain:'structures' },
      { id:'dijkstra',     label:'Dijkstra / scheduling', domain:'algos' },
    ],
  },
];

// Maps each primary concept type to one of the type-specific card templates.
export const TEMPLATE_MAP = {
  'Data structure':'ds', 'Abstract data type':'ds', 'Distributed structure':'ds', 'Spatial structure':'ds', 'Probabilistic structure':'ds', 'Storage structure':'ds', 'Concurrent data structure':'ds',
  'Algorithm':'algo', 'Algorithmic paradigm':'algo',
  'Programming paradigm':'paradigm', 'Programming style':'paradigm',
  'Functional abstraction':'functional',
  'Defensive-programming practice':'defensive', 'Reliability or resilience practice':'defensive', 'Error-handling technique':'defensive',
  'Hardware-execution model':'hardware', 'Performance-optimisation technique':'hardware', 'Data-layout technique':'hardware', 'Parallel-computing model':'hardware',
  'Design principle':'design', 'Design pattern':'design', 'Architectural pattern':'design', 'Distributed-systems pattern':'design',
  'Testing technique':'testing', 'Verification technique':'testing', 'Debugging or observability technique':'testing',
  'Concurrency model':'concurrency', 'Synchronisation mechanism':'concurrency',
  'Type-system technique':'types',
  'Resource-management technique':'generic', 'Language idiom':'generic', 'Security practice':'generic',
  'Build or deployment practice':'generic', 'Protocol':'generic', 'Mathematical method':'generic', 'Domain-specific engineering technique':'generic',
};
export const TEMPLATE_LABEL = {
  ds:'Data-structure card', algo:'Algorithm card', paradigm:'Programming-paradigm card',
  functional:'Functional-abstraction card', defensive:'Defensive-practice card', hardware:'Hardware-execution card',
  design:'Design / architecture card', testing:'Testing / verification card', concurrency:'Concurrency-model card',
  types:'Type-system card', generic:'Technique card',
};
