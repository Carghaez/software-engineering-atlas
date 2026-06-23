// Queue ADT (FIFO) as a circular buffer over a fixed array.
#include <assert.h>
#include <stddef.h>

#define CAP 64
typedef struct { int data[CAP]; size_t head, len; } Queue;

static void enqueue(Queue *q, int v) {
    assert(q->len < CAP);
    q->data[(q->head + q->len++) % CAP] = v;
}
static int dequeue(Queue *q) {
    assert(q->len > 0);
    int v = q->data[q->head];
    q->head = (q->head + 1) % CAP;
    q->len--;
    return v;
}

int main(void) {
    Queue q = { .head = 0, .len = 0 };
    for (int i = 1; i <= 3; i++) enqueue(&q, i);

    assert(dequeue(&q) == 1);     // first in, first out
    assert(dequeue(&q) == 2);
    enqueue(&q, 4);
    assert(dequeue(&q) == 3);
    assert(dequeue(&q) == 4);
    assert(q.len == 0);
    return 0;
}
