// Bounding Volume Hierarchy: a tree of AABBs; a query descends only into boxes it overlaps.
struct Node { lo: [f32; 2], hi: [f32; 2], left: i32, right: i32, obj: i32 }

struct Bvh { nodes: Vec<Node>, probes: u32 }
impl Bvh {
    fn leaf(&mut self, x: f32, y: f32, id: i32) -> i32 {
        self.nodes.push(Node { lo: [x, y], hi: [x + 1.0, y + 1.0], left: -1, right: -1, obj: id });
        self.nodes.len() as i32 - 1
    }
    fn inner(&mut self, l: i32, r: i32) -> i32 {   // a real builder picks l,r by a split heuristic (SAH)
        let (a, b) = (&self.nodes[l as usize], &self.nodes[r as usize]);
        let mut lo = [0f32; 2];
        let mut hi = [0f32; 2];
        for k in 0..2 { lo[k] = a.lo[k].min(b.lo[k]); hi[k] = a.hi[k].max(b.hi[k]); }
        self.nodes.push(Node { lo, hi, left: l, right: r, obj: -1 });
        self.nodes.len() as i32 - 1
    }
    fn query(&mut self, i: i32, x: f32, y: f32) -> i32 {
        self.probes += 1;
        let n = &self.nodes[i as usize];
        let (lo, hi, obj, l, r) = (n.lo, n.hi, n.obj, n.left, n.right);
        if x < lo[0] || x > hi[0] || y < lo[1] || y > hi[1] { return -1; } // miss -> prune subtree
        if obj >= 0 { return obj; }
        let h = self.query(l, x, y);
        if h >= 0 { h } else { self.query(r, x, y) }
    }
}

fn main() {
    let mut t = Bvh { nodes: vec![], probes: 0 };
    let (a, b, c, d) = (t.leaf(0.0, 0.0, 0), t.leaf(5.0, 0.0, 1), t.leaf(0.0, 5.0, 2), t.leaf(5.0, 5.0, 3));
    let (lr, rr) = (t.inner(a, c), t.inner(b, d));
    let root = t.inner(lr, rr);
    t.probes = 0;
    assert_eq!(t.query(root, 0.5, 0.5), 0);     // inside leaf a
    assert!(t.probes < t.nodes.len() as u32);   // pruned the far subtree
    assert_eq!(t.query(root, 9.0, 9.0), -1);    // outside every leaf
}
