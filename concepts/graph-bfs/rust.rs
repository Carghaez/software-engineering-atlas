// Breadth-first search over an adjacency list; computes hop distances.
use std::collections::VecDeque;

fn main() {
    let g: [Vec<usize>; 6] = [vec![1, 2], vec![0, 3], vec![0, 3], vec![1, 2, 4], vec![3, 5], vec![4]];
    let mut dist = vec![-1i32; g.len()];
    let mut q = VecDeque::new();
    dist[0] = 0;
    q.push_back(0usize);
    while let Some(u) = q.pop_front() {
        for &v in &g[u] {
            if dist[v] < 0 {
                dist[v] = dist[u] + 1;
                q.push_back(v);
            }
        }
    }

    assert_eq!(dist[0], 0);
    assert_eq!(dist[3], 2);
    assert_eq!(dist[5], 4);
}
