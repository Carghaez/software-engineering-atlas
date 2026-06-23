// P5 — declarative definitions for the Atlas Maps infographic pages.
// kind 'clusters': grouped clickable concept chips. kind 'matrix': concept × dimension comparison table.
export const PAGES = [
{
  id:'abstraction-ladder', nav:'Abstraction ladder', kind:'clusters',
  title:'Abstraction & application ladder',
  intro:'Where a technique lives decides who controls it, what evidence applies, and whether its effect is direct (D — you invoke it) or indirect (I — a compiler, runtime, library or platform applies it for you). Many techniques are BOTH. Propagation principle: indirect mechanisms still dominate behaviour — a GC pause, JIT decision, cache miss or query plan can swamp code that never names them.',
  groups:[
    { label:'L0 · Hardware & execution', note:'Direct effect, indirect control — cache hierarchy, branch predictors, SIMD lanes, NUMA, GPUs.', ids:['simd','gpu-computing','instruction-level-parallelism','numa-awareness','false-sharing','prefetching'] },
    { label:'L1 · Compiler & type system', note:'Mostly indirect — ownership checks, monomorphisation, JIT, escape analysis, auto-vectorisation.', ids:['auto-vectorization','escape-analysis','ownership-borrowing','parametric-polymorphism','type-inference','loop-unrolling'] },
    { label:'L2 · Language, runtime & standard library', note:'Direct + indirect — exceptions, GC, tasks, collections, atomics, pattern matching.', ids:['exception-safety','garbage-collection','async-await','atomics-cas','pattern-matching','raii','reference-counting'] },
    { label:'L3 · Libraries, frameworks, engines & databases', note:'Selectable APIs over runtimes — actors, ECS, query planners, job systems, resilience middleware.', ids:['actors','ecs','thread-pool','work-stealing','circuit-breaker','lsm-tree'] },
    { label:'L4 · Application & distributed architecture', note:'Direct design choices — DDD, hexagonal boundaries, CQRS, event sourcing, circuit breakers.', ids:['hexagonal-architecture','clean-architecture','cqrs','event-sourcing','microservices','saga-pattern'] },
    { label:'L5 · Operational system & organisation', note:'Feedback & control — telemetry, SLOs, canaries, chaos, incident response, capacity planning.', ids:['distributed-tracing','metrics','slo-sli','canary-release','chaos-engineering','capacity-planning'] },
  ]
},
{
  id:'paradigm-tree', nav:'Paradigm family tree', kind:'clusters',
  title:'Programming-paradigm family tree',
  intro:'Paradigms are ways of structuring computation, not algorithms. They branch from two roots — telling the machine HOW (imperative) vs WHAT (declarative) — and recombine into hybrid and specialised styles.',
  groups:[
    { label:'Imperative root — describe HOW', note:'State changed by explicit, ordered commands.', ids:['imperative-programming','structured-programming','procedural','oop'] },
    { label:'Declarative root — describe WHAT', note:'Specify the result; the engine decides execution.', ids:['declarative','functional-programming','logic-programming','constraint-programming','rule-based-systems'] },
    { label:'Dataflow & reactive', note:'Computation driven by data availability / change.', ids:['dataflow-programming','reactive-programming','functional-reactive-programming','stream-processing','event-driven'] },
    { label:'Abstraction & generative', note:'Programs that abstract over or generate code.', ids:['generic-programming','metaprogramming','aspect-oriented','component-based'] },
    { label:'Data- & performance-oriented', note:'Organise around data layout and the machine.', ids:['data-oriented-design','ecs','table-driven','pipeline-oriented'] },
    { label:'Concurrent & distributed', note:'Structure around independent, communicating units.', ids:['actors','csp-channels','async-await','message-passing'] },
    { label:'Emerging & specialised', note:'Domain-specific modern paradigms.', ids:['probabilistic-programming','differentiable-programming'] },
  ]
},
{
  id:'fp-map', nav:'FP & monad map', kind:'clusters',
  title:'Functional-programming & monadic-abstraction map',
  intro:'Functional programming builds from pure values upward into algebraic abstractions. Note the distinction the manifest insists on: the paradigm (FP) is separate from the compositional abstractions (functor/monad) it commonly uses.',
  groups:[
    { label:'1 · Core principles', note:'The non-negotiable foundations.', ids:['pure-functions','referential-transparency','immutability','first-class-functions','higher-order-functions','closures'] },
    { label:'2 · Composition & evaluation', note:'How small functions combine.', ids:['function-composition','currying','lazy-evaluation','tail-call-optimization','trampolining','continuation-passing-style','kleisli-composition'] },
    { label:'3 · Data modelling', note:'Make illegal states unrepresentable.', ids:['algebraic-data-types','pattern-matching','persistent-data-structures','zipper'] },
    { label:'4 · Algebraic structures', note:'Laws enabling generic, parallel-safe combination.', ids:['monoid','functor','applicative','monad','comonad','bifunctor','contravariant-functor'] },
    { label:'5 · Effect types & monads', note:'Encode failure / optionality / context in the type.', ids:['option-maybe','result-either','reader-monad','writer-monad','state-monad','io-monad'] },
    { label:'6 · Advanced effects & optics', note:'Composing and focusing effects (mostly HKT-rich langs).', ids:['monad-transformers','free-monad','tagless-final','algebraic-effects','lenses-optics','prisms'] },
  ]
},
{
  id:'type-map', nav:'Type-system map', kind:'clusters',
  title:'Type-system technique map',
  intro:'From everyday typing disciplines through polymorphism to substructural and dependent types. Most advanced techniques are only encodable (not native) in C/C++/C#/Java/Rust — the cards mark which.',
  groups:[
    { label:'Discipline', note:'When and how strongly types are checked.', ids:['static-dynamic-typing','gradual-typing','type-inference','nominal-structural-typing','duck-typing','type-erasure'] },
    { label:'Polymorphism', note:'One piece of code over many types.', ids:['parametric-polymorphism','subtype-polymorphism','ad-hoc-polymorphism','bounded-polymorphism','typeclasses-traits','associated-types','variance','generic-programming'] },
    { label:'Data modelling', note:'Compose and constrain data shapes.', ids:['algebraic-data-types','gadts','newtype','units-of-measure'] },
    { label:'Substructural & state', note:'Track usage, ownership and protocol in the type.', ids:['linear-affine-types','ownership-borrowing','typestate','phantom-types','capability-types'] },
    { label:'Dependent & refined', note:'Types that depend on values / carry predicates.', ids:['dependent-types','refinement-types','effect-systems'] },
  ]
},
{
  id:'reliability-matrix', nav:'Reliability matrix', kind:'matrix',
  title:'Defensive-programming & reliability matrix',
  intro:'Each practice answers four questions: what failure it stops, where it catches it, how it recovers, and how it can give false confidence. Note the split between local correctness and distributed resilience.',
  columns:['Practice','Failure mitigated','Detection point','Recovery / false-confidence risk'],
  rows:[
    { id:'input-validation', name:'Input validation', cells:['Malformed / malicious input','At the trust boundary','Reject early · risk: blocklist gaps, client-only checks'] },
    { id:'assertions', name:'Assertions & invariants', cells:['Impossible internal states','At the violated invariant','Abort · risk: compiled out in release'] },
    { id:'design-by-contract', name:'Design by contract', cells:['Caller/callee responsibility gaps','Pre/postcondition check','Fail fast · risk: contracts disabled in prod'] },
    { id:'fail-fast', name:'Fail-fast', cells:['Corrupt state spreading','Earliest checkpoint','Crash + supervise · risk: hurts availability if overused'] },
    { id:'defensive-copying', name:'Defensive copying', cells:['Aliasing mutation of internals','At the API boundary','Copy in/out · risk: needless cost when immutable'] },
    { id:'timeouts', name:'Timeouts & deadlines', cells:['Indefinite blocking on deps','On deadline expiry','Abort wait · risk: work continues; false failures'] },
    { id:'retry-backoff', name:'Retry + backoff', cells:['Transient faults','On failed call','Re-attempt · risk: duplicates if not idempotent'] },
    { id:'idempotency', name:'Idempotency', cells:['Duplicate effects from retries','Dedup key / conditional write','Absorb repeats · risk: false safety on partial writes'] },
    { id:'circuit-breaker', name:'Circuit breaker', cells:['Cascading dependency failure','Failure-rate threshold','Fail fast / cool down · risk: flapping'] },
    { id:'bulkhead', name:'Bulkhead isolation', cells:['Resource exhaustion by one dep','Per-pool saturation','Confine · risk: under-sized pools self-reject'] },
    { id:'graceful-degradation', name:'Graceful degradation', cells:['Total outage on partial failure','When a dep is unavailable','Fallback · risk: untested fallback path'] },
  ]
},
{
  id:'error-handling', nav:'Error-handling comparison', kind:'matrix',
  title:'Error-handling strategy comparison',
  intro:'Overlapping problems, different semantics, costs and idiomaticity. The manifest is explicit: do not equate Rust Result, Java exceptions, C error codes and C++ exceptions — they differ in visibility and ergonomics.',
  columns:['Strategy','Visible in signature','Cost model','Best for','Idiomatic in'],
  rows:[
    { name:'Exceptions', id:'exception-safety', cells:['No (hidden control flow)','~Free on happy path; costly to throw','Truly exceptional faults','C++, C#, Java'] },
    { name:'Error codes / errno', cells:['Partially (return value)','Negligible; manual checks','C / kernel / FFI boundaries','C'] },
    { name:'Result / Either', id:'result-either', cells:['Yes (in the type)','Cheap; explicit branches','Expected, recoverable failures','Rust'] },
    { name:'Option / Maybe', id:'option-maybe', cells:['Yes (absence in type)','Cheap','Optionality without a reason','Rust, FP code'] },
    { name:'Panic / abort', id:'fail-fast', cells:['No (unwinds/aborts)','Cheap until thrown','Unrecoverable invariant breaks','Rust, C++'] },
    { name:'Validation (accumulating)', id:'applicative', cells:['Yes','Cheap','Collecting multiple errors at once','FP libraries'] },
  ]
},
{
  id:'concurrency-comparison', nav:'Concurrency models', kind:'matrix',
  title:'Concurrency-model comparison',
  intro:'Concurrency models differ chiefly in whether they share memory or pass messages, and in what they are best at. SIMD/GPU are data-parallel execution models, not concurrency models — see the parallel-execution map.',
  columns:['Model','Coordination','Shared state','Best for','Primary hazard'],
  rows:[
    { id:'threads', name:'Threads', cells:['Shared memory + locks','Yes','CPU parallelism on cores','Data races / deadlock'] },
    { id:'async-await', name:'Async / await', cells:['Cooperative suspension','Within a task','Massive I/O concurrency','Blocking calls stall the executor'] },
    { id:'coroutines', name:'Coroutines', cells:['Explicit yield/resume','Cooperative','Generators, scripting, lazy seqs','One coroutine blocks others'] },
    { id:'actors', name:'Actors', cells:['Async messages, isolated state','No (isolated)','Distributed, fault-tolerant systems','Mailbox growth; protocol bugs'] },
    { id:'csp-channels', name:'CSP / channels', cells:['Messages over channels','No (share by communicating)','Pipelines, worker coordination','Channel deadlock / leaks'] },
    { id:'software-transactional-memory', name:'STM', cells:['Optimistic transactions','Yes (transactional)','Composable atomic updates','Retry cost; no I/O rollback'] },
    { id:'event-loop', name:'Event loop / reactor', cells:['Single-thread dispatch','Single-threaded','High-concurrency I/O servers','A slow handler freezes all'] },
  ]
},
{
  id:'sync-comparison', nav:'Synchronisation primitives', kind:'matrix',
  title:'Synchronisation-primitives comparison',
  intro:'Lower-level than concurrency models: the primitives that coordinate access to shared memory. Choose by ownership semantics, blocking behaviour and contention cost.',
  columns:['Primitive','Purpose','Blocking?','Ownership','Notes'],
  rows:[
    { id:'mutex', name:'Mutex', cells:['Mutual exclusion','Yes','Held by one thread','Cheap uncontended; deadlock risk'] },
    { id:'semaphore', name:'Semaphore', cells:['Bound N concurrent users','Yes','No owner (permit count)','Resource pools, signalling'] },
    { id:'condition-variable', name:'Condition variable', cells:['Wait for a predicate','Yes','With a mutex (monitor)','Re-check in a while-loop (spurious wakeups)'] },
    { id:'atomics-cas', name:'Atomics / CAS', cells:['Lock-free read-modify-write','No','None','ABA + memory-ordering hazards'] },
    { id:'lock-free', name:'Lock-free algorithms', cells:['Progress without locks','No','None','Hard to write; needs reclamation'] },
    { id:'rcu', name:'RCU', cells:['Wait-free read-mostly data','Readers no','Writers serialise','Grace-period reclamation'] },
    { id:'backpressure', name:'Backpressure', cells:['Flow control','Producer may block','N/A','Bounds memory under overload'] },
    { id:'spinlock', name:'Spinlock', cells:['Mutual exclusion (very short)','No (busy-waits)','Held by one thread','Lowest latency; wastes CPU; bad if preempted'] },
    { id:'read-write-lock', name:'Read-write lock', cells:['Shared reads / exclusive write','Yes','Readers shared; writer exclusive','Read-mostly wins; writer-starvation risk'] },
    { id:'hazard-pointers', name:'Hazard pointers', cells:['Safe lock-free reclamation','No','None','Per-access publish; bounded memory'] },
    { id:'epoch-reclamation', name:'Epoch reclamation', cells:['Batched lock-free reclamation','No','None','Cheap fast path; stalled thread pins memory'] },
  ]
},
{
  id:'parallel-map', nav:'SIMD / CPU / GPU map', kind:'clusters',
  title:'SIMD, CPU & GPU parallel-execution map',
  intro:'Parallelism layered from a single instruction stream out to thousands of GPU lanes. SIMD is per-core data parallelism (not multithreading); SIMT is the GPU\u2019s lockstep-warp variant — keep them distinct.',
  groups:[
    { label:'Within one core', note:'No threads involved.', ids:['instruction-level-parallelism','simd','auto-vectorization','portable-simd','gather-scatter','predication','software-pipelining','fma','branchless-programming'] },
    { label:'Across cores', note:'Task & data parallelism on a CPU.', ids:['threads','green-threads','thread-pool','work-stealing','fork-join','pipeline-parallelism','spmd'] },
    { label:'Massively parallel (GPU)', note:'SIMT lockstep over huge grids.', ids:['gpu-computing','compute-shaders'] },
    { label:'Cluster scale', note:'Data parallelism across machines.', ids:['mapreduce'] },
    { label:'Layout that enables it', note:'Vectorisation needs the right data shape.', ids:['structure-of-arrays','array-of-structures','cache-blocking','prefetching'] },
  ]
},
{
  id:'memory-comparison', nav:'Memory management', kind:'matrix',
  title:'Memory- & resource-management comparison',
  intro:'Who frees memory, how deterministically, and at what cost — the central trade-off behind GC vs ownership vs manual management.',
  columns:['Strategy','Who frees','Determinism','Overhead','Failure mode'],
  rows:[
    { id:'stack-vs-heap', name:'Stack allocation', cells:['Automatic (scope exit)','Fully deterministic','Near-zero','Overflow; dangling on escape'] },
    { id:'garbage-collection', name:'Tracing GC', cells:['Runtime collector','Non-deterministic','Pauses + headroom','Pause jitter; reachable leaks'] },
    { id:'reference-counting', name:'Reference counting', cells:['At refcount → 0','Deterministic','Atomic inc/dec','Cycles leak'] },
    { id:'ownership-borrowing', name:'Ownership / borrowing', cells:['Compiler-inserted (Drop)','Deterministic','Zero runtime','Borrow-checker friction'] },
    { id:'raii', name:'RAII', cells:['Destructor at scope exit','Deterministic','Zero','Cyclic ownership; manual new/delete'] },
    { id:'arena-allocation', name:'Arena / region', cells:['Bulk reset of region','Deterministic','Near-zero alloc','Over-retention; dangling after reset'] },
    { id:'object-pool', name:'Object pool', cells:['Returned to pool','Deterministic','Reset cost','Stale state; leaked checkouts'] },
  ]
},
{
  id:'data-layout', nav:'Data-layout & cache guide', kind:'clusters',
  title:'Data-layout & cache-locality guide',
  intro:'The data-oriented chain the manifest highlights: layout → contiguous memory → cache locality → SIMD suitability → game-engine / HPC performance. Memory latency, not CPU speed, is usually the bottleneck.',
  groups:[
    { label:'Layout choices', note:'Shape data for the access pattern.', ids:['array-of-structures','structure-of-arrays','dynamic-array'] },
    { label:'Locality techniques', note:'Keep the working set in cache.', ids:['cache-blocking','cache-oblivious','prefetching','numa-awareness'] },
    { label:'Multicore locality hazards', note:'Sharing that silently kills scaling.', ids:['false-sharing'] },
    { label:'What good layout unlocks', note:'The downstream performance payoff.', ids:['simd','auto-vectorization','gpu-computing','ecs','data-oriented-design'] },
  ]
},
{
  id:'design-map', nav:'Design & architecture map', kind:'clusters',
  title:'Design-principles & architecture map',
  intro:'From fine-grained principles up to system topologies. Principles are contextual heuristics, not universal laws — each card notes the trade-offs and where it misleads.',
  groups:[
    { label:'SOLID principles', note:'Object-design heuristics.', ids:['single-responsibility','open-closed-principle','liskov-substitution','interface-segregation','dependency-inversion'] },
    { label:'Pragmatic principles', note:'Broad, contextual maxims.', ids:['separation-of-concerns','dry','composition-over-inheritance','encapsulation','information-hiding','law-of-demeter','command-query-separation'] },
    { label:'Patterns & wiring', note:'Reusable object-level solutions.', ids:['dependency-injection','inversion-of-control','strategy-pattern','plugin-architecture','mvc'] },
    { label:'Application architectures', note:'How a codebase is structured.', ids:['layered-architecture','hexagonal-architecture','clean-architecture','modular-monolith'] },
    { label:'Distributed architectures', note:'Topologies across services.', ids:['microservices','service-oriented-architecture','event-driven-architecture','serverless','peer-to-peer','space-based-architecture','blackboard-pattern','ecs'] },
    { label:'State & data patterns', note:'Managing state at scale.', ids:['cqrs','event-sourcing','saga-pattern'] },
  ]
},
{
  id:'design-patterns', nav:'Design patterns (GoF)', kind:'clusters',
  title:'Design-patterns catalogue',
  intro:'The Gang-of-Four patterns grouped by intent. Several are workarounds for features modern languages now provide natively (closures replace Command; sum types + matching replace Visitor) — each card notes when a pattern is unnecessary ceremony.',
  groups:[
    { label:'Creational', note:'How objects are created.', ids:['factory-method','builder','singleton','object-pool'] },
    { label:'Structural', note:'How objects are composed.', ids:['adapter','decorator','facade','proxy','composite'] },
    { label:'Behavioural', note:'How objects collaborate and share responsibility.', ids:['observer','command','state-pattern','visitor','iterator-pattern','chain-of-responsibility','strategy-pattern'] },
    { label:'Often replaced by language features', note:'Where a first-class feature beats the pattern.', ids:['higher-order-functions','pattern-matching','dependency-injection'] },
  ]
},
{
  id:'testing-spectrum', nav:'Testing & verification spectrum', kind:'matrix',
  title:'Testing & verification spectrum',
  intro:'Ordered from cheap, fast, example-based checks toward expensive, exhaustive, mathematical guarantees. Testing shows the presence of bugs; verification can prove their absence (against a spec).',
  columns:['Technique','Defect class','Automation','Cost','Lifecycle stage'],
  rows:[
    { id:'unit-testing', name:'Unit testing', cells:['Logic bugs in a unit','High','Low','Development'] },
    { id:'integration-testing', name:'Integration testing', cells:['Interface / wiring bugs','High','Medium','Development / CI'] },
    { id:'contract-testing', name:'Contract testing', cells:['Service API breakage','High','Medium','CI'] },
    { id:'property-based-testing', name:'Property-based', cells:['Edge cases vs invariants','High','Medium','Development'] },
    { id:'fuzz-testing', name:'Fuzz testing', cells:['Crashes / memory safety','High (continuous)','Medium','CI / continuous'] },
    { id:'mutation-testing', name:'Mutation testing', cells:['Weak / absent assertions','High','High (slow)','Quality audit'] },
    { id:'static-analysis', name:'Static analysis', cells:['Unsafe patterns, smells','High','Low','Edit / CI'] },
    { id:'symbolic-execution', name:'Symbolic execution', cells:['Path-specific bugs','Medium','High','Security / audit'] },
    { id:'model-checking', name:'Model checking', cells:['Concurrency / protocol bugs','Medium','High','Design / critical'] },
    { id:'formal-verification', name:'Formal verification', cells:['Whole classes (vs spec)','Low (manual proof)','Very high','Critical systems'] },
    { id:'differential-testing', name:'Differential', cells:['Cross-impl divergence','High','Medium','CI / conformance'] },
    { id:'metamorphic-testing', name:'Metamorphic', cells:['Oracle-free logic bugs','High','Medium','Development (ML/scientific)'] },
    { id:'model-based-testing', name:'Model-based', cells:['State / transition bugs','High','High','Design / system'] },
    { id:'smoke-testing', name:'Smoke', cells:['Gross / DOA breakage','High','Low','CI gate / post-deploy'] },
    { id:'acceptance-testing', name:'Acceptance / UAT', cells:['Requirement mismatch','Medium','Medium','System / pre-release'] },
    { id:'security-testing', name:'Security testing', cells:['Exploitable vulnerabilities','Mixed','Medium–high','Across SDLC'] },
  ]
},
{
  id:'security-map', nav:'Security practices map', kind:'clusters',
  title:'Security-practices map',
  intro:'Security is architecture and process, not a single algorithm. Cryptographic primitives are the tools; these practices decide how they are applied and how systems resist attack.',
  groups:[
    { label:'Secure design', note:'Build security in from the start.', ids:['threat-modeling','secure-by-design','defense-in-depth','least-privilege','zero-trust','attack-surface-reduction','privacy-by-design'] },
    { label:'Identity & access', note:'Who you are; what you may do.', ids:['authentication','authorization','sandboxing'] },
    { label:'Data & crypto hygiene', note:'Protect secrets and side channels.', ids:['secret-management','constant-time-programming','output-encoding','canonicalization'] },
    { label:'Supply chain & integrity', note:'Trust the artifacts and the build.', ids:['supply-chain-security','code-signing','audit-logging','secure-boot','tamper-detection'] },
    { label:'Deploy & operate', note:'Harden the running system and respond.', ids:['configuration-hardening','incident-response'] },
  ]
},
{
  id:'industry-pathways', nav:'Industry pathways', kind:'clusters',
  title:'Industry technique pathways',
  intro:'Typical production stacks — how techniques from different categories combine in a domain. These are common patterns, not prescriptions; every stack mixes direct (D) engineering with indirect (I) compiler / runtime / platform support.',
  groups:[
    { label:'Game engine', note:'C++ / C# · direct + engine-mediated (D + I). ECS data layout → SIMD/GPU throughput.', ids:['ecs','structure-of-arrays','work-stealing','simd','cache-blocking','kd-tree'] },
    { label:'Embedded / firmware', note:'C / C++ / Rust · hardware-constrained (D + I). Determinism and fail-safe behaviour over throughput.', ids:['arena-allocation','design-by-contract','ring-buffer','branchless-programming','static-analysis','fuzz-testing'] },
    { label:'Cloud backend', note:'Java / C# / Rust / C++ · framework-heavy (D + I). Resilience and observability across service boundaries.', ids:['async-await','event-driven-architecture','idempotency','retry-backoff','circuit-breaker','transactional-outbox','distributed-tracing','slo-sli'] },
    { label:'Low-latency fintech', note:'C++ / Java / C# / Rust · evidence-driven (D + I). Tail latency is the product; measure everything.', ids:['lock-free','cache-blocking','branchless-programming','simd','arena-allocation','benchmarking'] },
    { label:'Data / ML / HPC', note:'C / C++ / Java / Rust · compiler + library + hardware (D + I). Throughput via parallelism and layout.', ids:['mapreduce','cache-blocking','gpu-computing','simd','fft','property-based-testing'] },
  ]
},
{
  id:'lang-industry', nav:'Language × industry', kind:'langindustry',
  title:'Language-by-industry heatmap',
  intro:'Where C, C++, C#, Java and Rust dominate by sector (0 = rare \u2192 3 = a primary language of the field). A prevalence/idiomaticity judgement at the ecosystem level — distinct from per-concept language support. Many fields (e.g. ML, data science) are led by languages outside this five; scores reflect only these five.',
  sectors:[
    { name:'Operating systems & kernels', scores:{c:3,cpp:2,cs:0,java:0,rust:2}, note:'C is the lingua franca; Rust is entering (Linux, Windows components).' },
    { name:'Embedded & IoT', scores:{c:3,cpp:2,cs:1,java:1,rust:2}, note:'C dominates; Rust growing for memory safety on MCUs.' },
    { name:'Systems & infrastructure', scores:{c:2,cpp:3,cs:1,java:2,rust:3}, note:'C++ and Rust for databases, runtimes, browsers, proxies.' },
    { name:'Web backends', scores:{c:0,cpp:1,cs:3,java:3,rust:2}, note:'C#/Java lead enterprise; Rust rising for high-perf services.' },
    { name:'Cloud & distributed', scores:{c:1,cpp:2,cs:2,java:3,rust:2}, note:'Java/JVM heavy (Kafka, Hadoop); Rust in infra tooling.' },
    { name:'Fintech & trading', scores:{c:1,cpp:3,cs:3,java:3,rust:2}, note:'C++ for low-latency; Java/C# for platforms; Rust emerging.' },
    { name:'Game dev & graphics', scores:{c:1,cpp:3,cs:2,java:1,rust:1}, note:'C++ engines; C# via Unity; Rust niche but growing.' },
    { name:'ML / AI systems', scores:{c:1,cpp:3,cs:1,java:1,rust:1}, note:'C++ powers framework backends; Python leads at the API layer (out of scope).' },
    { name:'Data & analytics', scores:{c:0,cpp:2,cs:2,java:3,rust:1}, note:'JVM dominant (Spark, Flink, Hadoop); Rust in new engines.' },
    { name:'Security & cryptography', scores:{c:3,cpp:2,cs:1,java:2,rust:2}, note:'C for primitives; Rust adopted for memory-safe security code.' },
    { name:'Scientific & HPC', scores:{c:2,cpp:3,cs:0,java:1,rust:1}, note:'C++/C with MPI/CUDA; Fortran/Python also major (out of scope).' },
    { name:'Enterprise applications', scores:{c:0,cpp:1,cs:3,java:3,rust:1}, note:'C# and Java are the enterprise backbone.' },
    { name:'Mobile', scores:{c:1,cpp:2,cs:2,java:3,rust:1}, note:'Java/Kotlin on Android; C# via MAUI; C++ for shared cores.' },
  ]
},
{
  id:'evidence-sources', nav:'Evidence & sources', kind:'sources',
  title:'Evidence & source key',
  intro:'Official standards, language documentation, and security / reliability guidance anchor the support claims in this atlas. Contextual synthesis (idiomaticity and industry-prevalence scores) remains visibly separate and is flagged per card. Each concept card links the sources backing it under "Evidence & sources".',
},
{
  id:'coverage-qa', nav:'Coverage & QA', kind:'qa',
  title:'Coverage manifest & quality assurance',
  intro:'Live audit of the atlas against the Coverage Manifest v1.1 QA gates. These checks run over the concept data every time this page loads — nothing is hard-coded. No citations are fabricated; confidence is self-assessed and lower-confidence entries are flagged in their cards.',
},
];
