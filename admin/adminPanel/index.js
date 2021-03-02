var IndexServerUrl = "";

if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
    IndexServerUrl = "http://52.220.134.60"
}else{
    IndexServerUrl = "https://52.220.134.60"
}

//ACCESS PANEL
function handleLogin() {
    let user = document.getElementById('chatbot_sub_admin__access-username-textbox').value
    let pwd = document.getElementById('chatbot_sub_admin__access-password-textbox').value

    var userenc = CryptoJS.AES.decrypt('U2FsdGVkX1/sUDBQuMfjvsqVuu7cgNyssxfE9hfn7xU=', "33f983e507509c172103bb800b25dc3c8f5b1a37e75adf5d22ef6c0e81699fa95ffeb745f1a38ae3e6f0aab7aa42c45bf2d9c55eb9407bacfbb7fb2499e4eebd").toString(CryptoJS.enc.Utf8)
    var pwdenc = CryptoJS.AES.decrypt('U2FsdGVkX1+Oy4dB5gl/gX0qNnRAj+fHZAexe10y3gSjAhbfjsjJI63cI8LYduNl', "33f983e507509c172103bb800b25dc3c8f5b1a37e75adf5d22ef6c0e81699fa95ffeb745f1a38ae3e6f0aab7aa42c45bf2d9c55eb9407bacfbb7fb2499e4eebd").toString(CryptoJS.enc.Utf8)

    if(user == userenc && pwd == pwdenc){
        document.getElementById('chatbot_sub_admin__access-panel').classList.remove('swing-in-top-fwd')
        document.getElementById('chatbot_sub_admin__access-panel').classList.add('swing-out-top-bck')
        document.getElementById('chatbot_sub_admin__container').classList.remove('chatbot_sub_admin__container-disabled')
    }
    else if(user != '' && pwd != ''){
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
            if(data.login && data.role == 'super_admin'){
                sessionStorage.setItem('authorization', data.token);
                document.getElementById('chatbot_sub_admin__access-panel').classList.remove('swing-in-top-fwd')
                document.getElementById('chatbot_sub_admin__access-panel').classList.add('swing-out-top-bck')
                document.getElementById('chatbot_sub_admin__container').classList.remove('chatbot_sub_admin__container-disabled')
                setTimeout(() => {
                    document.getElementById('chatbot_sub_admin__access-panel').style.display = 'none'
                }, 600);
            }else{
                document.getElementById('chatbot_sub_admin__access-submit').classList.remove('chatbot_sub_admin__access-submit-active')
                document.getElementById('chatbot_sub_admin__access-submit').classList.add('chatbot_sub_admin__access-submit-disable')
                document.getElementById('chatbot_sub_admin__access-submit').innerText = 'Access Denied'
            }
        })
    }
}

function handleUserInput() {
    if(document.getElementById('chatbot_sub_admin__access-submit').classList.contains('chatbot_sub_admin__access-submit-disable')){
        document.getElementById('chatbot_sub_admin__access-submit').classList.remove('chatbot_sub_admin__access-submit-disable')
        document.getElementById('chatbot_sub_admin__access-submit').classList.add('chatbot_sub_admin__access-submit-active')
        document.getElementById('chatbot_sub_admin__access-submit').innerText = 'Login'
    }
}

addEventListener('keydown', (event) => {
    let user = document.getElementById('chatbot_sub_admin__access-username-textbox').value
    let pwd = document.getElementById('chatbot_sub_admin__access-password-textbox').value

    if(event.keyCode == 9 && document.getElementById('chatbot_sub_admin__container').classList.contains('chatbot_sub_admin__container-disabled')){
        event.preventDefault()

        if(document.activeElement.id == 'chatbot_sub_admin__access-username-textbox'){
            document.getElementById('chatbot_sub_admin__access-password-textbox').select()
        }else{
            document.getElementById('chatbot_sub_admin__access-username-textbox').select()
        }
    }

    if(event.keyCode == 13 && user != '' && pwd != '' && document.getElementById('chatbot_sub_admin__access-submit').classList.contains('chatbot_sub_admin__access-submit-active')){
        handleLogin()
    }
})

//ADMIN PANEL

const rolesList = ['user', 'sub_admin', 'super_admin']

