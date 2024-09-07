---
date: 2024-09-04
category:
  - 刷题笔记
tag:
  - 算法应用
---

# 大数乘法

## 题目

> 题目描述： 输出两个不超过100位的大整数的乘积。
> 输入： 输入两个大整数，如1234567 和 123
> 输出： 输出乘积，如：151851741
>
> 例如：`求 1234567891011121314151617181920 * 2019181716151413121110987654321 的乘积结果 `

## 分析

所谓大数相乘（Multiplication algorithm），就是指数字比较大，相乘的结果超出了基本类型的表示范围，所以这样的数不能够直接做乘法运算。

目前大数乘法算法主要有以下几种思路：

- 模拟小学乘法：最简单的乘法竖式手算的累加型；
- 分治乘法：最简单的是Karatsuba乘法，一般化以后有Toom-Cook乘法；
- 快速傅里叶变换FFT：（为了避免精度问题，可以改用快速数论变换FNTT），时间复杂度O(NlgN lglgN)。具体可参照Schönhage–Strassen algorithm；
- 中国剩余定理：把每个数分解到一些互素的模上，然后每个同余方程对应乘起来就行；
- Furer’s algorithm：在渐进意义上FNTT还快的算法。不过好像不太实用，本文就不作介绍了。大家可以参考维基百科Fürer’s algorithm

## 解法

### 模拟小学乘法

```text
      7 8 9 6 5 2
×         3 2 1 1
-----------------
      7 8 9 6 5 2   <---- 第1趟 
    7 8 9 6 5 2     <---- 第2趟 
   ..........       <---- 第n趟 
-----------------
  ? ? ? ? ? ? ? ?   <---- 最后的值用另一个数组表示 

```

如上所示，乘法运算可以分拆为两步：

- 第一步，是将乘数与被乘数逐位相乘；
- 第二步，将逐位相乘得到的结果，对应相加起来。

这有点类似小学数学中，计算乘法时通常采用的“竖式运算”。用Java简单实现了这个算法，代码如下:

```java
/**
 * 大数相乘 - 模拟乘法手算累加
 */
public static Integer[] bigNumberMultiply(int[] arr1, int[] arr2){
    ArrayList<Integer> result = new ArrayList<>();  //中间求和的结果

    //arr2 逐位与arr1相乘
    for(int i = arr2.length - 1; i >= 0; i--){
        int carry = 0;
        ArrayList<Integer> singleList = new ArrayList<>();

        //arr2 逐位单次乘法的结果
        for(int j = arr1.length - 1; j >= 0; j--){
            int r = arr2[i] * arr1[j] + carry;
            int digit = r % 10;
            carry = r / 10;

            singleList.add(digit);
        }
        if(carry != 0){
            singleList.add(carry);
        }

        int resultCarry = 0, count = 0;
        int k = 0;
        int l = 0;
        int offset = arr2.length - 1 - i;       //加法的偏移位
        ArrayList<Integer> middleResult = new ArrayList<>();

        //arr2每位乘法的结果与上一轮的求和结果相加，从右向左做加法并进位
        while (k < singleList.size() || l < result.size()) {
            int kv = 0, lv = 0;
            if (k < singleList.size() && count >= offset) {
                kv = singleList.get(k++);
            }
            if (l < result.size()) {
                lv = result.get(l++);
            }
            int sum = resultCarry + kv + lv;
            middleResult.add(sum % 10);     //相加结果从右向左（高位到低位）暂时存储，最后需要逆向输出
            resultCarry = sum / 10;
            count++;
        }
        if(resultCarry != 0){
            middleResult.add(resultCarry);
        }
        result.clear();
        result = middleResult;
    }

    Collections.reverse(result);    //逆向输出结果
    return result.toArray(new Integer[result.size()]);
}
```

看了以上的代码，感觉思路虽然很简单，但是实现起来却很麻烦，那么我们有没有别的方法来实现这个程序呢？答案是有的，接下来我来介绍第二种方法。

### 模拟乘法累加 - 改进
简单来说，方法二就是先不算任何的进位，也就是说，将每一位相乘，相加的结果保存到同一个位置，到最后才计算进位。

