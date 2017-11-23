function main() {
    var canvas=document.getElementById("playArea");
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Fail to get the rendering context for Webgl");
        return;
    }
    var program = createProgram(gl,Gizmo.SHADERS[0].VASHADER_SOURCE,Gizmo.SHADERS[0].FASHADER_SOURCE);
    if(!program){
        console.log('Failed to create program');
    }
    gl.useProgram(program);
    gl.program = program;
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var ANGLE=0;
    var xformMatrix = new Matrix4();
    var xrecoverMatrix =new Matrix4();
    // xformMatrix.setTranslate(0,-0.7,0);
    xformMatrix.setRotate(ANGLE,0,0,1);
    xformMatrix.translate(0.5,-0.7,0);//(-x,-y,)
    xrecoverMatrix.translate(-0.5,0.7,0);//(x,y,)
    var u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix');
    var u_recoverMatrix = gl.getUniformLocation(gl.program,'u_recoverMatrix');
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
    var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
    if(a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
    }
    var vertexBuffer = gl.createBuffer();
    var vertices = new Float32Array([
        -1.0, 0.7, -1.0, 0.0, 0.0, 0.0,0.0, 0.7
    ]);
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position,2, gl.FLOAT,false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.uniform4f(u_FragColor,1.0,1.0,0.0,1.0);
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
    gl.uniformMatrix4fv(u_recoverMatrix, false, xrecoverMatrix.elements);
    gl.vertexAttrib1f(a_PointSize,5.0);
    gl.drawArrays(gl.POINTS,0,3);
    // var vertices = new Float32Array([
    //     0.0, 0.25, -0.25, -0.25, 0.25, -0.25
    // ]);
    gl.uniform4f(u_FragColor,1.0,0.0,0.0,1.0);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);


    canvas.onmousedown = function (ev) {
        var x=ev.clientX;
        var y=ev.clientY;
        var rect=ev.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        console.log([x,y]);
    };
}

function main2() {

    var game=new Gizmo.Game();
    var playArea=game.playArea;
    var gameGrid=playArea.gameGrid;
    var gameGridBox=gameGrid.gridBox;
    var canvas=document.getElementById("playArea");
    var physicsEngine=new Gizmo.PhysicsEngine();


    //点击新建事件
    document.getElementById("new-playArea").addEventListener("click",function () {
        alert("123");
    });
    // 鼠标移动事件监听
    canvas.onmouseover=function (ev) {
        if(game.modes===0){
            drawAllHandler=setInterval(function () {
                playArea.drawAll();
            },20);
            var clickEventIsOk=true;
            switch (game.state){
                case 1:{
                    var triangle=new Gizmo.Triangle();
                    triangle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item1-size").value)){
                        triangle.size=document.getElementById("tool-item1-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item1-angel").value)){
                        triangle.angel=document.getElementById("tool-item1-angel").value;
                    }
                    playArea.playAreaComponents.push(triangle);
                    gameGridBox.gridBoxSize=[triangle.size,triangle.size];
                    break;
                }
                case 2:{
                    var circle=new Gizmo.Circle();
                    circle.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item2-size").value)){
                        circle.size=document.getElementById("tool-item2-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item2-angel").value)){
                        circle.angel=document.getElementById("tool-item2-angel").value;
                    }
                    playArea.playAreaComponents.push(circle);
                    gameGridBox.gridBoxSize=[circle.size,circle.size];
                    break;
                }
                case 3:{
                    var ball=new Gizmo.Ball();
                    ball.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item3-size").value)){
                        ball.size=document.getElementById("tool-item3-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item3-angel").value)){
                        ball.angel=document.getElementById("tool-item3-angel").value;
                    }
                    playArea.playAreaComponents.push(ball);
                    gameGridBox.gridBoxSize=[ball.size,ball.size];
                    break;
                }
                case 4:{
                    var board=new Gizmo.Board();
                    board.update([0.0,0.0]);
                    if(!isNaN(document.getElementById("tool-item4-size").value)){
                        board.size=document.getElementById("tool-item4-size").value;
                    }
                    if(!isNaN(document.getElementById("tool-item4-angel").value)){
                        board.angel=document.getElementById("tool-item4-angel").value;
                    }
                    playArea.playAreaComponents.push(board);
                    gameGridBox.gridBoxSize=[board.size,board.size];
                    break;
                }
                default:
                    break;
            }
            canvas.onmousemove = function (ev) {
                gameGrid.gridBox.color=gameGrid.GREEN;
                var x=ev.clientX;
                var y=ev.clientY;
                var rect=ev.target.getBoundingClientRect();
                x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
                y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
                playArea.mousePosition=[x,y];
                switch (game.state){
                    case 1: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(triangle,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            console.log(gameGrid.gridBoxs);
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 2: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(circle,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 3: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(ball,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    case 4: {
                        playArea.playAreaComponents[playArea.playAreaComponents.length - 1].update([x, y]);
                        if(gameGrid.compatibleBoxs(board,1)){
                            gameGridBox.color=gameGrid.GREEN;
                            clickEventIsOk=true;
                        }
                        else{
                            gameGridBox.color=gameGrid.RED;
                            clickEventIsOk=false;
                        }
                        break;
                    }
                    default:
                        break;
                }
            };
            canvas.onmousedown = function (ev) {
                switch (game.state){
                    case 1:{
                        if(clickEventIsOk){
                            triangle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(triangle,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 2:{
                        if(clickEventIsOk){
                            circle.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(circle,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 3:{
                        if(clickEventIsOk){
                            ball.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(ball,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    case 4:{
                        if(clickEventIsOk){
                            board.fixFlag=true;
                            clickEventIsOk=false;
                            game.state=0;
                            gameGrid.fillGridBoxs(board,1);
                            canvas.onmousedown = null;
                        }
                        break;
                    }
                    default:
                        break;
                }
            };
            canvas.onmouseout = function (ev) {
                clearInterval(drawAllHandler);
                gameGrid.gridBox.color=gameGrid.WHITE;
                if(game.state===1)
                    playArea.playAreaComponents.pop();
                if(game.state===2)
                    playArea.playAreaComponents.pop();
                if(game.state===3)
                    playArea.playAreaComponents.pop();
                if(game.state===4)
                    playArea.playAreaComponents.pop();
                playArea.drawAll();
                canvas.onmousemove=null;
            };
        }
    };
    //点击新建三角形
    document.getElementById("tool-item1").addEventListener("click",function () {
        if(game.state!==1){
            game.state=1;
        }
    });
    //点击新建圆
    document.getElementById("tool-item2").addEventListener("click",function () {
        if(game.state!==2){
            game.state=2;
        }
    });
    //点击新建球
    document.getElementById("tool-item3").addEventListener("click",function () {
        if(game.state!==3){
            game.state=3;
        }
    });
    //新建长板
    document.getElementById("tool-item4").addEventListener("click",function () {
        if(game.state!==4){
            game.state=4;
        }
    });
    //运行
    document.getElementById("run").addEventListener("click",function () {
        game.modes=1;
        runAllHandler=setInterval(function () {
            playArea.physicsAll(physicsEngine);
            playArea.drawAll();
        },20);
    });
    //停止
    document.getElementById("stop").addEventListener("click",function () {
        game.modes=0;
        if(runAllHandler)
            clearInterval(runAllHandler);
    });
}
