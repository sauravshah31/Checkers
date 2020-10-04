
var direction = ["up","down"];
var curr_player = "player1";
var curr_selection = null;
var curr_possible_moves = [];
var player1_score  = 0;
var player2_score = 0;

function get_opponent(player){
    if(player==="player1"){
        return "player2";
    }else if(player==="player2"){
        return "player1";
    }
}

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

        if(dir === "down"){
            if ( is_valid(config,pos[0]+1,pos[1]-1) ){
                res.push([pos[0]+1,pos[1]-1]);
            }
            if ( is_valid(config,pos[0]+1,pos[1]+1) ){
                res.push([pos[0]+1,pos[1]+1]);
            }
        }else if(dir==="up"){
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
    },200);
}

function swap(box1,box2){
    console.log(box1,box2);
    var className,id,src;
    className = box1.className;
    id = box1.id;
    src = box1.querySelectorAll('img')[0].src;

    box1.className = box2.className;
    box1.id = box2.id;
    box1.querySelectorAll('img')[0].src = box2.querySelectorAll('img')[0].src;

    box2.className = className;
    box2.id = id;
    box2.querySelectorAll('img')[0].src = src;

}
/*
function swap(config,box1,box2){
    var pos1,pos2;
    pos1 = search(config,box1);
    pos2 = search(config,box2);
    var temp = config[pos1[0]][pos1[1]];
    config[pos1[0]][pos1[1]] = config[pos2[0]][pos2[1]];
    config[pos2[0]][pos2[1]] = temp;
}
*/

function in_possible_move(box){
    for(var i=0;i<curr_possible_moves.length;i++){
        if(box.id===curr_possible_moves[i])
            return true;
    }
    return false;
}
function prompted_king(box,x,n){
    var dir;
    if(box.className.indexOf("player1")!==-1){
        dir = direction[0];
    }else if(box.className.indexOf("player2")!==-1){
        dir = direction[1];
    }
    console.log(dir);

    if(dir=="up" && x==0){
        return true;
    }else if(dir=="down" && x===(n-1)){
        return true;
    }

    return false;
}

function init_listeners(config){
    for(var i=0;i<config.length;i++){
        for(var j=0;j<config[i].length;j++){
            let box = config[i][j];
            let x = i;
            let n = config.length;
            config[i][j].addEventListener('click',function(e){
                var opponent = get_opponent(curr_player);
                if(box.className.indexOf(opponent)!==-1 || (box.className.indexOf("empty")!==-1 && curr_selection===null))
                    return;
                if(box.className.indexOf("empty")!==-1){
                    //make a move
                    curr_selection.classList.remove("selection");
                    if(in_possible_move(box)){
                        swap(curr_selection,box);
                        //swap(config,curr_selection,box);
                        if(prompted_king(box,x,n)){
                            var src = box.querySelectorAll('img')[0].src.indexOf("player1")!==-1?"player1_king.svg":"player2_king.svg";
                            box.querySelectorAll('img')[0].src = src;
                            box.classList.add("king");
                        }
                        curr_player = get_opponent(curr_player);
                        document.getElementById("curr_player").src = curr_player + ".svg";
                    }
                    curr_selection = null;
                    return;
                }
                if(curr_selection!=null){
                    curr_selection.classList.remove("selection");
                    if(curr_selection.id == box.id){
                        curr_selection = null;
                        return;
                    }
                }
                curr_selection = box;
                curr_selection.classList.add("selection");
                const pos = search(config,box);
                const possible_move = get_possible_move(config,pos);
                console.log(possible_move);
                curr_possible_moves = [];
                for(var p=0;p<possible_move.length;p++){
                    display_path(config,possible_move[p]);
                    curr_possible_moves.push(config[possible_move[p][0]][possible_move[p][1]].id);

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