
var direction = ["down","up"];
function search(config,box){
    for(var i=0;i<config.length;i++){
        for(var j=0;j<config[i].length;j++){
            if(box.id == config[i][j].id){
                return [i,j];
            }
        }
    }
    return [-1,-1];
}

function is_valid(config,x,y){
    n = config.length;
    if(x<0 || y<0){
        return false;
    }
    if(x>=n || y>=n){
        return false;
    }
    if(config[x][y].className.indexOf("empty")===-1)
        return false;
    return true;
}

function get_possible_move(config,pos){
    var box = config[pos[0]][pos[1]];
    var n = config.length;
    var res = [];
    if(box.className.indexOf("king")!==-1){
        if ( is_valid(config,pos[0]+1,pos[1]-1) ){
            res.push([pos[0]+1,pos[1]-1]);
        }
        if ( is_valid(config,pos[0]+1,pos[1]+1) ){
            res.push([pos[0]+1,pos[1]+1]);
        }
        if ( is_valid(config,pos[0]-1,pos[1]-1) ){
            res.push([pos[0]-1,pos[1]-1]);
        }
        if ( is_valid(config,pos[0]-1,pos[1]+1) ){
            res.push([pos[0]-1,pos[1]+1]);
        }
    }else{
        var dir;
        if(box.className.indexOf("player1")!==-1){
            dir = direction[0];
        }else if(box.className.indexOf("player2")!==-1){
            dir = direction[1];
        }

        if(dir === "up"){
            if ( is_valid(config,pos[0]+1,pos[1]-1) ){
                res.push([pos[0]+1,pos[1]-1]);
            }
            if ( is_valid(config,pos[0]+1,pos[1]+1) ){
                res.push([pos[0]+1,pos[1]+1]);
            }
        }else if(dir==="down"){
            if ( is_valid(config,pos[0]-1,pos[1]-1) ){
                res.push([pos[0]-1,pos[1]-1]);
            }
            if ( is_valid(config,pos[0]-1,pos[1]+1) ){
                res.push([pos[0]-1,pos[1]+1]);
            }
        }
    }
    return res;
}

function display_path(config,pos,remove=false){
    var x,y;
    x = pos[0];
    y = pos[1];
    var box = config[x][y];
    if(remove===true){
        box.classList.remove("available");
        return;
    }
    box.classList.add("available");
    setTimeout(function(){
        display_path(config,pos,true);
    },2000);
}

function init_listeners(config){
    for(var i=0;i<config.length;i++){
        for(var j=0;j<config[i].length;j++){
            let box = config[i][j];
            config[i][j].addEventListener('click',function(e){
                const pos = search(config,box);
                const possible_move = get_possible_move(config,pos);
                console.log(possible_move);
                for(var p=0;p<possible_move.length;p++){
                    display_path(config,possible_move[p]);
                }
            });
        }
    }
}

function get_board_config(){
    var rows = document.querySelectorAll('.grid_row');
    var config = [];
    for(var i=0;i<rows.length;i++){
        config.push([]);
        var span = rows[i].querySelectorAll('span');
        for(var j=0;j<span.length;j++){
            config[i].push(span[j]);
        }
    }
    return config;
}

var config = get_board_config();
init_listeners(config);