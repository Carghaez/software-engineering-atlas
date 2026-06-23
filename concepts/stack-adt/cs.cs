// Idiomatic stack ADT in C#: Stack<T> (LIFO).
var s = new Stack<int>();
for (int i = 1; i <= 3; i++) s.Push(i);

Check(s.Peek() == 3, "top is last pushed");
Check(s.Pop() == 3, "LIFO 3");
Check(s.Pop() == 2, "LIFO 2");
Check(s.Pop() == 1, "LIFO 1");
Check(s.Count == 0, "empty");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
