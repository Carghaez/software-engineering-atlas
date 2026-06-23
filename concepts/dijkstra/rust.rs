// Dijkstra's shortest paths from a source on a non-negative weighted graph.
use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    // adjacency list: g[u] = [(v, weight), ...]
    let g: Vec<Vec<(usize, u32)>> = vec![
        vec![(1, 4), (2, 1)], // 0
        vec![(3, 1)],         // 1
        vec![(1, 2), (3, 5)], // 2
        vec![],               // 3
    ];
    let src = 0;
    let mut dist = vec![u32::MAX; g.len()];
    dist[src] = 0;

    // Reverse turns the max-heap into a min-heap on tentative distance.
    let mut pq = BinaryHeap::new();
    pq.push(Reverse((0u32, src)));
    while let Some(Reverse((d, u))) = pq.pop() {
        if d > dist[u] {
            continue; // stale entry
        }
        for &(v, w) in &g[u] {
            if d + w < dist[v] {
                dist[v] = d + w; // relax the edge
                pq.push(Reverse((dist[v], v)));
            }
        }
    }

    assert_eq!(dist, vec![0, 3, 1, 4]);
}
