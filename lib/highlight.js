// Zero-dependency syntax tokenizer shared by build.mjs (Node, static pages) and
// the SPA (browser). Pure ESM, no DOM. Returns data — never HTML — so the dc-runtime
// can render it as colored <span> tokens (the runtime escapes text, honors style attrs).
//
//   tokenize(code, lang) -> lines: Array< Array<{ text, color }> >
//
// It's a compact regex scanner, not a full grammar — good coverage of comments,
// strings, numbers, keywords, types and punctuation across the C-family + Rust,
// plus a light pass for pseudocode. Capitalized identifiers are treated as types.

// Palette tuned to the site (reuses the same hues as the card markers).
const COL = {
  comment: '#8a9199',
  string: '#1f8a5b',
  number: '#b06d12',
  keyword: '#2a6fdb',
  type: '#7a5cc0',
  punct: '#7a7f87',
  plain: '#2a2e35',
};

const set = (s) => new Set(s.trim().split(/\s+/));

// Primitive/type words get the "type" color; everything Capitalized also does (heuristic).
const TYPES = set(`
  int long short char float double bool boolean byte void string str size_t
  unsigned signed u8 u16 u32 u64 u128 usize i8 i16 i32 i64 i128 isize f32 f64
  String Vec Box Option Result Self
`);

const KW = {
  c: set(`auto break case const continue default do else enum extern for goto if inline register
    restrict return sizeof static struct switch typedef union volatile while NULL sizeof`),
  cpp: set(`auto break case catch class const constexpr continue default delete do dynamic_cast else
    enum explicit extern for friend goto if inline mutable namespace new noexcept nullptr operator
    private protected public register return sizeof static static_cast struct switch template this
    throw try typedef typename union using virtual volatile while true false`),
  cs: set(`abstract as async await base break case catch class const continue default do else enum
    event explicit extern false finally fixed for foreach get goto if in interface internal is lock
    namespace new null object override params private protected public readonly ref return sealed set
    static string struct switch this throw true try typeof using var virtual void volatile while yield`),
  java: set(`abstract assert break case catch class const continue default do else enum extends final
    finally for goto if implements import instanceof interface native new null package private
    protected public return static strictfp super switch synchronized this throw throws transient try
    true false void volatile while var record sealed`),
  rust: set(`as async await break const continue crate dyn else enum extern false fn for if impl in
    let loop match mod move mut pub ref return self Self static struct super trait true type unsafe
    use where while Some None Ok Err`),
  pseudocode: set(`function procedure algorithm if then else elseif end endif for foreach while do
    repeat until to downto step return yield and or not in of begin input output print swap`),
};
// Aliases: C-family share the C-ish comment style.
const CFG = {
  c: { kw: KW.c, hash: false },
  cpp: { kw: KW.cpp, hash: false },
  cs: { kw: KW.cs, hash: false },
  java: { kw: KW.java, hash: false },
  rust: { kw: KW.rust, hash: false },
  pseudocode: { kw: KW.pseudocode, hash: true }, // '#' and '//' line comments
  default: { kw: new Set(), hash: true },
};

function scanner(cfg) {
  const line = cfg.hash ? '#[^\\n]*|//[^\\n]*' : '//[^\\n]*';
  return new RegExp(
    '(' + line + ')' +                                            // 1 line comment
    '|(/\\*[\\s\\S]*?\\*/)' +                                     // 2 block comment
    '|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)' + // 3 string/char
    '|(\\b\\d[\\w.]*\\b)' +                                       // 4 number
    '|([A-Za-z_]\\w*)' +                                          // 5 identifier
    '|(\\s+)' +                                                   // 6 whitespace
    '|([\\s\\S])',                                                // 7 any other char
    'g',
  );
}

function classify(text, m, kw) {
  if (m[1] || m[2]) return COL.comment;
  if (m[3]) return COL.string;
  if (m[4]) return COL.number;
  if (m[5]) {
    if (kw.has(text)) return COL.keyword;
    if (TYPES.has(text) || /^[A-Z]/.test(text)) return COL.type;
    return COL.plain;
  }
  if (m[6]) return COL.plain; // whitespace
  return COL.punct;
}

// Split flat tokens (which may contain '\n') into lines of tokens.
function splitLines(flat) {
  const lines = [[]];
  for (const tok of flat) {
    const parts = tok.text.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) lines.push([]);
      if (parts[i] !== '') lines[lines.length - 1].push({ text: parts[i], color: tok.color });
    }
  }
  return lines;
}

export function tokenize(code, lang) {
  const cfg = CFG[lang] || CFG.default;
  const re = scanner(cfg);
  const flat = [];
  let m;
  while ((m = re.exec(String(code)))) {
    flat.push({ text: m[0], color: classify(m[0], m, cfg.kw) });
    if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-width
  }
  return splitLines(flat);
}

export const LANG_LABELS = { pseudocode: 'Pseudocode', c: 'C', cpp: 'C++', cs: 'C#', java: 'Java', rust: 'Rust' };
export const LANG_EXT = { pseudocode: 'txt', c: 'c', cpp: 'cpp', cs: 'cs', java: 'java', rust: 'rs' };
// Display order when a concept has several languages.
export const CODE_LANG_ORDER = ['pseudocode', 'c', 'cpp', 'cs', 'java', 'rust'];
