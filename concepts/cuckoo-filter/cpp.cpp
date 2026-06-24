// Cuckoo filter: store a fingerprint in one of two candidate buckets; supports lookup + delete.
#include <array>
#include <string>
#include <functional>
#include <cstdint>
#include <cassert>

static const int NB = 16, SLOTS = 4;
std::array<std::array<uint8_t, SLOTS>, NB> tbl{};   // 0 marks an empty slot

struct Loc { uint8_t f; int i1, i2; };
Loc loc(const std::string& k) {
    std::size_t h = std::hash<std::string>{}(k);
    uint8_t f = (h & 0xff) ? (h & 0xff) : 1;        // fingerprint, never 0
    int i1 = h % NB;
    return {f, i1, (int)((i1 ^ f) % NB)};
}
bool insert(const std::string& k) {
    Loc l = loc(k);
    for (int b : {l.i1, l.i2})
        for (auto& s : tbl[b]) if (s == 0) { s = l.f; return true; }
    return false;
}
bool contains(const std::string& k) {
    Loc l = loc(k);
    for (int b : {l.i1, l.i2})
        for (uint8_t s : tbl[b]) if (s == l.f) return true;
    return false;
}
bool erase(const std::string& k) {
    Loc l = loc(k);
    for (int b : {l.i1, l.i2})
        for (auto& s : tbl[b]) if (s == l.f) { s = 0; return true; }
    return false;
}
int main() {
    insert("apple"); insert("banana");
    assert(contains("apple"));     // no false negatives
    assert(contains("banana"));
    assert(erase("apple"));        // deletion supported (a Bloom filter cannot)
    assert(!contains("apple"));    // gone after delete
    assert(contains("banana"));    // other entries unaffected
    return 0;
}
