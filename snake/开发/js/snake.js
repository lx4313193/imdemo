(function () {
    var position = "absolute";
    // 记录之前创建的蛇
    var elements = [];
    function Snake(options) {
        options = options || {};
        // 蛇节大小
        this.width = options.width || 20;
        this.height = options.height || 20;
        // 蛇移动的方向
        this.direction = options.direction || "right";
        // 蛇的身体 （蛇节串起来）第一个元素是蛇头
        this.body = [
            {x: 3, y: 2, color:'red'},
            {x: 2, y: 2, color:'blue'},
            {x: 1, y: 2, color:'blue'},
        ];
    }
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
    }
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
            //     this.body.push({
            //         x: last.x,
            //         y: last.y,
            //         color: last.color
            //     });
            var obj = {};
            extend(last, obj);
            this.body.push(obj);
            // 随机在地图上重新生成食物
            food.render(map);
        }
    };
    // 对象的拷贝
    // 复制对象的成员给另一个对象
    function extend(parent, child) {
        for (var key in parent){
            if (child[key]){
                continue;
            }
            child[key] = parent[key];
        }
    }
    window.Snake = Snake;
})();
