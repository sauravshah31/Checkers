uid = 0;

function get_row(cols,src1,src2,player){
    var row = document.createElement('div')
    row.className = "grid_row";
    for (var i=0;i<cols;i++){
        var span = document.createElement('span');
        var img = document.createElement('img');
        img.src = i%2==0?src1:src2;
        img.alt="";
        if(img.src.indexOf("#")!==-1){
            span.className = "empty";
        }else{
            span.className = player;
        }
        span.id=uid++;
        span.appendChild(img);
        row.appendChild(span);
    }
    return row
}

function get_layout(n){
    var game = document.createElement('div');
    var src1,src2 = "";
    game.id="game";
    for(var i=0;i<n/2-1;i++){
        if(i%2==0){
            src1="player2.svg";
            src2="#";
        }else{
            src1="#";
            src2="player2.svg";
        }
        var row = get_row(n,src1,src2,"player2");
        game.appendChild(row)
    }
    for(var i=0;i<2;i++){
        var row = get_row(n,"#","#","player2");
        game.appendChild(row)
    }
    for(var i=0;i<n/2-1;i++){
        if(i%2==0){
            src1="#";
            src2="player1.svg";
        }else{
            src1="player1.svg";
            src2="#";
        }
        var row = get_row(n,src1,src2,"player1");
        game.appendChild(row)
    }
    return game;
}

var game = get_layout(8);
document.getElementById('game_space').innerHTML = "";
document.getElementById('game_space').appendChild(game);