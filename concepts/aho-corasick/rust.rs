// Aho-Corasick: a trie plus failure links matches a whole dictionary in one pass over the text.
use std::collections::{HashMap, VecDeque};

struct AC { next: Vec<HashMap<u8, usize>>, fail: Vec<usize>, out: Vec<usize> }

impl AC {
    fn build(patterns: &[&str]) -> AC {
        let mut ac = AC { next: vec![HashMap::new()], fail: vec![0], out: vec![0] };
        for p in patterns {
            let mut s = 0;
            for &b in p.as_bytes() {
                let n = ac.next.len();
                s = *ac.next[s].entry(b).or_insert(n);
                if s == n { ac.next.push(HashMap::new()); ac.fail.push(0); ac.out.push(0); }
            }
            ac.out[s] += 1; // a pattern ends at this node
        }
        let mut q: VecDeque<usize> = ac.next[0].values().copied().collect();
        while let Some(u) = q.pop_front() {
            for (&b, &v) in &ac.next[u].clone() {
                let mut f = ac.fail[u];
                while f != 0 && !ac.next[f].contains_key(&b) { f = ac.fail[f]; }
                ac.fail[v] = *ac.next[f].get(&b).unwrap_or(&0);
                ac.out[v] += ac.out[ac.fail[v]]; // inherit suffix matches
                q.push_back(v);
            }
        }
        ac
    }
    fn count(&self, text: &str) -> usize {
        let (mut s, mut hits) = (0usize, 0usize);
        for &b in text.as_bytes() {
            while s != 0 && !self.next[s].contains_key(&b) { s = self.fail[s]; }
            s = *self.next[s].get(&b).unwrap_or(&0);
            hits += self.out[s];
        }
        hits
    }
}

fn main() {
    let ac = AC::build(&["he", "she", "his", "hers"]);
    assert_eq!(ac.count("ushers"), 3); // she, he, hers
    assert_eq!(ac.count("xyz"), 0);
}