例如：计算98×21,步骤如下

```text
        9  8
×       2  1
-------------
       (9)(8)  <---- 第1趟: 98×1的每一位结果 
  (18)(16)     <---- 第2趟: 98×2的每一位结果 
-------------
  (18)(25)(8)  <---- 这里就是相对位的和，还没有累加进位 
```

这里唯一要注意的便是进位问题，我们可以先不考虑进位，当所有位对应相加，产生结果之后，再考虑。从右向左依次累加，如果该位的数字大于10，那么我们用取余运算，在该位上只保留取余后的个位数，而将十位数进位（通过模运算得到）累加到高位便可，循环直到累加完毕。代码如下：

```java
/**
 * 大数相乘方法二
 */
public static int[] bigNumberMultiply2(int[] num1, int[] num2){
    // 分配一个空间，用来存储运算的结果，num1长的数 * num2长的数，结果不会超过num1+num2长
    int[] result = new int[num1.length + num2.length];

    // 先不考虑进位问题，根据竖式的乘法运算，num1的第i位与num2的第j位相乘，结果应该存放在结果的第i+j位上
    for (int i = 0; i < num1.length; i++){
        for (int j = 0; j < num2.length; j++){
            result[i + j + 1] += num1[i] * num2[j];	 // (因为进位的问题，最终放置到第i+j+1位)
        }
    }

    //单独处理进位
    for(int k = result.length-1; k > 0; k--){
        if(result[k] > 10){
            result[k - 1] += result[k] / 10;
            result[k] %= 10;
        }
    }
    return result;
}
```

> **！！注意：**这里的进位有个大坑，因为`result[]`数组是从左到右记录相对位的和（还没有进位），而最后的进位是从右向左累加进位，这样的话，如果最高位，也就是最左侧那一位的累加结果需要进位的话，`result[]`数组就没有空间存放了。

而正好result[]数组的最后一位空置，不可能被占用，我们就响应地把num1的第i位与num2的第j位相乘，结果应该存放在结果的第i+j位上的这个结果往后顺移一位（放到第i+j+1位），最后从右向左累加时就多了一个空间。

### 分治 - Karatsuba算法
以上两种模拟乘法的手算累加型算法，他们都是模拟普通乘法的计算方式，时间复杂度都是O(n^2)，而这个Karatsuba算法，时间复杂度仅有 O ( n^log ⁡23 )。下面，我就来介绍一下这个算法。

首先来看看这个算法是怎么进行计算的，见下图：

![Karatsuba Multiplication Algorithm步骤](https://cdn.jsdelivr.net/gh/Cutewr/blogimage@main/img/aeab3033e04e482de2eec39198efd003.png)

以上就是使用分治的方式计算乘法的原理。上面这个算法，由 Anatolii Alexeevitch Karatsuba 于1960年提出并于1962年发表，所以也被称为 Karatsuba 乘法。

根据上面的思路，实现的Karatsuba乘法代码如下：

```java
/**
 * Karatsuba乘法
 */
public static long karatsuba(long num1, long num2){
    //递归终止条件
    if(num1 < 10 || num2 < 10) return num1 * num2;

    // 计算拆分长度
    int size1 = String.valueOf(num1).length();
    int size2 = String.valueOf(num2).length();
    int halfN = Math.max(size1, size2) / 2;

    /* 拆分为a, b, c, d */
    long a = Long.valueOf(String.valueOf(num1).substring(0, size1 - halfN));
    long b = Long.valueOf(String.valueOf(num1).substring(size1 - halfN));
    long c = Long.valueOf(String.valueOf(num2).substring(0, size2 - halfN));
    long d = Long.valueOf(String.valueOf(num2).substring(size2 - halfN));

    // 计算z2, z0, z1, 此处的乘法使用递归
    long z2 = karatsuba(a, c);
    long z0 = karatsuba(b, d);
    long z1 = karatsuba((a + b), (c + d)) - z0 - z2;

    return (long)(z2 * Math.pow(10, (2*halfN)) + z1 * Math.pow(10, halfN) + z0);
}
```

