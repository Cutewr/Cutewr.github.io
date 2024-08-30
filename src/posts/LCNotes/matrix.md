---
date: 2024-08-28
category:
  - 刷题笔记
tag:
  - 矩阵
star: true
---

# 矩阵【二维数组】

## 矩阵置零【LC 73题】

给定一个 `*m* x *n*` 的矩阵，如果一个元素为 **0** ，则将其所在行和列的所有元素都设为 **0** 。请使用 [**原地**](http://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95) 算法**。**

<aside>
💡 解题思路：遍历矩阵，用第一行和第一列作为标志列，记录该行该列是否需要置0。同时，使用两个bool变量，记录第一行和第一列本身是否需要置零。

</aside>

<aside>
💡 注意！第一次置零是要除掉第一行和第一列的，i和j从1开始。

</aside>

```java
class Solution {
    public void setZeroes(int[][] matrix) {
        int m= matrix.length;
        int n= matrix[0].length;
        boolean colZero=false,rowZero=false;
        // 将行和列置零信息 放到第一行和第一列上
        for (int i=0;i<m;i++){
            for (int j=0;j<n;j++){
                if (matrix[i][j]==0){
                    matrix[0][j]=0;
                    matrix[i][0]=0;
                    if (i==0) rowZero=true;
                    if (j==0) colZero=true;
                }
            }
        }
        //根据存储的置零标记置零
        for (int i=1;i<m;i++){
            for(int j=1;j<n;j++){
                if (matrix[i][0]==0||matrix[0][j]==0)   matrix[i][j]=0;
            }
        }
        //判断首行和首列是否需要置零
        if (colZero){
            for (int i=0;i<m;i++){
                matrix[i][0]=0;
            }
        }
        if (rowZero){
            for (int j=0;j<n;j++){
                matrix[0][j]=0;
            }
        }
    }
}
```

## 螺旋矩阵【LC 54题】

给你一个 `m` 行 `n` 列的矩阵 `matrix` ，请按照 **顺时针螺旋顺序** ，返回矩阵中的所有元素。

<aside>
💡 难度不大，关键是要注意好边界和退出循环的条件

</aside>

<aside>
💡 我们使用左闭右闭区间，因此退出循环条件不能加等于，然后按照螺旋顺序的四个方向遍历

</aside>

```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int l=0,r=matrix[0].length-1,t=0,b=matrix.length-1;
        List<Integer> list=new ArrayList<>();
        while(true){
            for(int i=l;i<=r;i++) list.add(matrix[t][i]);
            if(++t>b) break;
            for(int i=t;i<=b;i++) list.add(matrix[i][r]);
            if(--r<l) break;
            for(int i=r;i>=l;i--) list.add(matrix[b][i]);
            if(--b<t) break;
            for(int i=b;i>=t;i--) list.add(matrix[i][l]);
            if(++l>r) break;
        }
        return list;
    }
}
```

## 螺旋矩阵||【LC 59题】

给你一个正整数 `n` ，生成一个包含 `1` 到 `n^2` 所有元素，且元素按顺时针顺序螺旋排列的 `n x n` 正方形矩阵 `matrix` 。

<aside>
💡 本题的关键：把握好循环不变量，每一行或者每一列设置开始节点，不设置结尾节点

</aside>

```java
package Array;

public class generateMatrix {
    public int[][] generateMatrix(int n) {
        int [][]result=new int[n][n];
        int count=1;
        int start=0;	// 标记每次螺旋开始的位置(start,start)
        int offset=1;	//标记每次螺旋结束的位置 n-offset
        int i,j;
        while(offset <= n/2){
            for (j = start; j < n-offset; j++) {
                result[start][j]=count++;
            }
            for (i = start; i < n-offset; i++) {
                result[i][j]=count++;
            }
            for (;j>=offset;j--){
                result[i][j]=count++;
            }
            for (;i>=offset;i--) {
                result[i][j]=count++;
            }
            start++;
            offset++;
        }
        if (n%2==1) result[start][start]=count;
        return result;
    }
}
```

## 搜索二维矩阵【LC 74题】

给你一个满足下述两条属性的 `m x n` 整数矩阵：

- 每行中的整数从左到右按非严格递增顺序排列。
- 每行的第一个整数大于前一行的最后一个整数。

给你一个整数 `target` ，如果 `target` 在矩阵中，返回 `true` ；否则，返回 `false` 。

<aside>
💡 因为整个数组递增，所以可以用二分法来做。当然也可以用下一题的排除法来做。

</aside>

> 二分法
> 

<aside>
💡 注意 利用右移来代替除法的时候，是右移一位

</aside>

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m=matrix.length,n=matrix[0].length;
        int left=0,right=m*n;   //左闭右开
        while(left<right){
            int mid=(left+right)>>>1;
            int temp=matrix[mid/n][mid%n];
            if(temp==target) return true;
            else if(temp>target) right=mid;
            else left=mid+1;
        }
        return false;
    }
}
```

> 排除法，从左下角元素temp开始，如果temp<target,则排除这一列；如果temp>target，则排除这一行
> 

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int i=matrix.length-1,j=0;
        while(i>=0 && j<matrix[0].length){
            if(matrix[i][j]==target) return true;
            else if(matrix[i][j]>target) i--;
            else j++;
        }
        return false;
    }
}
```

