// LZ77 compress/decompress (sliding window) with a lossless roundtrip check.
#include <assert.h>
#include <string.h>

typedef struct { int off, len; char next; } Tok;

int compress(const char *s, Tok *out) {
    int n = (int)strlen(s), i = 0, t = 0, W = 32, MAXL = 15;
    while (i < n) {
        int bestlen = 0, bestoff = 0, start = i - W > 0 ? i - W : 0;
        for (int j = start; j < i; j++) {
            int l = 0;
            while (l < MAXL && i + l < n && s[j + l] == s[i + l]) l++;
            if (l > bestlen) { bestlen = l; bestoff = i - j; }
        }
        out[t].off = bestoff; out[t].len = bestlen;
        out[t].next = (i + bestlen < n) ? s[i + bestlen] : '\0';
        t++;
        i += bestlen + 1;
    }
    return t;
}

int decompress(const Tok *toks, int t, char *out) {
    int n = 0;
    for (int k = 0; k < t; k++) {
        int start = n - toks[k].off;
        for (int l = 0; l < toks[k].len; l++) { out[n] = out[start + l]; n++; }  // may overlap
        if (toks[k].next != '\0') out[n++] = toks[k].next;
    }
    out[n] = '\0';
    return n;
}

int main(void) {
    const char *s = "abcabcabcabcabcabc";
    Tok toks[64];
    int t = compress(s, toks);
    char out[256];
    decompress(toks, t, out);
    assert(strcmp(out, s) == 0);          // lossless roundtrip
    assert(t < (int)strlen(s));           // fewer tokens than characters: compressed
    return 0;
}
