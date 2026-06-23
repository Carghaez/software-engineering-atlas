// Bloom filter: k=2 hashes over a bit array; no false negatives.
#include <vector>
#include <string>
#include <functional>
#include <utility>
#include <cassert>

struct Bloom {
    std::vector<bool> bits;
    explicit Bloom(std::size_t m) : bits(m) {}
    std::pair<std::size_t, std::size_t> hashes(const std::string& s) const {
        std::size_t h1 = std::hash<std::string>{}(s);
        std::size_t h2 = std::hash<std::string>{}(s + "!");
        return {h1 % bits.size(), h2 % bits.size()};
    }
    void add(const std::string& s) { auto [a, b] = hashes(s); bits[a] = bits[b] = true; }
    bool maybe(const std::string& s) const { auto [a, b] = hashes(s); return bits[a] && bits[b]; }
};

int main() {
    Bloom f(1024);
    f.add("apple"); f.add("banana");
    assert(f.maybe("apple"));        // no false negatives
    assert(f.maybe("banana"));
    assert(!f.maybe("cherry"));      // true negative (no collision here)
    return 0;
}