## 搜索二维矩阵||【LC 240题】

编写一个高效的算法来搜索 `*m* x *n*` 矩阵 `matrix` 中的一个目标值 `target` 。该矩阵具有以下特性：

- 每行的元素从左到右升序排列。
- 每列的元素从上到下升序排列。

<aside>
💡 用上一道的排除法即可完成
</aside>

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int i=matrix.length-1,j=0;
        while(i>=0 && j<matrix[0].length){
            if(matrix[i][j]==target) return true;
            else if(matrix[i][j]>target) i--;
            else j++;
        }
        return false;
    }
}
```

## 旋转图像【LC 48题】

给定一个 *n* × *n* 的二维矩阵 `matrix` 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在 [**原地**](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95) 旋转图像，这意味着你需要直接修改输入的二维矩阵。**请不要** 使用另一个矩阵来旋转图像。

<aside>
💡 当矩阵大小 n 为偶数时，取前n/2行、前n/2列的元素为起始点；当矩阵大小 n 为奇数时，取前n/2行、前

(n+1)/2列的元素为起始点。

遍历矩阵，用temp记录下matrix[i][j]，然后依次交换四个点。【注意这四个点是 行列颠倒的！！！】

</aside>

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n=matrix[0].length;
        for(int i=0;i<n/2;i++){
            for(int j=0;j<(n+1)/2;j++){
                int temp=matrix[i][j];
                matrix[i][j]=matrix[n-j-1][i];
                matrix[n-j-1][i]=matrix[n-i-1][n-j-1];
                matrix[n-i-1][n-j-1]=matrix[j][n-i-1];
                matrix[j][n-i-1]=temp;
            }
        }
    }
}
```

## 生命游戏【LC 289题】

根据 [百度百科](https://baike.baidu.com/item/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F/2926434?fr=aladdin) ， **生命游戏** ，简称为 **生命** ，是英国数学家约翰·何顿·康威在 1970 年发明的细胞自动机。

给定一个包含 `m × n` 个格子的面板，每一个格子都可以看成是一个细胞。每个细胞都具有一个初始状态： `1` 即为 **活细胞** （live），或 `0` 即为 **死细胞** （dead）。每个细胞与其八个相邻位置（水平，垂直，对角线）的细胞都遵循以下四条生存定律：

1. 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡；
2. 如果活细胞周围八个位置有两个或三个活细胞，则该位置活细胞仍然存活；
3. 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡；
4. 如果死细胞周围正好有三个活细胞，则该位置死细胞复活；

下一个状态是通过将上述规则同时应用于当前状态下的每个细胞所形成的，其中细胞的出生和死亡是同时发生的。给你 `m x n` 网格面板 `board` 的当前状态，返回下一个状态。

<aside>
💡

</aside>