//handle on text input
function handleTextInput(id){
    let textbox1 = document.getElementById('id_textbox-'+id)
    let textbox2 = document.getElementById('username_textbox-'+id)
    let textbox3 = document.getElementById('email_textbox-'+id)
    let textbox4 = document.getElementById('role_textbox-'+id)

    if(textbox2.defaultValue == '' || textbox3.defaultValue == '' || textbox4.defaultValue == ''){
        document.getElementById('update-'+id).style.display = 'none'
        document.getElementById('delete-'+id).style.display = 'block'
    }else{
        document.getElementById('delete-'+id).style.display = 'none'
        document.getElementById('update-'+id).style.display = 'flex'
    }

    if(textbox1.defaultValue == textbox1.value && textbox2.defaultValue == textbox2.value && textbox3.defaultValue == textbox3.value && textbox4.defaultValue == textbox4.value){
        document.getElementById('update-'+id).style.display = 'none'
        document.getElementById('delete-'+id).style.display = 'block'
    }
}

//update record
function handleUpdate(id) {
    let username = document.getElementById('username_textbox-'+id).value
    let email = document.getElementById('email_textbox-'+id).value
    let role = document.getElementById('role_textbox-'+id).value

    if(username != '' && email != '' && rolesList.includes(role) && validateEmail(email) == true){
        
        fetch(IndexServerUrl+"/api/admin/updateAdmin", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer '+sessionStorage.getItem("authorization")
            },
            body: JSON.stringify({
                id: id,
                username: username,
                email: email,
                role: role
            }),
        })
        .then(response => response.json())
        .then(data => {
            handleNotification(data.status, data.message)
    
            if(data.status == 'success'){
                document.getElementById('username_textbox-'+id).defaultValue = document.getElementById('username_textbox-'+id).value
                document.getElementById('email_textbox-'+id).defaultValue = document.getElementById('email_textbox-'+id).value
                document.getElementById('id_textbox-'+id).defaultValue = document.getElementById('id_textbox-'+id).value
                document.getElementById('role_textbox-'+id).defaultValue = document.getElementById('role_textbox-'+id).value

                document.getElementById('update-'+id).style.display = 'none'
                document.getElementById('delete-'+id).style.display = 'block'
            }
        })
    }
    else if (username == '' || email == ''){
        handleNotification('failed', 'All fields are required')
     }
     else if(username != '' && email != '' && validateEmail(email) == false){
        handleNotification('failed', 'Email is not valid')
     }
     else if (rolesList.includes(role) == false){
        handleNotification('failed', 'Role is not valid')
     }
}

//delete record
function handleDelete(id) {
    fetch(IndexServerUrl+"/api/admin/deleteAdmin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer '+sessionStorage.getItem("authorization")
        },
        body: JSON.stringify({
            id: id,
        }),
    })
    .then(response => response.json())
    .then(data => {
        handleNotification(data.status, data.message)

        if(data.status == "success"){
            document.getElementById('chatbot_sub_admin_row-container-'+id).remove();
        }

        dataExist()
    })
    
}

function dataExist() {
    fetch(IndexServerUrl+"/api/admin/nextAdminId", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer '+sessionStorage.getItem("authorization")
        },
    })
    .then(response => response.json())
    .then(data => {
        if((data.message - 1) == 0){
            document.getElementById('chatbot_sub_admin__row-nodata').style.display = 'initial';
        }
    })
}

//validate email
function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//add record
function handleInsert(id) {
    let username = document.getElementById('username_textbox-'+id).value
    let email = document.getElementById('email_textbox-'+id).value
    let role = document.getElementById('role_textbox-'+id).value
    
    if(username != '' && email != '' && rolesList.includes(role) && validateEmail(email) == true){
        fetch(IndexServerUrl+"/api/admin/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer '+sessionStorage.getItem("authorization")
            },
            body: JSON.stringify({
                id: id,
                username: username,
                email: email,
                role: role
            }),
        })
        .then(response => response.json())
        .then(data => {
            handleNotification(data.status, data.message)
            if(data.status == 'success'){
                document.getElementById('username_textbox-'+id).defaultValue = document.getElementById('username_textbox-'+id).value
                document.getElementById('id_textbox-'+id).defaultValue = document.getElementById('id_textbox-'+id).value
                document.getElementById('email_textbox-'+id).defaultValue = document.getElementById('email_textbox-'+id).value
                document.getElementById('role_textbox-'+id).defaultValue = document.getElementById('role_textbox-'+id).value
    
                document.getElementById('insert-'+id).remove()
                document.getElementById('update-'+id).classList.remove('chatbot_sub_admin__insert-new')
                document.getElementById('delete-'+id).classList.remove('chatbot_sub_admin__insert-new')
                document.getElementById('update-'+id).classList.add('chatbot_sub_admin__button')
                document.getElementById('delete-'+id).classList.add('chatbot_sub_admin__button')
                document.getElementById('chatbot_sub_admin_new-data-'+id).classList.remove('chatbot_sub_admin__new-data')
            }
        })
    }
    else if (username == '' || email == '' || role == ''){
            handleNotification('failed', 'All fields are required')
    }
    else if(username != '' && email != '' && validateEmail(email) == false){
            handleNotification('failed', 'Email is not valid')
    }
    else if (rolesList.includes(role) == false){
        handleNotification('failed', 'Role is not valid')
     }
}

