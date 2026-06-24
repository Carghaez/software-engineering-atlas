// DPLL-style SAT: backtracking with early conflict checks decides satisfiability of a CNF.
int[] val = new int[8];   // 0 unassigned, 1 true, -1 false

bool Conflict(int[][] cl)                 // a clause is violated only if every literal is false
{
    foreach (int[] c in cl)
    {
        bool allFalse = true;
        foreach (int lit in c)
        {
            int v = lit > 0 ? lit : -lit;
            if (val[v] == 0 || (val[v] == 1) == (lit > 0)) { allFalse = false; break; }
        }
        if (allFalse) return true;
    }
    return false;
}
bool Solve(int[][] cl, int var, int nv)
{
    if (Conflict(cl)) return false;
    if (var > nv) return true;            // all assigned, no conflict -> SAT
    for (int b = 1; b >= -1; b -= 2) { val[var] = b; if (Solve(cl, var + 1, nv)) return true; }
    val[var] = 0;
    return false;
}
bool Sat(int[][] cl, int nv) { Array.Clear(val, 0, val.Length); return Solve(cl, 1, nv); }

int[][] ok  = { new[] { 1, 2 }, new[] { -1, 3 }, new[] { -2, -3 } };   // (x1|x2)&(~x1|x3)&(~x2|~x3)
int[][] bad = { new[] { 1 }, new[] { -1 } };                          // x1 & ~x1 -> UNSAT
Check(Sat(ok, 3), "sat");
Check(!Sat(bad, 1), "unsat");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
