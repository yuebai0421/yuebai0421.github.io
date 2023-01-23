var can = document.getElementById('canvas');
var ctx = can.getContext('2d');
var w = can.width = window.innerWidth;
var h = can.height = window.innerHeight;

var count = 30;
var drops = [];
var starlist = [];
window.οnresize = function () {
    w = can.width = window.innerWidth;
    h = can.height = window.innerHeight;
};

function Drop() { }
Drop.prototype = {
    init: function () {
        this.x = random(0, w);
        // this.y = 0;
        this.y = h + 10;
        this.r = 1;//圆的半径
        this.color = '#0ff';
        this.vy = random(4, 5);//Y的偏移量
        this.vr = 0.5;
        this.a = 1;//透明度
        this.va = 0.96;
        this.text = getText();
        // this.l = random(h * 0.8, h * 0.9);//最大距离
        this.l = random(h * 0.1, h * 0.2);//最大距离
    },
    draw: function () {

        if (this.y < this.l) {	//原来的：this.y > this.l
            // ctx.beginPath();
            // ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            ctx.save();
            ctx.shadowBlur = 1;
            ctx.shadowColor = "#fff";

            ctx.strokeStyle = 'rgba(19,70,149,' + this.a + ')';
            ctx.font = this.r + "px" + " Georgia";
            ctx.textAlign = "center";
            ctx.strokeText(this.text, this.x, this.y);
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.fillStyle = color(this.a);
            ctx.fillRect(this.x, this.y, 2, 10);
        }
        this.update();
    },
    update: function () {
        if (this.y > this.l) {	//原来的this.y < this.l
            // this.x += this.vy;
            this.y -= this.vy;	//原来的+=
        } else {
            if (this.a > 0.03) {
                this.r += this.vr;
                if (this.r > 50) {
                    this.a *= this.va;
                }
            } else {
                this.init();
            }
        }
    }
}

function getText() {
    let textArr = ["❤", "玥玥", "雯雯",
        "满眼星辰", "⭐", "都是你",
        "看你骨骼惊奇", "是块和我恋爱的好材料",
        "最浓的情", "总是冷暖与共", "最懂的人", "才是最暖的伴",
        "注定要去的地方", "多晚都有光",
        "相濡以沫", "彼此牵手一生",
        "晚是世界的晚", "安是给你的安", "❤"];
    return textArr[Math.floor(Math.random() * textArr.length)];
}
function move() {	//主循环
    ctx.fillStyle = 'rgba(0,0,0,.1)';
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < drops.length; i++) {
        drops[i].draw();
    }


    starlist.forEach((item, i) => {
        item.draw();
        if (item.a < 0.05) {
            starlist.splice(i, 1);
        }
    })
    requestAnimationFrame(move);
};

function setup() {
    for (var i = 0; i < count; i++) {
        (function (j) {
            setTimeout(function () {
                var drop = new Drop();
                drop.init();
                drops.push(drop);
            }, j * 200);
        }(i))
    }
};
setup();
move();

function random(min, max) {
    return Math.random() * (max - min) + min;
};

function color(a) {	//随机颜色
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

//鼠标经过处粒子效果
canvas.addEventListener('mousemove', function (e) {
    starlist.push(new Star(e.offsetX, e.offsetY));
    // console.log(starlist)
})


function Star(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = (Math.random() - 0.5) * 2.5;
    this.color = 'rgb(' + random(0, 200) + ',' + random(0, 200) + ',' + random(0, 200) + ')';
    this.a = 1;
    // console.log(this.color);
    this.draw();
}
Star.prototype = {
    draw: function () {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = this.a;
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);	//本次版本画圆简单些
        ctx.fill();
        ctx.restore();
        this.updata();
    },
    updata() {
        this.x += this.vx;
        this.y += this.vy;
        this.a *= .975;
    }
}

let meshow = 0;
document.getElementById("canvas").ondblclick = function () {
    document.getElementById("me").style.display = "block";
    meshow = 1;
    var oAudio = $('#audio').get(0);
    oAudio.play()
    console.log(meshow);
}
document.getElementById("me").onclick = function () {
    console.log("==========");
    console.log(meshow);
    if (meshow == 1) {
        document.getElementById("dialog").style.display = "block";
    }
    if (meshow == 2) {
        document.getElementById("dialog").innerHTML = "满眼星辰都是你";
    }
    if (meshow == 3) {
        document.getElementById("dialog").innerHTML = "最浓的情，最浓的情";
    }
    if (meshow == 4) {
        document.getElementById("dialog").innerHTML = "最懂的人，才是最暖的伴";
    }
    if (meshow == 5) {
        document.getElementById("dialog").innerHTML = "相濡以沫，彼此牵手一生";
    }
    if (meshow == 6) {
        document.getElementById("dialog").innerHTML = "晚是世界的晚，安是给你的安";
    }
    if (meshow == 7) {
        document.getElementById("dialog").innerHTML = "继续点击跳转下一个界面❤";
    }
    if (meshow == 8) {
        window.location.href= "https://yuebai0421.github.io/BB/birthday";
    }
    meshow++;
}

var showtime = function () {
    var nowtime = new Date(),  //获取当前时间
        endtime = new Date("2023/1/24");  //定义结束时间 
    var lefttime = endtime.getTime() - nowtime.getTime();  //距离结束时间的毫秒数
    if (lefttime > 0) {
        leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)),  //计算天数
        lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24),  //计算小时数
        leftm = Math.floor(lefttime / (1000 * 60) % 60),  //计算分钟数
        lefts = Math.floor(lefttime / 1000 % 60);  //计算秒数
        return "距离宝贝降世还有" + leftd + "天" + lefth + ":" + leftm + ":" + lefts;  //返回倒计时的字符串
    }
    leftd = -Math.floor(lefttime / (1000 * 60 * 60 * 24)),  //计算天数
    lefth = -Math.floor(lefttime / (1000 * 60 * 60) % 24),  //计算小时数
    leftm = -Math.floor(lefttime / (1000 * 60) % 60),  //计算分钟数
    lefts = -Math.floor(lefttime / 1000 % 60);  //计算秒数
    return "宝贝降临：" + leftd + "天" + lefth + ":" + leftm + ":" + lefts;  //返回倒计时的字符串
    
}
var div = document.getElementById("showtime");
setInterval(function () {
    div.innerHTML = showtime();
}, 1000);  //反复执行函数本身

