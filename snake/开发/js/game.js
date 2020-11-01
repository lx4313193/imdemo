(function () {
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
    function runSnake (){
        var timerId = setInterval(function () {
            // 让蛇走一格
            // 在定时器的function中this是指向window对象的 不能用this.snake
            this.snake.move(this.food, this.map);
            this.snake.render(this.map);
            // 当蛇遇到边界，停止下来；
            // 获取蛇头坐标
            var maxX = (this.map.offsetWidth / this.snake.width) - 1;
            var maxY = (this.map.offsetHeight / this.snake.height) -1;
            var headX = this.snake.body[0].x;
            var headY = this.snake.body[0].y;
            if (headX < 0 || headX >= maxX){
                alert("Game over");
                clearInterval(timerId);
            }
            if (headY < 0 || headY >= maxY){
                alert("Game over");
                clearInterval(timerId);
            }
        }.bind(that),150);
    }
    window.Game = Game;
}());
