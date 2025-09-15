#include <iostream>
#include <vector>
#include <string>
#include <algorithm>


void dfs(int r, int c, const std::vector<std::vector<int>>& grid, 
                        std::vector<std::vector<bool>>& vis, int& csum) {
    int r_s = grid.size();
    int c_s = grid[0].size();

    if (r < 0 || r >= r_s || c < 0 || c >= c_s || vis[r][c] || grid[r][c] == 0) {
        return;
    }

    vis[r][c] = true;
    csum += grid[r][c];

    dfs(r + 1, c, grid, vis, csum);
    dfs(r - 1, c, grid, vis, csum);
    dfs(r, c + 1, grid, vis, csum);
    dfs(r, c - 1, grid, vis, csum);
}

int max_power_block(const std::vector<std::vector<int>>& grid) {
    if (grid.empty() || grid[0].empty()) return 0;

    int r_s = grid.size();
    int c_s = grid[0].size();
    std::vector<std::vector<bool>> vis(r_s, std::vector<bool>(c_s, false));
    int max_sum = 0;

    for (int r = 0; r < r_s; ++r) {
        for (int c = 0; c < c_s; ++c) {
            if (grid[r][c] > 0 && !vis[r][c]) {
                int csum = 0;
                dfs(r, c, grid, vis, csum);
                max_sum = std::max(max_sum, csum);
            }
        }
    }
    return max_sum;
}

int main() {
    int m, n;
    std::cin >> m >> n;
    std::vector<std::vector<int>> grid(m, std::vector<int>(n));
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) {
            std::cin >> grid[i][j];
        }
    }
    std::cout << max_power_block(grid) << "\n";
    return 0;
}
