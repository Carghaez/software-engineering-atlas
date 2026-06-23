// Boyer-Moore-Horspool substring search via a bad-character shift table.
#include <string>
#include <array>
#include <cassert>

int bmh(const std::string& text, const std::string& pat) {
    int n = (int)text.size(), m = (int)pat.size();
    if (m == 0) return 0;
    std::array<int, 256> shift;
    shift.fill(m);
    for (int i = 0; i < m - 1; i++) shift[(unsigned char)pat[i]] = m - 1 - i;

    int i = 0;
    while (i <= n - m) {
        int j = m - 1;
        while (j >= 0 && text[i + j] == pat[j]) j--;     // match right-to-left
        if (j < 0) return i;
        i += shift[(unsigned char)text[i + m - 1]];      // bad-character jump
    }
    return -1;
}

int main() {
    assert(bmh("the quick brown fox", "quick") == 4);
    assert(bmh("abracadabra", "cad") == 4);
    assert(bmh("hello world", "xyz") == -1);
    return 0;
}
