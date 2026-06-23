// Bellman-Ford shortest paths (handles negative edges), via edge relaxation.
fn main() {
    let v = 5usize;
    let edges: [(usize, usize, i64); 10] = [
        (0, 1, 6), (0, 2, 7), (1, 2, 8), (1, 3, 5), (1, 4, -4),
        (2, 3, -3), (2, 4, 9), (3, 1, -2), (4, 0, 2), (4, 3, 7),
    ];
    let mut dist = vec![i64::MAX; v];
    dist[0] = 0;

    for _ in 0..v - 1 {
        for &(u, t, w) in &edges {
            if dist[u] != i64::MAX && dist[u] + w < dist[t] {
                dist[t] = dist[u] + w; // relax
            }
        }
    }

    assert_eq!(dist, vec![0, 2, 7, 4, -2]);
}
