// DPLL-style SAT: backtracking with early conflict checks decides satisfiability of a CNF.
#include <assert.h>

int (*CL)[4]; int NC, NV; int val[8];   // val: 0 unassigned, 1 true, -1 false

int conflict(void) {                     // a clause is violated only if every literal is false
    for (int c = 0; c < NC; c++) {
        int allFalse = 1;
        for (int i = 0; CL[c][i]; i++) {
            int lit = CL[c][i], v = lit > 0 ? lit : -lit;
            if (val[v] == 0 || (val[v] == 1) == (lit > 0)) { allFalse = 0; break; }
        }
        if (allFalse) return 1;
    }
    return 0;
}
int solve(int var) {
    if (conflict()) return 0;
    if (var > NV) return 1;              // all assigned, no conflict -> SAT
    for (int b = 1; b >= -1; b -= 2) { val[var] = b; if (solve(var + 1)) return 1; }
    val[var] = 0;
    return 0;
}
int sat(int (*cl)[4], int nc, int nv) {
    CL = cl; NC = nc; NV = nv;
    for (int i = 0; i <= nv; i++) val[i] = 0;
    return solve(1);
}
int main(void) {
    int ok[][4]  = { {1, 2, 0}, {-1, 3, 0}, {-2, -3, 0} };   // (x1|x2)&(~x1|x3)&(~x2|~x3)
    int bad[][4] = { {1, 0}, {-1, 0} };                      // x1 & ~x1 -> UNSAT
    assert(sat(ok, 3, 3));
    assert(!sat(bad, 2, 1));
    return 0;
}
