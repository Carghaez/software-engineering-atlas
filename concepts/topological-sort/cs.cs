// Topological sort of a DAG via Kahn's algorithm (indegree + queue).
var g = new List<int>[6];
for (int i = 0; i < 6; i++) g[i] = new List<int>();
int[,] edges = { {5,2},{5,0},{4,0},{4,1},{2,3},{3,1} };
var indeg = new int[6];
for (int i = 0; i < edges.GetLength(0); i++) { g[edges[i,0]].Add(edges[i,1]); indeg[edges[i,1]]++; }

var q = new Queue<int>();
for (int i = 0; i < 6; i++) if (indeg[i] == 0) q.Enqueue(i);
var pos = new int[6];
int k = 0;
while (q.Count > 0)
{
    int u = q.Dequeue(); pos[u] = k++;
    foreach (int v in g[u]) if (--indeg[v] == 0) q.Enqueue(v);
}

Check(k == 6, "acyclic: all emitted");
for (int i = 0; i < edges.GetLength(0); i++)
    Check(pos[edges[i,0]] < pos[edges[i,1]], "u before v");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
