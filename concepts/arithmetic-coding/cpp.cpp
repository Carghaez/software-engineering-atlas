// Arithmetic coding: narrow [low,high) by each symbol's probability slice; a point in it decodes back.
#include <vector>
#include <array>
#include <cassert>

// model for symbols A,B,C: cumulative ranges [0,0.5), [0.5,0.8), [0.8,1.0)
std::array<double, 3> LO = {0.0, 0.5, 0.8}, HI = {0.5, 0.8, 1.0};

double encode(const std::vector<int>& msg) {
    double low = 0.0, high = 1.0;
    for (int s : msg) { double r = high - low; high = low + r * HI[s]; low = low + r * LO[s]; }
    return (low + high) / 2;   // any point inside the final interval identifies the message
}
std::vector<int> decode(double code, int n) {
    std::vector<int> out;
    double low = 0.0, high = 1.0;
    for (int i = 0; i < n; i++) {
        double r = high - low, v = (code - low) / r;
        int s = v < HI[0] ? 0 : (v < HI[1] ? 1 : 2);
        out.push_back(s);
        high = low + r * HI[s];
        low  = low + r * LO[s];
    }
    return out;
}
int main() {
    std::vector<int> msg = {0, 1, 2, 0, 1};   // A B C A B
    double code = encode(msg);
    assert(decode(code, (int)msg.size()) == msg);   // round-trips exactly
    assert(code > 0.0 && code < 1.0);
    return 0;
}
