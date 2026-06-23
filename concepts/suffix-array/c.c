// Suffix array of "banana" by sorting suffix start indices (naive comparator).
#include <assert.h>
#include <string.h>
#include <stdlib.h>

static const char *T;
static int cmp(const void *a, const void *b) {
    return strcmp(T + *(const int *)a, T + *(const int *)b);
}

int main(void) {
    const char *s = "banana";
    T = s;
    int n = (int)strlen(s), sa[6];
    for (int i = 0; i < n; i++) sa[i] = i;
    qsort(sa, n, sizeof(int), cmp);

    int expected[] = {5, 3, 1, 0, 4, 2};        // a, ana, anana, banana, na, nana
    for (int i = 0; i < n; i++) assert(sa[i] == expected[i]);
    return 0;
}
