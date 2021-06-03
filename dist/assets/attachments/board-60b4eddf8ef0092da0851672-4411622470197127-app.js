const todoName = document.querySelector("#todoName"); // INPUT AJOUTE TODO
const todoAdd = document.querySelector("#todoAdd"); // VALIDER AJOUT TODO

let checkBoxIndex = document.querySelectorAll(".checkbox"); // CHECKBOX

const deleteTodo = document.querySelectorAll(".deleteTodo"); // SUPPRIMER UN TODO

let itemLeft = document.querySelector("#itemLeft");
let arrayTodo = document.querySelectorAll(".newTodo"); // TABLEAU CONTENANT LA TODOLIST PEUT ETRE RAJOUTER [...]
let uncompleteTodo = [...document.querySelectorAll(".uncompleted")]; // TABLEAU CONTENANT LES TODO INACHEVE
let completedTodo = [...document.querySelectorAll(".completed")]; // TABLEAU CONTENANT LES TODO ACHEVE
itemLeft.innerHTML = `${(uncompleteTodo.length)}`;

//////////// FILTER ALL /  COMPLETED / UNCOMPLETED / CLEAR COMPLETED ////////////
const filterAll = document.querySelector("#filterAll");
const filterUncompleted = document.querySelector("#filterUncompleted");
const filterCompleted = document.querySelector("#filterCompleted");
const clearCompleted = document.querySelector("#clear-completed");

const todoList =  document.querySelector("#todoList") // CONTAINER TODOLIST

dragndrop();

// ADD TODO
let checkID = 10; // ID FOR UNIQUE INPUT/LABEL
todoName.addEventListener("keydown",function(e){

    if (e.keyCode === 13 && todoName.value !== ""){ 
        const newTodo = document.createElement("li");
        const newDiv = document.createElement("div")
        const todoContent = document.querySelector("#sortlist");

        checkID++;
        newTodo.classList.add("newTodo")
        newTodo.classList.add("uncompleted")
        newTodo.setAttribute("draggable",true)

        newTodo.innerHTML += `<input id="check${checkID}" type="checkbox" class="checkbox" hidden>` //id="check3
        newTodo.innerHTML += `<label for="check${checkID}" class="customCheckbox"></label>` //for="check3
        newTodo.innerHTML += `<span>${todoName.value}</span>`
        newTodo.innerHTML += `<img src="./images/icon-cross.svg" alt="" class="deleteTodo">` // onclick ="function()" avoir

        todoContent.appendChild(newTodo)
        // items = document.querySelectorAll("#sortlist li")
        // all = document.querySelectorAll("#sortlist li")
        dragndrop()
        // items = document.querySelectorAll("#sortlist li")
        arrayTodo = document.querySelectorAll(".newTodo");
        uncompleteTodo = document.querySelectorAll(".uncompleted");
        itemLeft.innerHTML = `${(uncompleteTodo.length)}`;

        todoName.value = "";
    }
})

todoList.addEventListener("click",function(e){

    // REMOVE TODO
    if (e.target.classList.contains("deleteTodo")){

        e.target.parentNode.remove();
        arrayTodo = document.querySelectorAll(".newTodo");
    }

    // ADD CLASS COMPLETE OR UNCOMPLETED
    if (e.target.classList.contains("checkbox")){

        if (e.target.checked){
            e.target.parentNode.classList.remove("uncompleted");
            e.target.parentNode.classList.add("completed");
        } else {
            e.target.parentNode.classList.remove("completed");
            e.target.parentNode.classList.add("uncompleted");
        }
    }
    completedTodo = document.querySelectorAll(".completed");
    uncompleteTodo = document.querySelectorAll(".uncompleted");
    itemLeft.innerHTML = `${(uncompleteTodo.length)}`;
})

// FILTER ALL
filterAll.addEventListener("click", function(){

    filterAll.classList.add("select");
    filterUncompleted.classList.remove("select");
    filterCompleted.classList.remove("select");

    for (let i = 0 ; i < arrayTodo.length ; i++){
        arrayTodo[i].style.display = "flex";
    }

})

// FILTER UNCOMPLETED
filterUncompleted.addEventListener("click", function(){

    filterUncompleted.classList.add("select");
    filterCompleted.classList.remove("select");
    filterAll.classList.remove("select");

    for (let j = 0 ; j < completedTodo.length ; j++){
        completedTodo[j].style.display = "none";
    }
    for (let i = 0 ; i < uncompleteTodo.length ; i++){
        uncompleteTodo[i].style.display = "flex";
    }
})

// FILTER COMPLETED
filterCompleted.addEventListener("click", function(){

    filterCompleted.classList.add("select");
    filterUncompleted.classList.remove("select");
    filterAll.classList.remove("select");

    for (let j = 0 ; j < completedTodo.length ; j++){
        completedTodo[j].style.display = "flex";
    }
    for (let i = 0 ; i < uncompleteTodo.length ; i++){
        uncompleteTodo[i].style.display = "none";
    }

})

// CLEAR COMPLETED
clearCompleted.addEventListener("click",function(){

    for (let complete of completedTodo){
        complete.remove()
    }

})

// DARK / LIGHT THEME
const theme = document.querySelector("#theme");
const container = document.querySelector(".container");

theme.addEventListener("click",function(){

    if (theme.classList.contains("light")){

        theme.src = "images/icon-moon.svg";
        theme.classList.remove("light")
        theme.classList.add("dark")
        document.querySelector("body").classList.add("light");
        document.querySelector("body").classList.remove("dark");

    } else {

        theme.src = "images/icon-sun.svg";
        theme.classList.add("light")
        theme.classList.remove("dark")
        document.querySelector("body").classList.remove("light");
        document.querySelector("body").classList.add("dark");
    }   
})

// DRAG N DROP
function dragndrop (){
    
    let items = document.querySelectorAll("#sortlist li")

    dragged = null;

    for (let i of items){
        i.addEventListener("dragstart", function() {
            dragged = this;
            // setTimeout(() => (i.classList.add("d-none")),0) ;
            for (let it of items){
                if (it != dragged) it.classList.add("tenu");
            }
        });

        i.addEventListener("dragenter", function() {
            if (this != dragged) this.classList.add("active");
        })
        i.addEventListener("dragleave", function() {
            this.classList.remove("active");
        })

        i.addEventListener("dragend", function() {
            for (let it of items){
                it.classList.remove("tenu");
                this.classList.remove("active");
            }
            i.classList.remove("d-none");
        })

        i.addEventListener("dragover", function(e){
            e.preventDefault();
            i.classList.add("active");
        })

        i.addEventListener("drop", function(e){
            e.preventDefault();
            i.classList.remove("active");
            if (this != dragged) {

                let all = document.querySelectorAll("#sortlist li");
                console.log(all);
                    draggedpos = 0 ,droppedpos = 0;
                for (let it = 0 ; it < all.length; it++){
                    if (dragged == all[it]) draggedpos = it;
                    if (this == all[it]) droppedpos = it;
                }
                console.log("dragPos"+draggedpos)

                console.log("dropPos"+droppedpos)
                if(draggedpos < droppedpos){

                    this.parentNode.insertBefore(dragged,this.nextSibling);  

                } else {

                    this.parentNode.insertBefore(dragged,this);  

                }
                
            }
        })
    } 
}

