// Idiomatic hash table in C++: std::unordered_map (average O(1) lookup/insert).
#include <unordered_map>
#include <string>
#include <cassert>

int main() {
    std::unordered_map<std::string, int> counts;

    // operator[] default-constructs a missing key, so ++ counts occurrences.
    for (const char* w : {"a", "b", "a", "c", "a", "b"})
        ++counts[w];

    assert(counts.size() == 3);
    assert(counts.at("a") == 3);
    assert(counts.at("b") == 2);
    assert(counts.find("z") == counts.end());   // absent key
    return 0;
}
