// Fixed-capacity ring (circular) buffer with wraparound indices.
struct Ring {
    buf: [i32; 4],
    head: usize,
    count: usize,
}

impl Ring {
    fn new() -> Self { Ring { buf: [0; 4], head: 0, count: 0 } }
    fn push(&mut self, v: i32) {
        assert!(self.count < 4);
        self.buf[(self.head + self.count) % 4] = v;
        self.count += 1;
    }
    fn pop(&mut self) -> i32 {
        assert!(self.count > 0);
        let v = self.buf[self.head];
        self.head = (self.head + 1) % 4; // wrap around
        self.count -= 1;
        v
    }
}

fn main() {
    let mut r = Ring::new();
    r.push(1); r.push(2); r.push(3);
    assert_eq!(r.pop(), 1);
    r.push(4); r.push(5);
    assert_eq!(r.count, 4);
    assert_eq!(r.pop(), 2);
    assert_eq!(r.pop(), 3);
    assert_eq!(r.pop(), 4);
    assert_eq!(r.pop(), 5);
    assert_eq!(r.count, 0);
}
