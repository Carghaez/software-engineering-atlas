// LSM-tree: writes hit an in-memory memtable; flushes make immutable sorted runs; reads scan newest-first.
#include <map>
#include <vector>
#include <string>
#include <cassert>

struct LSM {
    std::map<std::string, int> memtable;
    std::vector<std::map<std::string, int>> sstables;   // index 0 = newest run

    void put(const std::string& k, int v) { memtable[k] = v; }
    void flush() { sstables.insert(sstables.begin(), memtable); memtable.clear(); }
    bool get(const std::string& k, int& out) {
        if (memtable.count(k)) { out = memtable[k]; return true; }   // memtable shadows older runs
        for (auto& ss : sstables) if (ss.count(k)) { out = ss[k]; return true; }
        return false;
    }
};

int main() {
    LSM db;
    db.put("a", 1); db.put("b", 2);
    db.flush();                 // -> SSTable {a:1, b:2}
    db.put("a", 99);            // newer write, still in the memtable
    int v;
    assert(db.get("a", v) && v == 99);   // newer memtable value shadows the old SSTable
    assert(db.get("b", v) && v == 2);    // served from the flushed SSTable
    assert(!db.get("z", v));             // absent in every run
    return 0;
}