//handle notifications
function handleNotification(event, message) {
    if(event == 'success'){
        document.getElementById('chatbot_sub_admin__alert').style.background = 'rgba(45, 204, 5, 0.5)'
        document.getElementById('chatbot_sub_admin__alert').style.borderColor = 'rgba(45, 204, 5, 1)'
    }else{
        document.getElementById('chatbot_sub_admin__alert').style.background = 'rgba(255, 60, 60, 0.5)'
        document.getElementById('chatbot_sub_admin__alert').style.borderColor = 'rgba(255, 60, 60, 1)'
    }

    document.getElementById('chatbot_sub_admin__alert').textContent = message;

    setTimeout(() => {
        document.getElementById('chatbot_sub_admin__alert').style.opacity = 1;
        document.getElementById('chatbot_sub_admin__alert').style.transform = 'translateY(0)'
    }, 500);

    setTimeout(() => {
        document.getElementById('chatbot_sub_admin__alert').style.transform = 'translateY(60px)'
        document.getElementById('chatbot_sub_admin__alert').style.opacity = 0;
    }, 4000);
}


//handle new record
function handleNewRecord(){
    document.getElementById('chatbot_sub_admin__row-nodata').style.display = 'none';

    fetch(IndexServerUrl+"/api/admin/nextAdminId", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer '+sessionStorage.getItem("authorization")
        },
    })
    .then(response => response.json())
    .then(data => {
        if(document.getElementById('chatbot_sub_admin_row-container-'+data.message) == null){
            document.getElementById('chatbot_sub_admin__table').innerHTML += `
            <div class="chatbot_sub_admin__row" id="chatbot_sub_admin_row-container-${data.message}">
                <input id="id_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="text" class="chatbot_sub_admin__data" value="${data.message}"/>
                <input id="email_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="email" class="chatbot_sub_admin__data"/>
                <input id="username_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="text" class="chatbot_sub_admin__data"/>
                <input id="role_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="text" class="chatbot_sub_admin__data" style="text-transform: lowercase;" value="sub_admin"/>
                <div class="chatbot_sub_admin__data chatbot_sub_admin__new-data" id="chatbot_sub_admin_new-data-${data.message}">
                    <button id="insert-${data.message}" onclick="handleInsert(${data.message})" class="chatbot_sub_admin__insert-button chatbot_sub_admin__insert-new">Upload</button>
                    <button id="update-${data.message}" onclick="handleUpdate(${data.message})" class="chatbot_sub_admin__update-button chatbot_sub_admin__insert-new">Update</button>
                    <button id="delete-${data.message}" onclick="handleDelete(${data.message})" class="chatbot_sub_admin__delete-button chatbot_sub_admin__insert-new">Delete</button>
                </div>
            </div>`
        }

        document.getElementById('email_textbox-'+data.message).select();
    })
}

//get data
function getData() {
    fetch(IndexServerUrl+"/api/admin/adminList", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.data != null){

            document.getElementById('chatbot_sub_admin__row-nodata').style.display = 'none';

            data.data.forEach(subdata => {
                document.getElementById('chatbot_sub_admin__table').innerHTML += `
                <div class="chatbot_sub_admin__row" id="chatbot_sub_admin_row-container-${subdata.id}">
                    <input id="id_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="text" class="chatbot_sub_admin__data" value="${subdata.id}"/>
                    <input id="email_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="email" class="chatbot_sub_admin__data" value="${subdata.email}"/>
                    <input id="username_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="text" class="chatbot_sub_admin__data" value="${subdata.username}"/>
                    <input id="role_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="text" class="chatbot_sub_admin__data" value="${subdata.role}" style="text-transform: lowercase;"/>
                    <div class="chatbot_sub_admin__data">
                        <button id="update-${subdata.id}" onclick="handleUpdate(${subdata.id})" class="chatbot_sub_admin__update-button chatbot_sub_admin__button">Update</button>
                        <button id="delete-${subdata.id}" onclick="handleDelete(${subdata.id})" class="chatbot_sub_admin__delete-button chatbot_sub_admin__button">Delete</button>
                    </div>
                </div>
            `
            })

        }else{
            document.getElementById('chatbot_sub_admin__row-nodata').style.display = 'initial';
        }
    })
}

function init() {
    getData()
    sessionStorage.setItem('authorization', '');
}

init()