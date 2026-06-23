// A red-black tree in C++ is the standard library's std::map (ordered, balanced).
#include <map>
#include <string>
#include <vector>
#include <cassert>

int main() {
    std::map<int, std::string> m;              // red-black tree; keys kept sorted
    m[5] = "e"; m[1] = "a"; m[3] = "c"; m[2] = "b"; m[4] = "d";

    std::vector<int> keys;
    for (auto& [k, v] : m) keys.push_back(k);   // in-order traversal -> sorted
    assert((keys == std::vector<int>{1, 2, 3, 4, 5}));
    assert(m.at(3) == "c");
    assert(m.lower_bound(3)->first == 3);       // O(log n) ordered query
    return 0;
}
