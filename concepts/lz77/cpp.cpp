// LZ77 compress/decompress (sliding window) with a lossless roundtrip check.
#include <string>
#include <vector>
#include <algorithm>
#include <cassert>

struct Tok { int off, len; char next; };

std::vector<Tok> compress(const std::string& s) {
    std::vector<Tok> out;
    int n = (int)s.size(), i = 0, W = 32, MAXL = 15;
    while (i < n) {
        int bestlen = 0, bestoff = 0, start = std::max(0, i - W);
        for (int j = start; j < i; j++) {
            int l = 0;
            while (l < MAXL && i + l < n && s[j + l] == s[i + l]) l++;
            if (l > bestlen) { bestlen = l; bestoff = i - j; }
        }
        out.push_back({bestoff, bestlen, i + bestlen < n ? s[i + bestlen] : '\0'});
        i += bestlen + 1;
    }
    return out;
}

std::string decompress(const std::vector<Tok>& toks) {
    std::string out;
    for (auto& t : toks) {
        int start = (int)out.size() - t.off;
        for (int l = 0; l < t.len; l++) out.push_back(out[start + l]);  // may overlap
        if (t.next != '\0') out.push_back(t.next);
    }
    return out;
}

int main() {
    std::string s = "abcabcabcabcabcabc";
    auto toks = compress(s);
    assert(decompress(toks) == s);        // lossless roundtrip
    assert(toks.size() < s.size());       // compressed
    return 0;
}
