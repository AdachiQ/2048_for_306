#从[Hexagonal 2048](https://github.com/Baiqiang/2048-hexagon)folk来的网页游戏。
主要进行了如下修改：

1. 使用 [2048](https://github.com/gabrielecirulli/2048) 中的存储模块实现游戏数据的存储。 [Hexagonal 2048](https://github.com/Baiqiang/2048-hexagon) 只能储存最高得分，并不能保存当前游戏状态，关闭网页后只能从头开始。这个版本则能够保存当前游戏状态到本地缓存，下次再次打开网页能够继续上次的游戏。

2. 仿照 [2048](https://github.com/gabrielecirulli/2048) 增加了弹出式的文字提示

3. 将六边形中的空白改造成勋章，分数越高能够解锁越多的勋章，勋章图片为小伙伴们的网络头像^_^


##[戳我玩游戏！](http://adachiq.github.io/2048_for_306/)