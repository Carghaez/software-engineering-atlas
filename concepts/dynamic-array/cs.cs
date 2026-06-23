// Idiomatic dynamic array in C#: the standard library's List<T>.

var v = new List<int>();

// Amortised O(1) append — List<T> grows its backing array by doubling.
for (int i = 0; i < 10; i++) v.Add(i * i);

// O(1) indexed access and count.
Check(v.Count == 10, "count");
Check(v[2] == 4, "indexed access");

// Reserve up front to avoid intermediate reallocations on a known size.
var squares = new List<int>(capacity: 10);
squares.AddRange(Enumerable.Range(0, 10).Select(i => i * i));
Check(squares.Count == 10 && squares[9] == 81, "reserved fill");

Console.WriteLine($"len = {v.Count}, third = {v[2]}");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
