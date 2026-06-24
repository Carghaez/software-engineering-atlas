// DPLL-style SAT: backtracking with early conflict checks decides satisfiability of a CNF.
fn conflict(cl: &[Vec<i32>], val: &[i32]) -> bool {
    // a clause is violated only if every one of its literals is already false
    cl.iter().any(|c| {
        c.iter().all(|&lit| {
            let v = lit.unsigned_abs() as usize;
            val[v] != 0 && (val[v] == 1) != (lit > 0)
        })
    })
}

fn solve(cl: &[Vec<i32>], val: &mut [i32], var: usize, nv: usize) -> bool {
    if conflict(cl, val) {
        return false;
    }
    if var > nv {
        return true; // all assigned, no conflict -> SAT
    }
    for b in [1, -1] {
        val[var] = b;
        if solve(cl, val, var + 1, nv) {
            return true;
        }
    }
    val[var] = 0;
    false
}

fn sat(cl: &[Vec<i32>], nv: usize) -> bool {
    let mut val = vec![0; nv + 1];
    solve(cl, &mut val, 1, nv)
}

fn main() {
    let ok = vec![vec![1, 2], vec![-1, 3], vec![-2, -3]]; // (x1|x2)&(~x1|x3)&(~x2|~x3)
    let bad = vec![vec![1], vec![-1]]; // x1 & ~x1 -> UNSAT
    assert!(sat(&ok, 3));
    assert!(!sat(&bad, 1));
}
