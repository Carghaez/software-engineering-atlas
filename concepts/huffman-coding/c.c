// Huffman coding cost: repeatedly merge the two smallest weights.
#include <assert.h>

int main(void) {
    int vals[16], m = 0;
    int freq[] = {5, 9, 12, 13, 16, 45};
    for (int i = 0; i < 6; i++) vals[m++] = freq[i];

    long total = 0;                          // sum of merge weights = total bits
    while (m > 1) {
        int i1 = 0;                          // index of the smallest
        for (int i = 1; i < m; i++) if (vals[i] < vals[i1]) i1 = i;
        int a = vals[i1]; vals[i1] = vals[--m];
        int i2 = 0;                          // index of the next smallest
        for (int i = 1; i < m; i++) if (vals[i] < vals[i2]) i2 = i;
        int b = vals[i2]; vals[i2] = vals[--m];
        int merged = a + b;
        total += merged;
        vals[m++] = merged;
    }

    assert(total == 224);     // optimal weighted path length for these frequencies
    return 0;
}
