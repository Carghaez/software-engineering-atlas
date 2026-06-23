// Recursive depth-first search over an adjacency list; records visit order.
int[][] g = { new[]{1,2}, new[]{0,3}, new[]{0,3}, new[]{1,2,4}, new[]{3,5}, new[]{4} };
var visited = new bool[g.Length];
var order = new List<int>();

void Dfs(int u)
{
    visited[u] = true; order.Add(u);
    foreach (int v in g[u]) if (!visited[v]) Dfs(v);
}

Dfs(0);
Check(order.Count == g.Length, "every vertex reached");
Check(order[0] == 0, "started at source");
foreach (bool b in visited) Check(b, "all visited");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
