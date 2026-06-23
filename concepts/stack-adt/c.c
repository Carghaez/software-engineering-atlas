// Stack ADT (LIFO) backed by a fixed array.
#include <assert.h>
#include <stddef.h>

typedef struct { int data[64]; size_t len; } Stack;

static void push(Stack *s, int v) { assert(s->len < 64); s->data[s->len++] = v; }
static int  pop(Stack *s)         { assert(s->len > 0);  return s->data[--s->len]; }
static int  is_empty(const Stack *s) { return s->len == 0; }

int main(void) {
    Stack s = { .len = 0 };
    for (int i = 1; i <= 3; i++) push(&s, i);   // push 1,2,3

    assert(pop(&s) == 3);                        // last in, first out
    assert(pop(&s) == 2);
    assert(pop(&s) == 1);
    assert(is_empty(&s));
    return 0;
}
