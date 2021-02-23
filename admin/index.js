const IndexServerUrl = "http://localhost:4000";

//ACCESS PANEL
function handleLogin() {
    let user = document.getElementById('chatbot_admin__access-username-textbox').value
    let pwd = document.getElementById('chatbot_admin__access-password-textbox').value

    if(user != '' && pwd != ''){
        fetch(IndexServerUrl+"/api/admin/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user,
                password: pwd
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.login){
                document.getElementById('chatbot_admin__access-panel').classList.remove('swing-in-top-fwd')
                document.getElementById('chatbot_admin__access-panel').classList.add('swing-out-top-bck')
                document.getElementById('chatbot_admin__container').classList.remove('chatbot_admin__container-disabled')
            }
            else{
                //
            }
        })
    }
}

addEventListener('keydown', (event) => {
    let user = document.getElementById('chatbot_admin__access-username-textbox').value
    let pwd = document.getElementById('chatbot_admin__access-password-textbox').value

    if(event.keyCode == 13 && user != '' && pwd != ''){
        handleLogin()
    }
})



//ADMIN PANEL

//handle on text input
function handleTextInput(id){
    let textbox1 = document.getElementById('id_textbox-'+id)
    let textbox2 = document.getElementById('token_textbox-'+id)

    if(textbox2.defaultValue == ''){
        document.getElementById('update-'+id).style.visibility = 'hidden'
        document.getElementById('delete-'+id).style.visibility = 'visible'
    }else{
        document.getElementById('delete-'+id).style.visibility = 'hidden'
        document.getElementById('update-'+id).style.visibility = 'visible'
    }

    if(textbox1.defaultValue == textbox1.value && textbox2.defaultValue == textbox2.value){
        document.getElementById('update-'+id).style.visibility = 'hidden'
        document.getElementById('delete-'+id).style.visibility = 'visible'
    }
}

//update record
function handleUpdate(id) {
    document.getElementById('update-'+id).style.visibility = 'hidden'
    document.getElementById('delete-'+id).style.visibility = 'visible'

    let token = document.getElementById('token_textbox-'+id).value

    fetch(IndexServerUrl+"/api/updateAccess", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            token: token,
        }),
    })
    .then(response => response.json())
    .then(data => {
        handleNotification(data.status, data.message)

        if(data.status == 'success'){
            document.getElementById('token_textbox-'+id).defaultValue = document.getElementById('token_textbox-'+id).value
            document.getElementById('id_textbox-'+id).defaultValue = document.getElementById('id_textbox-'+id).value
        }
    })
}

//delete record
function handleDelete(id) {

    fetch(IndexServerUrl+"/api/denyAccess", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
        }),
    })
    .then(response => response.json())
    .then(data => {
        handleNotification(data.status, data.message)

        if(data.status == "success"){
            document.getElementById('chatbot_admin_row-container-'+id).remove();
        }

        dataExist()
    })
    
}

function dataExist(callback) {
    fetch(IndexServerUrl+"/api/nextId", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if((data.message - 1) == 0){
            document.getElementById('chatbot_admin__row-nodata').style.display = 'initial';
        }
    })
}

//add record
function handleInsert(id) {
    let token = document.getElementById('token_textbox-'+id).value

    if(token != ''){
         fetch(IndexServerUrl+"/api/allowAccess", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                token: token,
            }),
        })
        .then(response => response.json())
        .then(data => {
            handleNotification(data.status, data.message)

            document.getElementById('token_textbox-'+id).defaultValue = document.getElementById('token_textbox-'+id).value
            document.getElementById('id_textbox-'+id).defaultValue = document.getElementById('id_textbox-'+id).value

            document.getElementById('insert-'+id).remove()
            document.getElementById('update-'+id).classList.remove('chatbot_admin__insert-new')
            document.getElementById('delete-'+id).classList.remove('chatbot_admin__insert-new')
            document.getElementById('update-'+id).classList.add('chatbot_admin__button')
            document.getElementById('delete-'+id).classList.add('chatbot_admin__button')
            document.getElementById('chatbot_admin_new-data-'+id).classList.remove('chatbot_admin__new-data')
        })
    }
}

//handle notifications
function handleNotification(event, message) {
    if(event == 'success'){
        document.getElementById('chatbot_admin__alert').style.background = 'rgba(45, 204, 5, 0.5)'
        document.getElementById('chatbot_admin__alert').style.borderColor = 'rgba(45, 204, 5, 1)'
    }else{
        document.getElementById('chatbot_admin__alert').style.background = 'rgba(255, 60, 60, 0.5)'
        document.getElementById('chatbot_admin__alert').style.borderColor = 'rgba(255, 60, 60, 1)'
    }

    document.getElementById('chatbot_admin__alert').textContent = message;

    setTimeout(() => {
        document.getElementById('chatbot_admin__alert').style.opacity = 1;
        document.getElementById('chatbot_admin__alert').style.transform = 'translateY(0)'
    }, 500);

    setTimeout(() => {
        document.getElementById('chatbot_admin__alert').style.transform = 'translateY(60px)'
        document.getElementById('chatbot_admin__alert').style.opacity = 0;
    }, 4000);
}

//handle new record
function handleNewRecord(){
    document.getElementById('chatbot_admin__row-nodata').style.display = 'none';

    fetch(IndexServerUrl+"/api/nextId", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        if(document.getElementById('chatbot_admin_row-container-'+data.message) == null){
            document.getElementById('chatbot_admin__table').innerHTML += `
            <div class="chatbot_admin__row" id="chatbot_admin_row-container-${data.message}">
                <input id="id_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="text" class="chatbot_admin__data" value="${data.message}"/>
                <input id="token_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="text" class="chatbot_admin__data"/>
                <div class="chatbot_admin__data chatbot_admin__new-data" id="chatbot_admin_new-data-${data.message}">
                    <button id="insert-${data.message}" onclick="handleInsert(${data.message})" class="chatbot_admin__insert-button chatbot_admin__insert-new">Insert</button>
                    <button id="update-${data.message}" onclick="handleUpdate(${data.message})" class="chatbot_admin__update-button chatbot_admin__insert-new">Update</button>
                    <button id="delete-${data.message}" onclick="handleDelete(${data.message})" class="chatbot_admin__delete-button chatbot_admin__insert-new">Delete</button>
                </div>
            </div>`
        }

        document.getElementById('token_textbox-'+data.message).select();
    })
}

//get data
function getData() {
    fetch(IndexServerUrl+"/api/accessList", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.data != null){

            document.getElementById('chatbot_admin__row-nodata').style.display = 'none';

            data.data.forEach(subdata => {
                document.getElementById('chatbot_admin__table').innerHTML += `
                <div class="chatbot_admin__row" id="chatbot_admin_row-container-${subdata.id}">
                    <input id="id_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="text" class="chatbot_admin__data" value="${subdata.id}"/>
                    <input id="token_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="text" class="chatbot_admin__data" value="${subdata.token}"/>
                    <div class="chatbot_admin__data">
                        <button id="update-${subdata.id}" onclick="handleUpdate(${subdata.id})" class="chatbot_admin__update-button chatbot_admin__button">Update</button>
                        <button id="delete-${subdata.id}" onclick="handleDelete(${subdata.id})" class="chatbot_admin__delete-button chatbot_admin__button">Delete</button>
                    </div>
                </div>
            `
            })

        }else{
            document.getElementById('chatbot_admin__row-nodata').style.display = 'initial';
        }
    })
}

getData()