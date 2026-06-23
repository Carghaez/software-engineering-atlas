// LZ77 compress/decompress (sliding window) with a lossless roundtrip check.
import java.util.ArrayList;
import java.util.List;

class Main {
    record Tok(int off, int len, char next) {}

    static List<Tok> compress(String s) {
        List<Tok> out = new ArrayList<>();
        int n = s.length(), i = 0, W = 32, MAXL = 15;
        while (i < n) {
            int bestlen = 0, bestoff = 0, start = Math.max(0, i - W);
            for (int j = start; j < i; j++) {
                int l = 0;
                while (l < MAXL && i + l < n && s.charAt(j + l) == s.charAt(i + l)) l++;
                if (l > bestlen) { bestlen = l; bestoff = i - j; }
            }
            out.add(new Tok(bestoff, bestlen, i + bestlen < n ? s.charAt(i + bestlen) : '\0'));
            i += bestlen + 1;
        }
        return out;
    }

    static String decompress(List<Tok> toks) {
        StringBuilder sb = new StringBuilder();
        for (Tok t : toks) {
            int start = sb.length() - t.off();
            for (int l = 0; l < t.len(); l++) sb.append(sb.charAt(start + l));  // may overlap
            if (t.next() != '\0') sb.append(t.next());
        }
        return sb.toString();
    }

    public static void main(String[] a) {
        String s = "abcabcabcabcabcabc";
        List<Tok> toks = compress(s);
        assert decompress(toks).equals(s);     // lossless roundtrip
        assert toks.size() < s.length();       // compressed
        System.out.println(toks.size() + " tokens for " + s.length() + " chars");
    }
}
