// Boyer-Moore-Horspool substring search via a bad-character shift table.
fn bmh(text: &[u8], pat: &[u8]) -> Option<usize> {
    let (n, m) = (text.len(), pat.len());
    if m == 0 {
        return Some(0);
    }
    if m > n {
        return None;
    }
    let mut shift = [m; 256];
    for i in 0..m - 1 {
        shift[pat[i] as usize] = m - 1 - i;
    }

    let mut i = 0;
    while i <= n - m {
        let mut j = m - 1;
        while text[i + j] == pat[j] {
            // match right-to-left
            if j == 0 {
                return Some(i);
            }
            j -= 1;
        }
        i += shift[text[i + m - 1] as usize]; // bad-character jump
    }
    None
}

fn main() {
    assert_eq!(bmh(b"the quick brown fox", b"quick"), Some(4));
    assert_eq!(bmh(b"abracadabra", b"cad"), Some(4));
    assert_eq!(bmh(b"hello world", b"xyz"), None);
    assert_eq!(bmh(b"aaaaa", b"aa"), Some(0));
}
