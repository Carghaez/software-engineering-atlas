// Singly linked list in C with manual pointer + memory management.
#include <assert.h>
#include <stdlib.h>

typedef struct Node { int val; struct Node *next; } Node;

// Push onto the front in O(1); returns the new head.
static Node *push_front(Node *head, int v) {
    Node *n = malloc(sizeof *n);
    assert(n != NULL);
    n->val = v;
    n->next = head;
    return n;
}

static void free_list(Node *head) {
    while (head) { Node *next = head->next; free(head); head = next; }
}

int main(void) {
    Node *head = NULL;
    for (int i = 0; i < 5; i++) head = push_front(head, i);   // 4,3,2,1,0

    int expected = 4, count = 0;
    for (Node *p = head; p; p = p->next) { assert(p->val == expected--); count++; }
    assert(count == 5);

    free_list(head);
    return 0;
}
