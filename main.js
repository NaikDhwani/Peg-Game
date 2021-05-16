var allTopLeftIdValue = [];
var allColors = ["#8C0D3D", 
	"#FFC200", "#174B7D", 
	"#25A800", "#B493AD", "#FEA002", 
	"#19A3EB", "#E1565D", "#D26404", "#C2C75D", 
	"#AA83DA", "#958D8D", "#F7E43A", "#67DD0B", "#E156BA"];
var diffX, diffY, theElement, newElement, neighbourTop, neighbourLeft;
var posX, posY, newX, newY;
var l = 400;
var t = 20;
var id = 1;
var value = "1";
var destinationFlag = moveFlag = false;
var winFlag = isPossibleMove = true;
var remainingPegs = 0;
var emptyPocket = 5;

function init(emptyPocket){
	var temp = 60;

	for(var i = 1; i <= 5; i++){
		for(var j = 1; j <= i; j++){

			if(i != 1){
				if(j == 1 && i == 2)
					l -= temp;
				else if(j == 1){
					temp += 120
					l -= temp;
				}		
				else
				l = l + 120;
			}
			if(id == emptyPocket){
				value= "0";
				allColors[id-1] = "#FFFFFF";
			}
			allTopLeftIdValue.push(new spanValues(t, l, id, value));
			id++;
			value = "1";
		}
		t += 80;
	}
	draw();
}

function startingValues(emptyPocket){
	allTopLeftIdValue = [];
	allColors = ["#8C0D3D", 
	"#FFC200", "#174B7D", 
	"#25A800", "#B493AD", "#FEA002", 
	"#19A3EB", "#E1565D", "#D26404", "#C2C75D", 
	"#AA83DA", "#958D8D", "#F7E43A", "#67DD0B", "#E156BA"];
	id = 1;
	value = "1";
	l = 400;
	t = 20;
	init(emptyPocket);
}

function spanValues(t, l, id, value) {
	this.t = t;
    this.l = l;
	this.id = id;
	this.value = value;
}

//Draw board
function draw(){
	var c = document.getElementById('gameBoard');
	c.innerHTML="";

	for(var i = 0; i < 15; i++){
		var span = document.createElement('span');
		span.id = allTopLeftIdValue[i].id;
		span.value = allTopLeftIdValue[i].value;
		span.classList.add("dot");
		span.style.backgroundColor = allColors[i];
		span.style.left = allTopLeftIdValue[i].l + "px";
		span.style.top = allTopLeftIdValue[i].t + "px";
		span.setAttribute('onmousedown', 'grabber(event)');
		c.appendChild(span);
	}
}

function grabber(event){
	theElement = event.currentTarget;

	theElement.style.zIndex = 10;

	posX = parseInt(theElement.style.left);
	posY = parseInt(theElement.style.top);

	diffX = event.clientX - posX;
	diffY = event.clientY - posY;
 
	if(theElement.value == 1){
		document.addEventListener("mousemove", mover, true);
		document.addEventListener("mouseup", dropper, true);
	}

	event.stopPropagation();
	event.preventDefault();
}

function mover(event) {
	newX = event.clientX - diffX;
	theElement.style.left = newX + "px";
	newY = event.clientY - diffY;
	theElement.style.top = newY + "px";

	event.stopPropagation();
}  

function dropper(event) {
	var currentElementId;

	if(isCorrectMove(event) && isCorrectDestination()){
		console.log("Correct Move!");
		document.getElementById("moveMessage").innerHTML="Correct Move!";
		for(var i = 0; i < 15; i++){
			if(allTopLeftIdValue[i].t == newY && allTopLeftIdValue[i].l == newX){
				allTopLeftIdValue[i].value = "1";
				allColors[i] = theElement.style.backgroundColor;
			}
			if(allTopLeftIdValue[i].t == neighbourTop && allTopLeftIdValue[i].l == neighbourLeft){
				allTopLeftIdValue[i].value = "0";
				allColors[i] = "#FFFFFF";
			}
		}
		currentElementId = theElement.id;
		allTopLeftIdValue[currentElementId-1].value = "0";
		allColors[currentElementId-1] = "#FFFFFF";

		if(!winCheck(allTopLeftIdValue)){
			if(remainingPegs == 1){
				document.getElementById("resultMessage").innerHTML="Victory!";
			}else if(remainingPegs == 2){
				document.getElementById("resultMessage").innerHTML="So close! Try again!";
			}else if(remainingPegs == 3){
				document.getElementById("resultMessage").innerHTML="You are improving! Try again!";
			}else if(remainingPegs >= 4){
				document.getElementById("resultMessage").innerHTML="Better luck next time.";
			}
		}
	}else{
		console.log("Not Correct Move!");
		document.getElementById("moveMessage").innerHTML="Not a Correct Move!";
	}

	destinationFlag = false;
	moveFlag = false;
	theElement.style.zIndex = 0;

	document.removeEventListener("mouseup", dropper, true);
	document.removeEventListener("mousemove", mover, true);

	draw();

	event.stopPropagation();
}

