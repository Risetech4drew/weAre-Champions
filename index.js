
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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

    let from = fromInputEl.value
    let to = toInputEl.value

    if(textFieldValue === "" || from === "" || to === "") {
        textFieldEl.classList.add("applyRedBorder")
        fromInputEl.classList.add("applyRedBorder")
        toInputEl.classList.add("applyRedBorder")

    } else{

        textFieldEl.classList.remove("applyRedBorder")
        fromInputEl.classList.remove("applyRedBorder")
        toInputEl.classList.remove("applyRedBorder")

        const endorsementDetails = {

            message: textFieldValue,
            from: from,
            to:to
        }
    
        
    
        push(endorsementsInDb,endorsementDetails)
        
        textFieldEl.value = ""
        fromInputEl.value = ""
        toInputEl.value = ""

    }

    
})

// fetching data from database using onValue function
onValue(endorsementsInDb, function(snapShot){

    if(snapShot.exists()){
        let endorsementsArray = Object.entries(snapShot.val())
        
    
        clearEndorsementsEl()
    
        
        for(let i = 0; i < endorsementsArray.length; i++){
    
            let endorsementList = endorsementsArray[i]
            // console.log(endorsementList)
            let endorsementID = endorsementList[0]
            // console.log(endorsementID)
            let endorsementValue = endorsementList[1]
            let endorsementSender = endorsementValue.from
            let endorsementMessage = endorsementValue.message
            let endorsementReceiver = endorsementValue.to
            // console.log(endorsementSender)
            // console.log(endorsementMessage)
            // console.log(endorsementReceiver)
          
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
    let itemSender = itemValue.from
    let itemMessage = itemValue.message
    let itemReceiver = itemValue.to



    let li = document.createElement("li")
    li.innerHTML = `<h4>To ${itemReceiver}</h4>
                    <p>${itemMessage}</p>
                    <div class = "wrapper">
                        <h4>From ${itemSender}</h4>
                    </div>`
                    
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


function clearEndorsementsEl(){

    endorsementsListEl.innerHTML = ""
}