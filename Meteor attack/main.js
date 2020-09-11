//Variáveis / constantes / objetos
const dialogo= {
    escrever: function(value="") {
        document.getElementById("dialogo").style.visibility="visible";
        document.getElementById("dialogo").innerHTML= value;
    },
    close: function() {
        document.getElementById("dialogo").style.visibility="hidden";
        setTimeout(function() {document.getElementById("dialogo").innerHTML=" ";}, 500);
    }
};
const dificuldade= {1: {vel: [20, 20, 20, 30], pt: 1}, 2: {vel: [30, 30, 40, 40], pt: 2}, 3: {vel: [40, 40, 40, 50], pt: 3}};
var pontuacao= {
    latest: 0,
    record: 0
};
const database= { //armazena dados padrões e importantes para o funcionamento do jogo
    erro: ["[WARNING] Esta função não está disponíve durante a execução do jogo, favor, se quiser usar, interrompa o processo.", "[WARNING] Se você fizer isso, sua pontuação não será salva, deseja continuar?"],
    dificuldade: "<h2 style='text-align: center;'>Em qual dificuldade desejas iniciar?</h2><br/><br/><span style='font-size: 14pt; text-align: center;'><div onclick='setHardly(1)'><span style='color: green;'>Dificuldade 1</span>: pontuação normal, velocidade normal</div><br/><div onclick='setHardly(2)'><span style='color: orange;'>Dificuldade 2</span>: velocidade 2x mais rápida, dobro de pontos</div><br/><div onclick='setHardly(3)'><span style='color: red;'>Dificuldade 3</span>: velocidade 3x mais rápida, triplo de pontos</div></span>",
    area: {
        y: 10,
        x: {min: 10, max: 1270}
    },
    maxSpawn: 4,
    end: 1380,
    gameOver: function(text="", anexo1="", anexo2="", anexo3="") {
        return `<h2 style="text-align: center;">Game Over!</h2><br/><div style="text-align: center;">${text}</div><br/><div style="text-align: left;">Pontuação: ${anexo1}</div><br/><div style="text-align: left";>Record: ${anexo2}</div><br/><div style="text-align: left";>Meteoros destruídos: ${anexo3}</div><br/><br/><input style="margin-left: 250px"; id="accept" class="initial" type="button" value="Ok" onclick="perda()"/>`;
    }
};
const higher= document.getElementById("higher"); //mostra a pontuação máxima 
const pontos= function() {
    return document.getElementById("pontos");
}; //pontuação atual
var removed= 0; //se algum bloco foi removido
var blocos= []; //blocos
var dificuldadeAtual= 1; //dificuldade atual
var gaming= false; //se o jogo está rodando
var paused= false; //se o jogo está pausado
const mira= document.getElementById("mira");
const longer= document.getElementById("longer");
//------------------------------------------------------------
const loaded= function() { //quando a página carrega
    let line= document.getElementById("line").getContext("2d");
    line.fillStyle="rgb(255, 255, 255)";
    line.fillRect(0, 0, 5, 150);
    document.addEventListener("click", mover);
};
const mover= function(event) {
    if (gaming) {
        mira.style.left=`${event.clientX - 223}px`;
        mira.style.top=`${event.clientY - 225}px`;
        mira.style.visibility="visible";
    };
};
const running= function() {
    return (gaming && !paused)?true:false;
};
const pause= function() {
    if (!paused) {
        document.getElementById("pause").setAttribute("src", "images/paused.png");
        paused= true;
    } else {
        document.getElementById("pause").setAttribute("src", "images/gaming.png");
        paused= false;
    };
};
const random= function(max= 0, min= 0) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
};
const perda= function() {
    pontuacao.latest= 0;
    dialogo.close();
    for (let i in blocos) {
        if (document.getElementById(blocos[i].id)!= null) {
            document.body.removeChild(document.getElementById(blocos[i].id));
        };
    };
    blocos= [];
    higher.innerHTML=`Higher Pontuation: ${pontuacao.record}<span id="pontos"> | Pontuação: ???</span>`;
    removed= 0;
};
const setHardly= function(value= 0) {
    dificuldadeAtual= value;
    dialogo.close();
    gaming= true;
    paused= false;
    document.getElementById("pause").setAttribute("src", "images/gaming.png");
};
const finish= function(type="") {
    switch(type) {
        case "interromper":
            if (gaming) {
                let interrupt= window.confirm(database.erro[1]);
                if (interrupt) {
                    for (let i in blocos) {
                        if (document.getElementById(blocos[i].id)!= null) {
                            document.body.removeChild(document.getElementById(blocos[i].id));
                        };
                    };
                    perda();
                };
            };
            break;
        case "normal":
            pontuacao.record= (pontuacao.latest>pontuacao.record)?pontuacao.latest:pontuacao.record;
            dialogo.escrever(database.gameOver("Infelizmente a Terra foi extinta! :(", pontuacao.latest, pontuacao.record, removed));
            break;
    };
    gaming= false;
    longer.style.visibility="hidden";
    setTimeout(
        function() {
            mira.style.visibility="hidden";
        }, 1000
    );
};
const start= function() { //inicia o jogo
    if (!gaming) {
        dialogo.escrever(database.dificuldade);
    } else {
        window.alert(database.erro[0]);
    };
};
const remover= function(event) {
    if (running()) {
        let id= event.target.id;
        let audio= document.createElement("audio");
        audio.innerHTML="<source src='break.mp3' type='audio/mp3' />";
        document.body.removeChild(document.getElementById(id));
        for (pos in blocos) {
            if (blocos[pos].id== id) {
                blocos[pos].isInGame= false;
            };
        };
        document.body.appendChild(audio);
        audio.play();
        setTimeout(
            function() {
                audio.pause();
                document.body.removeChild(audio);
            }, 6000
        );
        removed++;
    };
};
const spawn= function() {
    for (i= 1;i<= database.maxSpawn;i++) {
        let x= random(database.area.x.max, database.area.x.min);
        let tipo= random(3, 0);
        let fundo= `images/meteoros/meteoro${[1, 2, 3, 4][tipo]}.png`;
        let degree=`rotate(${{0: 0, 1: 90, 2: 90, 3: -20}[tipo]}deg)`;
        let bloco= document.createElement("img");
        blocos[blocos.length + 1]= {id: `b${blocos.length + 1}`, y: database.area.y, x: x, isInGame: true};
        bloco.setAttribute("class", "bloco");
        bloco.setAttribute("id", blocos[blocos.length - 1].id);
        bloco.setAttribute("src", fundo);
        bloco.style.transform= degree;
        bloco.style.left=`${x}px`;
        document.body.appendChild(bloco);
        bloco.addEventListener("click", remover);
    };
}; //spawna 3 blocos
setInterval(
    function() {
        if (running()) {
            spawn(); //spawna um objeto a cada 2.5 segundos
        };
    }, 2500
);
setInterval(
    function() {
        if (running()) {
            for (let i in blocos) {
                if (blocos[i].isInGame) {
                    blocos[i].y+= dificuldade[dificuldadeAtual].vel[random(3, 0)];
                    document.getElementById(blocos[i].id).style.top=`${blocos[i].y}px`;
                    if (blocos[i].x>= 50) {
                        blocos[i].x-= [10, 8, 5, 5, 5, 1][random(5, 0)];
                        document.getElementById(blocos[i].id).style.left=`${blocos[i].x}px`;
                    };
                    if (blocos[i].y + 50>= database.end) {
                        finish("normal");
                    };
                };
            };
        };
    }, 500
);
setInterval(
    function() {
        if (running() && removed> 0) {
            pontuacao.latest+= dificuldade[dificuldadeAtual].pt;
            pontos().innerHTML=` | Pontuação: ${pontuacao.latest}`;
        };
    }, 1000
);
setInterval(
    function() {
        if (running()) {
            let y= 0;
            let x= 0;
            for (pos in blocos) {
                if (blocos[pos].y> y && blocos[pos].isInGame) {
                    y= blocos[pos].y;
                    x= blocos[pos].x;
                };
            };
            longer.style.visibility="visible";
            longer.style.left=`${x}px`;
            longer.style.top=`${y - 130}px`;
        };
    }, 100
);