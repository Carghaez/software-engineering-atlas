// LSM-tree: writes hit an in-memory memtable; flushes make immutable sorted runs; reads scan newest-first.
use std::collections::BTreeMap;

#[derive(Default)]
struct Lsm {
    memtable: BTreeMap<String, i32>,
    sstables: Vec<BTreeMap<String, i32>>, // index 0 = newest run
}

impl Lsm {
    fn put(&mut self, k: &str, v: i32) { self.memtable.insert(k.to_string(), v); }
    fn flush(&mut self) {
        let run = std::mem::take(&mut self.memtable); // memtable becomes an immutable run
        self.sstables.insert(0, run);
    }
    fn get(&self, k: &str) -> Option<i32> {
        if let Some(&v) = self.memtable.get(k) { return Some(v); } // memtable shadows older runs
        self.sstables.iter().find_map(|ss| ss.get(k).copied())
    }
}

fn main() {
    let mut db = Lsm::default();
    db.put("a", 1);
    db.put("b", 2);
    db.flush(); // -> SSTable {a:1, b:2}
    db.put("a", 99); // newer write, still in the memtable
    assert_eq!(db.get("a"), Some(99)); // newer memtable value shadows the old SSTable
    assert_eq!(db.get("b"), Some(2)); // served from the flushed SSTable
    assert_eq!(db.get("z"), None); // absent in every run
}
