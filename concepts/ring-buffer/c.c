// Fixed-capacity ring (circular) buffer with wraparound indices.
#include <assert.h>
#include <stddef.h>

#define CAP 4
typedef struct { int buf[CAP]; size_t head, count; } Ring;

static int  full(const Ring *r)  { return r->count == CAP; }
static int  empty(const Ring *r) { return r->count == 0; }
static void push(Ring *r, int v) { assert(!full(r));  r->buf[(r->head + r->count) % CAP] = v; r->count++; }
static int  pop(Ring *r)         { assert(!empty(r)); int v = r->buf[r->head]; r->head = (r->head + 1) % CAP; r->count--; return v; }

int main(void) {
    Ring r = { .head = 0, .count = 0 };
    push(&r, 1); push(&r, 2); push(&r, 3);
    assert(pop(&r) == 1);
    push(&r, 4); push(&r, 5);        // indices wrap around the array
    assert(full(&r));
    assert(pop(&r) == 2 && pop(&r) == 3 && pop(&r) == 4 && pop(&r) == 5);
    assert(empty(&r));
    return 0;
}
