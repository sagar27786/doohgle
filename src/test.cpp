#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <sstream>
#include <climits> 


long long get_max_from_vec(const std::vector<long long>& v) {

    bool all_zeros = true;
    for (size_t i = 1; i < v.size(); ++i) {
        if (v[i] != 0) {
            all_zeros = false;
            break;
        }
    }
    if (all_zeros) return 0;


    long long mv = LLONG_MIN;
    for (size_t i = 1; i < v.size(); ++i) {
        if (v[i] > mv) {
            mv = v[i];
        }
    }
    return mv;
}

void solve(std::istream &input) {
    int n, q;
    input >> n >> q;


    std::vector<long long> row_water(n + 1, 0);
    std::vector<long long> col_water(n + 1, 0);

    for (int i = 0; i < q; ++i) {
        std::string cmd;
        int idx;
        long long amount;
        input >> cmd >> idx >> amount;

        if (cmd == "WaterRow") {

            if (idx >= 1 && idx <= n) {
                row_water[idx] += amount;
            }
        } else { 
            if (idx >= 1 && idx <= n) {
                col_water[idx] += amount;
            }
        }
    }

    long long max_row = get_max_from_vec(row_water);
    long long max_col = get_max_from_vec(col_water);

    std::cout << (max_row + max_col) << "\n";
}

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(NULL);

    solve(std::cin);

    return 0;
}