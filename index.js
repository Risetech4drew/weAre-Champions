
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const textFieldEl = document.getElementById("textField-el")
const publishBtn = document.getElementById("publish-button")
const endorsementsListEl = document.getElementById("endorsementList-el")
const fromInputEl = document.getElementById("fromInput-el")
const toInputEl = document.getElementById("toInput-el")


// database
const appSettings = {

    databaseUrl:"https://endorsements-realtime-database-default-rtdb.firebaseio.com/",
    projectId:"endorsements-realtime-database"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDb = ref(database, "endorsements")





publishBtn.addEventListener("click", function(){
    let textFieldValue = textFieldEl.value

    appendEndorsementsEl(textFieldValue)

    push(endorsementsInDb,textFieldValue)


    textFieldEl.value = ""
})

// fetching data from database using onValue function
onValue(endorsementsInDb, function(snapShot){

    if(snapShot.exists()){
        let endorsementsArray = Object.entries(snapShot.val())
    
        clearEndorsementsEl()
    
        
        for(let i = 0; i < endorsementsArray.length; i++){
    
            let endorsementList = endorsementsArray[i]
            let endorsementID = endorsementList[0]
            let endorsementValue = endorsementList[1]
    
            
    
            appendEndorsementsEl(endorsementList)
        }

    } else {
        endorsementsListEl.innerHTML = "No endorsements here yet...."

        endorsementsListEl.classList.add('endorsements')
    }
   
})



// endorsements rendering function

function appendEndorsementsEl(item){

    let itemID = item[0]
    let itemValue = item[1]


    let li = document.createElement("li")
    li.innerHTML = `<p>${itemValue}</p>`
    endorsementsListEl.append(li)

    // endorsementsEl.innerHTML += `<li>
    //                                 ${endorsement}
    //                             </li>`


    // adding an eventListener 
    li.addEventListener("click", function(){

        let exactItemInDb = ref(database,`endorsements/${itemID}`)
        remove(exactItemInDb)
        
    })
}

//clear endosementsEl
function clearEndorsementsEl(){

    endorsementsListEl.innerHTML = ""
}