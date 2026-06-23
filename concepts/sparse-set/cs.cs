// Sparse set of small integers: O(1) insert / remove / membership.
const int Cap = 100;
var dense = new int[Cap];
var sparse = new int[Cap];
int n = 0;

bool Contains(int x) { int i = sparse[x]; return i < n && dense[i] == x; }
void Insert(int x) { if (Contains(x)) return; sparse[x] = n; dense[n++] = x; }
void Erase(int x)
{
    if (!Contains(x)) return;
    int i = sparse[x], last = dense[--n];
    dense[i] = last; sparse[last] = i;
}

Insert(5); Insert(42); Insert(5); Insert(7);
Check(n == 3, "size after dup");
Check(Contains(42) && !Contains(8), "membership");
Erase(42);
Check(!Contains(42) && Contains(5) && Contains(7), "after erase");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