//Checks, is move correct?
function isCorrectMove(event){
	if(theElement.id == 6 || theElement.id == 9 || theElement.id == 10 || theElement.id == 13 || theElement.id == 14 || theElement.id == 15){
		//do same => (same top & left-240) or (top-160 & left-120)
		if((newY >= posY && newY <= posY+20) && (newX >= (posX-240) && newX <= (posX-220))){
			neighbourTop = posY;
			neighbourLeft = posX-120;
			newY = posY;
			newX = posX-240;
			return moveFlag = true;
		}
		else if((newY >= (posY-160) && newY <= (posY-140)) && (newX >= (posX-120) && newX <= (posX-100))){
			neighbourTop = posY-80;
			neighbourLeft = posX-60;
			newY = posY-160;
			newX = posX-120;
			return moveFlag = true;
		}
	}
	
	if(theElement.id == 4 || theElement.id == 7 || theElement.id == 8 || theElement.id == 11 || theElement.id == 12 || theElement.id == 13){
		//do same => (same top & left+240) or (top-160 & left+120)
		if((newY >= posY && newY <= posY+20) && (newX >= (posX+240) && newX <= (posX+260))){
			neighbourTop = posY;
			neighbourLeft = posX+120;
			newY = posY;
			newX = posX+240;
			return moveFlag = true;
		}
		else if((newY >= (posY-160) && newY <= (posY-140)) && (newX >= (posX+120) && newX <= (posX+140))){
			neighbourTop = posY-80;
			neighbourLeft = posX+60;
			newY = posY-160;
			newX = posX+120;
			return moveFlag = true;
		}
	}
	
	if(theElement.id == 4 || theElement.id == 6 || theElement.id == 1 || theElement.id == 2 || theElement.id == 3 || theElement.id == 5){
		//do same => top+160 & (left+120 or left-120)
		if((newY >= (posY+160) && newY <= (posY+180)) && (newX >= (posX+120) && newX <= (posX+140))){
			neighbourTop = posY+80;
			neighbourLeft = posX+60;
			newY = posY+160;
			newX = posX+120;
			return moveFlag = true;
		}
		else if((newY >= (posY+160) && newY <= (posY+180)) && (newX >= (posX-120) && newX <= (posX-100))){
			neighbourTop = posY+80;
			neighbourLeft = posX-60;
			newY = posY+160;
			newX = posX-120;
			return moveFlag = true;
		}
	}
	return moveFlag;
}

//Checks, is destination correct?
function isCorrectDestination(){
	var neighbourFlag = false;
	var emptyFlag = false;
	for(var i = 0; i < 15; i++){
		if(newY == allTopLeftIdValue[i].t && newX == allTopLeftIdValue[i].l){
			if(allTopLeftIdValue[i].value == 0){
				emptyFlag = true;	
			}
		}

		if(neighbourTop == allTopLeftIdValue[i].t && neighbourLeft == allTopLeftIdValue[i].l){
			if(allTopLeftIdValue[i].value == 1){
				neighbourFlag = true;	
			}
		}
	}

	if(neighbourFlag && emptyFlag)
		return destinationFlag = true;

	return destinationFlag;
}

//Reset
function randomReset(){
	emptyPocket = Math.floor(Math.random() * 15) + 1;
	startingValues(emptyPocket);
}

//Checks Win
function winCheck(allTopLeftIdValue){
	remainingPegs = 0;
	for(var i = 0; i < 15; i++){
		if(allTopLeftIdValue[i].value == 1){
			switch(true) {
				case (i==0): case (i==4): // peg - 1/5
					if(allTopLeftIdValue[i+1].value == 1 || allTopLeftIdValue[i+2].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						remainingPegs++;
						winFlag = true;
						isPossibleMove = false;
					}

				case (i==1): // peg - 2
					if(allTopLeftIdValue[i+3].value == 1 || allTopLeftIdValue[i+4].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==2): // peg - 3
					if(allTopLeftIdValue[i+4].value == 1 || allTopLeftIdValue[i+5].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==3): // peg - 4
					if(allTopLeftIdValue[i-2].value == 1 || allTopLeftIdValue[i+1].value == 1 || allTopLeftIdValue[i+4].value == 1 || allTopLeftIdValue[i+3].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==5): // peg - 6
					if(allTopLeftIdValue[i-3].value == 1 || allTopLeftIdValue[i-1].value == 1 || allTopLeftIdValue[i+3].value == 1 || allTopLeftIdValue[i+4].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==6): // peg - 7
					if(allTopLeftIdValue[i-3].value == 1 || allTopLeftIdValue[i+1].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==7): // peg - 8
					if(allTopLeftIdValue[i-1].value == 1 || allTopLeftIdValue[i+1].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==8): case (i==9): // peg - 9/10
					if(allTopLeftIdValue[i-4].value == 1 || allTopLeftIdValue[i-1].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==10): case (i==11): // peg - 11/12
					if(allTopLeftIdValue[i-4].value == 1 || allTopLeftIdValue[i+1].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==12): // peg - 13
					if(allTopLeftIdValue[i-5].value == 1 || allTopLeftIdValue[i-3].value == 1 || allTopLeftIdValue[i-1].value == 1 || allTopLeftIdValue[i+1].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;

				case (i==13): case (i==14): // peg - 14/15
					if(allTopLeftIdValue[i-5].value == 1 || allTopLeftIdValue[i-1].value == 1){
						winFlag = false;
						isPossibleMove = true;
					}else{
						winFlag = true;
						remainingPegs++;
						isPossibleMove = false;
					}
				break;	
			}
			if (!winFlag)
				break;
		}	
	}	
	console.log(remainingPegs);
	return isPossibleMove;
}