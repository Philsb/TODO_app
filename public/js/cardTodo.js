
var currentDraggedElement = null;
var currentDropTargets = new Set();
var num = 0;


function getRequest(url, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = callback;
    xhttp.open("GET", url);
    xhttp.send();
}


const initMain = function () {
    let dropTargets = document.getElementsByClassName("card-slot");
    let cards = document.getElementsByClassName("card-object");

    for (let index = 0; index < dropTargets.length; index++) {
        setDropTargetEvents( dropTargets[index]);
    }

    for (let index = 0; index < cards.length; index++) {
        setCardEvents( cards[index]);
    }

    document.onmousemove = e => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    };
    const button = document.getElementById("addButton");
    button.addEventListener("click", addCard);
}

const hideMenu = function() {
    document.getElementById("contextMenu") .style.display = "none";
};

function addCard(){
    let cardTemp = document.getElementById("main-card");
    let newCard = cardTemp.content.querySelector(".card-object").cloneNode(true);
    getRequest("https://asli-fun-fact-api.herokuapp.com/", (e) => {
        let response = e.currentTarget;
        if(response.readyState == 4){
            if (response.status = 200) {
                let responseJson = JSON.parse(response.responseText);
                console.log(response.responseText);
                newCard.querySelector(".card-body").innerHTML = responseJson["data"]["fact"];
            }
        }
    });
    let slotToInsert = document.getElementsByClassName("card-slot")[0];
    slotToInsert.classList.remove("empty-card-slot");
    newCard.setAttribute("id" , "card"+ (1000 + num).toString() );
    ++num;
    let appendedCard = slotToInsert.appendChild(newCard);


    // insert new slots
    let temp = document.getElementById("empty-slot");
    let newEmptySlot1 = temp.content.cloneNode(true).querySelector(".card-slot");
    let newEmptySlot2 = temp.content.cloneNode(true).querySelector(".card-slot");
    slotToInsert.parentElement.insertBefore(newEmptySlot1, slotToInsert);
    slotToInsert.parentElement.insertBefore(newEmptySlot2, slotToInsert.nextSibling);
    //Set events
    setCardEvents(newCard);
    setDropTargetEvents(newEmptySlot1);
    setDropTargetEvents(newEmptySlot2);
}



function setDropTargetEvents(dropTarget) {

    dropTarget.addEventListener("dragover", e => {
        e.preventDefault();
     
        //see how many cards are contained in the row
        let cardCount = 0;
        const childNodes = e.currentTarget.parentElement.childNodes;
        for (  let i = 0; i <  childNodes.length; i++) {
            if (childNodes[i].classList != undefined) {
                if (! childNodes[i].classList.contains("empty-card-slot")){
                    cardCount ++;
                }
            }
        }


        console.log(cardCount);

        e.currentTarget.classList.add("opened-slot-grow");
        e.currentTarget.classList.add('drag-over');
        currentDropTargets.add(e.currentTarget);

    });

    dropTarget.addEventListener('dragleave', e => {
        e.currentTarget.classList.remove('drag-over');
        e.currentTarget.classList.remove("opened-slot-grow");
        currentDropTargets.delete(e.currentTarget);
    });
}

function setCardEvents (card) {

    /*card.addEventListener('contextmenu', e => {
        e.preventDefault();

        if (document.getElementById("contextMenu") .style.display == "block"){ 
            hideMenu(); 
        }else{ 
            var menu = document.getElementById("contextMenu")      
            menu.style.display = 'block'; 
            menu.style.left = e.pageX + "px"; 
            menu.style.top = e.pageY + "px"; 
        }

    });*/

    card.addEventListener("dragstart", e => {
        e.dataTransfer.setData('text/plain', e.target.id);
        let parent = document.querySelector("#"+ e.target.id).parentElement;
        let node = document.querySelector("#"+ e.target.id);
        currentDraggedElement = e.target;
        
        //delete neighbor slots
        parent.previousElementSibling.remove();
        parent.nextElementSibling.remove();
        
        setTimeout(()=>{
            
            e.target.style.display = "none";
            parent.classList.add("empty-card-slot");
        }, 0 );

    });

    card.addEventListener("dragend", e => {
        const draggedObject = document.getElementById(e.target.id);
        let dropTarget = currentDropTargets.values().next().value;
        if (currentDropTargets.size != 0 && dropTarget.classList.contains("empty-card-slot")){
            currentDropTargets.clear();
            
            dropTarget.appendChild(draggedObject); 
            dropTarget.classList.remove("empty-card-slot");
            dropTarget.classList.remove("drag-over");

           
        }
        else{
            let parent = document.getElementById(e.target.id).parentElement;
            parent.classList.remove("empty-card-slot");
        }
        // insert new slots
        let temp = document.getElementById("empty-slot");
        let newEmptySlot1 = temp.content.cloneNode(true).querySelector(".card-slot");
        let newEmptySlot2 = temp.content.cloneNode(true).querySelector(".card-slot");
        draggedObject.parentElement.parentElement.insertBefore(newEmptySlot1, draggedObject.parentElement);
        draggedObject.parentElement.parentElement.insertBefore(newEmptySlot2, draggedObject.parentElement.nextSibling);
        setDropTargetEvents(newEmptySlot1);
        setDropTargetEvents(newEmptySlot2);
        e.target.style.display = "block";
    });

}
document.addEventListener("DOMContentLoaded", initMain);

