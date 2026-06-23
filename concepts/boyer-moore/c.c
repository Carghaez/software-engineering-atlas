// Boyer-Moore-Horspool substring search via a bad-character shift table.
#include <assert.h>
#include <string.h>

int bmh(const char *text, const char *pat) {
    int n = (int)strlen(text), m = (int)strlen(pat);
    if (m == 0) return 0;
    int shift[256];
    for (int i = 0; i < 256; i++) shift[i] = m;
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

int main(void) {
    assert(bmh("the quick brown fox", "quick") == 4);
    assert(bmh("abracadabra", "cad") == 4);
    assert(bmh("hello world", "xyz") == -1);
    assert(bmh("aaaaa", "aa") == 0);
    return 0;
}
