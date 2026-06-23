// A red-black tree in C# is SortedDictionary<,> (balanced BST; keys sorted).
var m = new SortedDictionary<int, string>();
m[5] = "e"; m[1] = "a"; m[3] = "c"; m[2] = "b"; m[4] = "d";

var keys = new List<int>(m.Keys);              // already in ascending order
Check(keys.SequenceEqual(new[] { 1, 2, 3, 4, 5 }), "sorted keys");
Check(m[3] == "c", "lookup");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
