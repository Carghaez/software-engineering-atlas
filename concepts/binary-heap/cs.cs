// Idiomatic binary heap in C#: PriorityQueue<TElement,TPriority> (a min-heap).
var pq = new PriorityQueue<string, int>();
pq.Enqueue("task-a", 3);
pq.Enqueue("task-b", 1);
pq.Enqueue("task-c", 2);

Check(pq.Peek() == "task-b", "lowest priority first");

int prev = int.MinValue;
while (pq.TryDequeue(out var item, out var prio))
{
    Check(prio >= prev, "dequeues in priority order");
    prev = prio;
}
Check(prev == 3, "highest priority last");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
