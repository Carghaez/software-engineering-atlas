// LZ77 compress/decompress (sliding window) with a lossless roundtrip check.
#[derive(Clone, Copy)]
struct Tok {
    off: usize,
    len: usize,
    next: u8,
}

fn compress(s: &[u8]) -> Vec<Tok> {
    let (n, w, maxl) = (s.len(), 32usize, 15usize);
    let mut out = Vec::new();
    let mut i = 0;
    while i < n {
        let (mut bestlen, mut bestoff) = (0usize, 0usize);
        let start = i.saturating_sub(w);
        for j in start..i {
            let mut l = 0;
            while l < maxl && i + l < n && s[j + l] == s[i + l] {
                l += 1;
            }
            if l > bestlen {
                bestlen = l;
                bestoff = i - j;
            }
        }
        let next = if i + bestlen < n { s[i + bestlen] } else { 0 };
        out.push(Tok { off: bestoff, len: bestlen, next });
        i += bestlen + 1;
    }
    out
}

fn decompress(toks: &[Tok]) -> Vec<u8> {
    let mut out = Vec::new();
    for t in toks {
        let start = out.len() - t.off;
        for l in 0..t.len {
            let b = out[start + l]; // copy earlier output (may overlap)
            out.push(b);
        }
        if t.next != 0 {
            out.push(t.next);
        }
    }
    out
}

fn main() {
    let s = b"abcabcabcabcabcabc";
    let toks = compress(s);
    assert_eq!(decompress(&toks), s.to_vec()); // lossless roundtrip
    assert!(toks.len() < s.len()); // compressed
}
