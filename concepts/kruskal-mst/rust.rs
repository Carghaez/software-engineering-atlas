// Kruskal's minimum spanning tree: sort edges, union endpoints, skip cycles.
fn find(parent: &mut [usize], x: usize) -> usize {
    let mut x = x;
    while parent[x] != x {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    x
}

fn main() {
    let v = 4;
    let mut edges = [ // (weight, u, v)
        (10usize, 0usize, 1usize), (6, 0, 2), (5, 0, 3), (15, 1, 3), (4, 2, 3),
    ];
    edges.sort(); // by weight (tuple order)

    let mut parent: Vec<usize> = (0..v).collect();
    let (mut total, mut used) = (0usize, 0usize);
    for &(w, u, t) in &edges {
        let (a, b) = (find(&mut parent, u), find(&mut parent, t));
        if a != b {
            parent[a] = b;
            total += w;
            used += 1;
        }
    }

    assert_eq!(used, v - 1); // a spanning tree
    assert_eq!(total, 19); // 4 + 5 + 10
}
