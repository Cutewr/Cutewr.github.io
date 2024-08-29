---
date: 2024-08-29
category:
  - 刷题笔记
tag:
  - 栈和队列
---

# 栈和队列

## 用栈实现队列【LC 232题】

请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（`push`、`pop`、`peek`、`empty`）：

实现 `MyQueue` 类：

- `void push(int x)` 将元素 x 推到队列的末尾
- `int pop()` 从队列的开头移除并返回元素
- `int peek()` 返回队列开头的元素
- `boolean empty()` 如果队列为空，返回 `true` ；否则，返回 `false`

**说明：**

- 你 **只能** 使用标准的栈操作 —— 也就是只有 `push to top`, `peek/pop from top`, `size`, 和 `is empty` 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。

<aside>
💡 实现点在于：一个元素经过两个栈，就成为了队列

把元素先加入stack2，当要出队列或者获取队列peek时，如果stack1为空，把stack2中的元素放入stack1中，再返回stack1.peek()

</aside>

```java
package StackQueue;

import java.util.Stack;

public class MyQueue {
    Stack<Integer> stack1;
    Stack<Integer> stack2;

    public MyQueue() {
        stack1=new Stack<>();
        stack2=new Stack<>();
    }

    public void push(int x) {
        stack2.push(x);
    }

    // 关键点
    public int pop() {
        if (!stack1.isEmpty()){
            return stack1.pop();
        }else {
            while (!stack2.isEmpty()){
                stack1.push(stack2.pop());
            }
        }
        return stack1.pop();
    }

    // 关键点
    public int peek() {
        if (!stack1.isEmpty()) return stack1.peek();
        else {
            while (!stack2.empty()){
                stack1.push(stack2.pop());
            }
        }
        return stack1.peek();
    }

    public boolean empty() {
        return stack1.isEmpty() && stack2.empty();
    }
}
```

## 用队列实现栈【LC 225题】

请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（`push`、`top`、`pop` 和 `empty`）。

实现 `MyStack` 类：

- `void push(int x)` 将元素 x 压入栈顶。
- `int pop()` 移除并返回栈顶元素。
- `int top()` 返回栈顶元素。
- `boolean empty()` 如果栈是空的，返回 `true` ；否则，返回 `false` 。

<aside>
💡 用一个队列来实现栈，关键点在于弹出最后一个入队元素，因此可以把前面的入队元素先出栈，再入栈；弹出最后一个元素，这样剩下的元素相对顺序还是不变的。

代码细节：注意在获取栈顶元素的时候，操作完前面的元素后，记录下最后入栈的元素，还需要对这个最后入栈的元素，进行一次出栈、入栈操作，保证整体元素顺序不变。

</aside>

```java
class MyStack {
    Queue<Integer> queue;

    public MyStack() {
        queue=new LinkedList<>();
    }
    
    public void push(int x) {
        queue.offer(x);
    }
    
    public int pop() {
        int size=queue.size();
        while(size>1){
            queue.offer(queue.poll());
            size--;
        }
        return queue.poll();
    }
    
    public int top() {
        int size=queue.size();
        while(size>1){
            queue.offer(queue.poll());
            size--;
        }
        int temp=queue.poll();
        queue.offer(temp);
        return temp;
    }
    
    public boolean empty() {
        return queue.isEmpty();
    }
}
```

## 有效的括号【LC 20题】

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

<aside>
💡 用栈来实现匹配，最左的左括号匹配最右的右括号。

代码实现步骤：

1. 用哈希表来记录匹配的左括号和右括号
2. 避免一开始就是右括号造成的栈空异常，先往栈中添加一个占位符
3. 遍历字符串中的元素，如果是左括号入栈，如果是右括号，判断它和当前栈顶括号是否匹配，不匹配直接返回false【注意，这里如果匹配是要弹出栈中的字符，因此使用pop()而不是peek()】
</aside>

```java
package StackQueue;

import java.util.HashMap;
import java.util.Stack;

public class IsValid {
    public boolean isValid(String s) {
        Stack<Character> stack=new Stack<>();
        HashMap<Character,Character> map=new HashMap<>();
        map.put('(',')');
        map.put('[',']');
        map.put('{','}');
        map.put('p','p');
        stack.push('p');
        for (char c : s.toCharArray()) {
            if (map.containsKey(c)) stack.push(c);
            else if (map.get(stack.pop())!=c) return false;
        }
        return stack.size()==1;
    }
}
```

## 删除字符串中的所有相邻重复项【LC 1047题】

给出由小写字母组成的字符串 `S`，**重复项删除操作**会选择两个相邻且相同的字母，并删除它们。

在 S 上反复执行重复项删除操作，直到无法继续删除。

在完成所有重复项删除操作后返回最终的字符串。答案保证唯一。

<aside>
💡 用栈来保存前一个字母，如果当前栈为空或者下一个字母和当前字母不相同，就加入当前字母；如果下一个字母和当前字母相同，则将当前字母都弹出。最后返回栈中剩余的结果【顺序是反过来的。】

我们可以不用真正的栈，用字母串来模拟栈。

实现细节：使用StringBuffer来对字符串进行增减操作。

</aside>

```java
package StackQueue;

public class RemoveDuplicates {
    public String removeDuplicates(String s) {
        StringBuffer res=new StringBuffer();
        for (char c : s.toCharArray()) {
            if (res.length()==0 || c!=res.charAt(res.length()-1)) res.append(c);
            else{
                res.deleteCharAt(res.length()-1);
            }
        }
        return res.toString();
    }
}
```

## 逆波兰表达式求值【LC 150题】

给你一个字符串数组 `tokens` ，表示一个根据 [逆波兰表示法](https://baike.baidu.com/item/%E9%80%86%E6%B3%A2%E5%85%B0%E5%BC%8F/128437) 表示的算术表达式。

请你计算该表达式。返回一个表示表达式值的整数。

**注意：**

- 有效的算符为 `'+'`、`'-'`、`'*'` 和 `'/'` 。
- 每个操作数（运算对象）都可以是一个整数或者另一个表达式。
- 两个整数之间的除法总是 **向零截断** 。
- 表达式中不含除零运算。
- 输入是一个根据逆波兰表示法表示的算术表达式。
- 答案及所有中间计算结果可以用 **32 位** 整数表示。

<aside>
💡 求后缀表达式的值。中缀表达式方便看懂，但是需要加括号，后缀表达式不需要。

代码实现：

1. 如果是数字，压栈；如果是操作符，弹出栈中的前两个元素用于运算，并把运算结果压入栈中。
2. 注意点：如果是减法，和除法。使用栈中的倒数第二个元素作为被减数或者被除数，减法可以使用-stack.pop()+stack.pop()，除法必须用temp保存两个操作数，除法不可以用1/stack.pop()*stack.pop()。比如在13/5这种情况下，1/5=0，答案错误。
</aside>

```java
package StackQueue;

import java.util.Stack;

public class EvalRPN {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack=new Stack<>();
        for (String token : tokens) {
            if (token.equals("+")){
                stack.push(stack.pop()+stack.pop());
            } else if (token.equals("-")) {
                //注意点一：减法
                stack.push(-stack.pop()+stack.pop());
            }else if (token.equals("/")) {
                //注意点二：除法
                //stack.push(1/stack.pop()*stack.pop());
                int temp1=stack.pop();
                int temp2=stack.pop();
                stack.push(temp2/temp1);
            }else if (token.equals("*")) {
                stack.push(stack.pop()*stack.pop());
            }else {
                stack.push(Integer.valueOf(token));
            }
        }
        return stack.peek();
    }
}
```