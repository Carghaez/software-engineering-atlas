// DPLL-style SAT: backtracking with early conflict checks decides satisfiability of a CNF.
#include <vector>
#include <cassert>

struct Sat {
    std::vector<std::vector<int>> cl;
    int nv;
    std::vector<int> val;                // 0 unassigned, 1 true, -1 false
    Sat(std::vector<std::vector<int>> c, int n) : cl(std::move(c)), nv(n), val(n + 1, 0) {}

    bool conflict() {                    // a clause is violated only if every literal is false
        for (auto& c : cl) {
            bool allFalse = true;
            for (int lit : c) {
                int v = lit > 0 ? lit : -lit;
                if (val[v] == 0 || (val[v] == 1) == (lit > 0)) { allFalse = false; break; }
            }
            if (allFalse) return true;
        }
        return false;
    }
    bool solve(int var) {
        if (conflict()) return false;
        if (var > nv) return true;       // all assigned, no conflict -> SAT
        for (int b : {1, -1}) { val[var] = b; if (solve(var + 1)) return true; }
        val[var] = 0;
        return false;
    }
};

int main() {
    Sat ok({{1, 2}, {-1, 3}, {-2, -3}}, 3);   // (x1|x2)&(~x1|x3)&(~x2|~x3)
    Sat bad({{1}, {-1}}, 1);                   // x1 & ~x1 -> UNSAT
    assert(ok.solve(1));
    assert(!bad.solve(1));
    return 0;
}
