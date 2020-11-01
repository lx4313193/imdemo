// 所有的js文件中书写的代码，都是全局作用域
// 自调用函数 -- 开启新的作用域，避免命名冲突(是局部作用域);
(function () {
    var position = "absolute";
// 记录上一次创建的食物，为删除做准备
    var elements = [];
    function Food(options) {
        options = options || {};
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.backgroundColor = options.backgroundColor || "blue";
    }
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
})();
