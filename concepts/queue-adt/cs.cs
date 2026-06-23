// Idiomatic queue ADT in C#: Queue<T> (FIFO).
var q = new Queue<int>();
for (int i = 1; i <= 3; i++) q.Enqueue(i);

Check(q.Peek() == 1, "front is first enqueued");
Check(q.Dequeue() == 1, "FIFO 1");
Check(q.Dequeue() == 2, "FIFO 2");
Check(q.Dequeue() == 3, "FIFO 3");
Check(q.Count == 0, "empty");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
