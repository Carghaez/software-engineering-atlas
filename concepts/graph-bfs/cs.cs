// Breadth-first search over an adjacency list; computes hop distances.
int[][] g = { new[]{1,2}, new[]{0,3}, new[]{0,3}, new[]{1,2,4}, new[]{3,5}, new[]{4} };
var dist = new int[g.Length];
Array.Fill(dist, -1);

var q = new Queue<int>();
dist[0] = 0; q.Enqueue(0);
while (q.Count > 0)
{
    int u = q.Dequeue();
    foreach (int v in g[u])
        if (dist[v] < 0) { dist[v] = dist[u] + 1; q.Enqueue(v); }
}

Check(dist[0] == 0 && dist[3] == 2 && dist[5] == 4, "hop distances");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
