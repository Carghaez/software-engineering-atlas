// Streaming algorithms: a single pass in O(1) memory. Boyer-Moore majority vote over a stream.
int Majority(int[] stream)
{
    int cand = 0, count = 0;               // one candidate, one counter — constant memory
    foreach (int x in stream)
    {
        if (count == 0) cand = x;
        count += (x == cand) ? 1 : -1;
    }
    return cand;                            // the >n/2 element, if one exists
}

int[] stream = { 3, 3, 4, 2, 3, 3, 5, 3, 3 };   // 3 appears 6 of 9 times
int m = Majority(stream);
int seen = 0;
foreach (int x in stream) if (x == m) seen++;
Check(m == 3 && seen * 2 > stream.Length, "majority");   // verified majority in one pass

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
