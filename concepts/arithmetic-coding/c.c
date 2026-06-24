// Arithmetic coding: narrow [low,high) by each symbol's probability slice; a point in it decodes back.
#include <assert.h>
#include <string.h>

// model for symbols A,B,C: cumulative ranges [0,0.5), [0.5,0.8), [0.8,1.0)
double LO[3] = {0.0, 0.5, 0.8};
double HI[3] = {0.5, 0.8, 1.0};

double encode(const int *msg, int n) {
    double low = 0.0, high = 1.0;
    for (int i = 0; i < n; i++) {
        double range = high - low;
        high = low + range * HI[msg[i]];
        low  = low + range * LO[msg[i]];
    }
    return (low + high) / 2;   // any point inside the final interval identifies the message
}
void decode(double code, int n, int *out) {
    double low = 0.0, high = 1.0;
    for (int i = 0; i < n; i++) {
        double range = high - low, v = (code - low) / range;
        int s = v < HI[0] ? 0 : (v < HI[1] ? 1 : 2);
        out[i] = s;
        high = low + range * HI[s];
        low  = low + range * LO[s];
    }
}
int main(void) {
    int msg[5] = {0, 1, 2, 0, 1}, out[5];   // A B C A B
    double code = encode(msg, 5);
    decode(code, 5, out);
    assert(memcmp(msg, out, sizeof msg) == 0);   // round-trips exactly
    assert(code > 0.0 && code < 1.0);
    return 0;
}
