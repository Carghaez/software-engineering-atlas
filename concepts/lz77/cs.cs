// LZ77 compress/decompress (sliding window) with a lossless roundtrip check.
using System.Text;

string s = "abcabcabcabcabcabc";
var toks = Compress(s);
Check(Decompress(toks) == s, "lossless roundtrip");
Check(toks.Count < s.Length, "compressed");

List<Tok> Compress(string s)
{
    var outp = new List<Tok>();
    int n = s.Length, i = 0, W = 32, MAXL = 15;
    while (i < n)
    {
        int bestlen = 0, bestoff = 0, start = Math.Max(0, i - W);
        for (int j = start; j < i; j++)
        {
            int l = 0;
            while (l < MAXL && i + l < n && s[j + l] == s[i + l]) l++;
            if (l > bestlen) { bestlen = l; bestoff = i - j; }
        }
        outp.Add(new Tok(bestoff, bestlen, i + bestlen < n ? s[i + bestlen] : '\0'));
        i += bestlen + 1;
    }
    return outp;
}

string Decompress(List<Tok> toks)
{
    var sb = new StringBuilder();
    foreach (var t in toks)
    {
        int start = sb.Length - t.Off;
        for (int l = 0; l < t.Len; l++) sb.Append(sb[start + l]);  // may overlap
        if (t.Next != '\0') sb.Append(t.Next);
    }
    return sb.ToString();
}

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}

record struct Tok(int Off, int Len, char Next);
