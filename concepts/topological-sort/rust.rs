// Topological sort of a DAG via Kahn's algorithm (indegree + queue).
use std::collections::VecDeque;

fn main() {
    let n = 6;
    let edges = [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)];
    let mut g: Vec<Vec<usize>> = vec![Vec::new(); n];
    let mut indeg = vec![0usize; n];
    for &(u, v) in &edges {
        g[u].push(v);
        indeg[v] += 1;
    }

    let mut q: VecDeque<usize> = (0..n).filter(|&i| indeg[i] == 0).collect();
    let mut pos = vec![usize::MAX; n];
    let mut k = 0;
    while let Some(u) = q.pop_front() {
        pos[u] = k;
        k += 1;
        for i in 0..g[u].len() {
            let v = g[u][i];
            indeg[v] -= 1;
            if indeg[v] == 0 {
                q.push_back(v);
            }
        }
    }

    assert_eq!(k, n); // acyclic: all emitted
    for &(u, v) in &edges {
        assert!(pos[u] < pos[v]); // u before v
    }
}
