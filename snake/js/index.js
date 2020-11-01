//                  --------  Tools  --------
(function (window, undefined) {
    var Tools = {
        getRandom: function (min, max){
            return Math.floor(Math.random() * (max - min + 1)) +  min;
        }
    };
    window.Tools = Tools;
})(window, undefined);

//     ----------------------------    Parent  --------------------------
(function (window, undefined) {
    function Parent(options){
        options = options || {}; // 一定要写；原型继承时 new Parent(); 没有传进任何值，此时是undefined
        this.width = options.width || 20;
        this.height = options.height || 20;
    }
    // 假设有方法要重用
    // Parent.prototype.test = function(){
    //     console.log("test");
    // }
    window.Parent = Parent;
})(window, undefined);


//                 ---------  food  ----------
// 所有的js文件中书写的代码，都是全局作用域
// 自调用函数 -- 开启新的作用域，避免命名冲突(是局部作用域);
(function (window, undefined) {
    var position = "absolute";
// 记录上一次创建的食物，为删除做准备
    var elements = [];
    function Food(options) {
        options = options || {};
        this.x = options.x || 0;
        this.y = options.y || 0;
    //    this.width = options.width || 20;
    //    this.height = options.height || 20;
        // 借用构造函数
        Parent.call(this, options);

        this.backgroundColor = options.backgroundColor || "blue";
    }
    // 原型继承
    Food.prototype = new Parent();
    Food.prototype.constructor = Food;
// 渲染
    Food.prototype.render = function (map) {
        // 删除之前创建的食物
        remove();
        // 随机设置x和y的值
        this.x = Tools.getRandom(0, map.offsetWidth / this.width - 1) * this.width;
        this.y = Tools.getRandom(0, map.offsetHeight / this.height - 1) * this.height;
        // 动态创建div  页面上显示的食物
        var div = document.createElement("div");
        map.appendChild(div);
        elements.push(div);
        // 设置div属性
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.position = position;
        div.style.backgroundColor = this.backgroundColor;
    };
    function remove() {
        for (var i = elements.length-1;i >= 0;i--){
            // 删除div(元素)
            elements[i].parentNode.removeChild(elements[i]);
            // 删除数组中的元素
            // 第一个参数，从哪个元素开始删除。 第二个参数，删除几个元素
            elements.splice(i, 1);
        }
    }
    // 让构造函数可以让外部访问
    // 在window增加一个属性，(把构造函数赋值给增加的属性)因为window下的成员，所有地方都可以访问到；
    window.Food = Food;
})(window, undefined);

//                  ----------   snake   ----------
(function (window, undefined) {
    var position = "absolute";
    // 记录之前创建的蛇
    var elements = [];
    function Snake(options) {
        options = options || {};
        // 蛇节大小
    //    this.width = options.width || 20;
    //    this.height = options.height || 20;
        // 借用构造函数
        Parent.call(this, options);

        // 蛇移动的方向
        this.direction = options.direction || "right";
        // 蛇的身体 （蛇节串起来）第一个元素是蛇头
        this.body = [
            {x: 3, y: 2, color:'red'},
            {x: 2, y: 2, color:'blue'},
            {x: 1, y: 2, color:'blue'},
        ];
    }
    // 原型继承
    Snake.prototype = new Parent();
    Snake.prototype.constructor = Snake;

    Snake.prototype.render = function (map) {
        // 删除之前创建的蛇
        remove();
        // 把每一个蛇节渲染到地图上
        for (var i = 0,len = this.body.length;i < len;i++){
            var object = this.body[i];
            var div = document.createElement("div");
            map.appendChild(div);
            // 记录当前的蛇
            elements.push(div);
            div.style.position = position;
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.top = this.width * object.y + "px" ;
            div.style.left = this.height * object.x + "px";
            div.style.backgroundColor = object.color;
        }
    };
    function remove () {
        for (var i = elements.length - 1; i >= 0; i--) {
            // 删除div
            elements[i].parentNode.removeChild(elements[i]);
            elements.splice(i,1);
        }
    }
    // 控制蛇移动的方法
    Snake.prototype.move = function (food, map){
        // 控制蛇节移动(当前蛇节 到 上一个蛇节的位置)
        for (var i = this.body.length-1;i > 0;i--){
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        // 控制蛇头的移动
        // 判断蛇移动的方向
        var head = this.body[0];
        switch(this.direction){
            case "right":
                head.x = head.x + 1;
                break;
            case "left":
                head.x = head.x - 1;
                break;
            case "top":
                head.y = head.y - 1;
                break;
            case "bottom":
                head.y = head.y + 1;
                break;
        }
        // 判断蛇头是否和食物的坐标重合
        var headX = head.x * this.width;
        var headY = head.y * this.height;
        if (headX === food.x && headY === food.y){
            // 让蛇增加一节
            // 1 获取蛇的最后一节
            var last = this.body[this.body.length-1];
            // 2 给蛇的body 新增加一个对象；
            this.body.push({
                x: last.x,
                y: last.y,
                color: last.color
            });
            // 随机在地图上重新生成食物
            food.render(map);
        }
    };
    window.Snake = Snake;
})(window, undefined);

//                    ----------  Game  ----------
(function (window, undefined) {
    var that;  // 记录游戏对象
    function Game(map) {
        var r = Tools.getRandom(0, 255);
        var g = Tools.getRandom(0, 255);
        var b = Tools.getRandom(0, 255);
        this.food = new Food({
            backgroundColor:'rgb('+ r +','+ g +',' + b +')',
        });
        this.snake = new Snake();
        this.map = map;
        that = this;
    }
    Game.prototype.start = function () {
        // 把蛇和食物对象，渲染到地图上
        this.food.render(this.map);
        this.snake.render(this.map);

        // 开始游戏逻辑
        // 1 让蛇移动起来
        runSnake();
        // 2 当蛇遇到边界
        // 3 通过键盘控制蛇的移动方向
        bindKey();
        // 4 当蛇遇到食物

    };
    function runSnake (){
        var timerId = setInterval(function () {
            // 让蛇走一格
            // 在定时器的function中this是指向window对象的 不能用this.snake

            // 应用了bind()方法；可以用this 去指向
            this.snake.move(this.food, this.map);
            this.snake.render(this.map);
            // 当蛇遇到边界，停止下来；
            // 获取蛇头坐标
            var maxX = (this.map.offsetWidth / this.snake.width);
            var maxY = (this.map.offsetHeight / this.snake.height);
            var headX = this.snake.body[0].x;
            var headY = this.snake.body[0].y;
            if (headX < 0 || headX >= maxX){
                clearInterval(timerId);
                alert("Game over");
            }
            if (headY < 0 || headY >= maxY){
                alert("Game over");
                clearInterval(timerId);
            }
        }.bind(that),150);
    }
    function bindKey() {
        //     document.onkeydown = function () {}
        document.addEventListener('keydown', function (e) {
            // 判断键盘码
            // left-37  65; top - 38 87;right - 39 68;bottom - 40 83;
            // console.log(e.keyCode);
            switch(e.keyCode){
                case 37 : case 65 :
                this.snake.direction = "left";
                break;
                case 38 : case 87 :
                this.snake.direction = "top";
                break;
                case 39 : case 68 :
                this.snake.direction = "right";
                break;
                case 40 : case 83:
                this.snake.direction = "bottom";
                break;
            }
        }.bind(that),false)
    }
    window.Game = Game;
})(window, undefined);

//               --------   main   ---------
(function (window, undefined) {
    var map = document.getElementById("map");
    var game = new Game(map);
    game.start();
})(window, undefined);
