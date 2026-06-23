// Idiomatic hash table in C#: Dictionary<TKey,TValue> (average O(1)).
var counts = new Dictionary<string, int>();

foreach (var w in new[] { "a", "b", "a", "c", "a", "b" })
    counts[w] = counts.GetValueOrDefault(w) + 1;

Check(counts.Count == 3, "distinct keys");
Check(counts["a"] == 3, "count a");
Check(counts.TryGetValue("b", out var b) && b == 2, "count b");
Check(!counts.ContainsKey("z"), "absent key");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
