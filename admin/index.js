const IndexServerUrl = "http://localhost:4000";
var userId = 0;

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

                if(data.role == 'super_admin'){
                    document.getElementById('chatbot_admin__access-admin').style.display = 'block'
                }else{
                    document.getElementById('chatbot_admin__access-admin').style.display = 'none'
                }

                userId = data.id
                document.getElementById('chatbot_admin__profile-username').defaultValue = data.username
                document.getElementById('chatbot_admin__profile-email').defaultValue = data.email

                document.getElementById('chatbot_admin__access-panel').classList.remove('swing-in-top-fwd')
                document.getElementById('chatbot_admin__access-panel').classList.add('swing-out-top-bck')
                document.getElementById('chatbot_admin__container').classList.remove('chatbot_admin__container-disabled')
                setTimeout(() => {
                    document.getElementById('chatbot_admin__access-panel').style.display = 'none'
                }, 600);
            }else{
                document.getElementById('chatbot_admin__access-submit').classList.remove('chatbot_admin__access-submit-active')
                document.getElementById('chatbot_admin__access-submit').classList.add('chatbot_admin__access-submit-disable')
                document.getElementById('chatbot_admin__access-submit').innerText = 'Access Denied'
            }
        })
    }
}

function handleUserInput() {
    if(document.getElementById('chatbot_admin__access-submit').classList.contains('chatbot_admin__access-submit-disable')){
        document.getElementById('chatbot_admin__access-submit').classList.remove('chatbot_admin__access-submit-disable')
        document.getElementById('chatbot_admin__access-submit').classList.add('chatbot_admin__access-submit-active')
        document.getElementById('chatbot_admin__access-submit').innerText = 'Login'
    }
}

//handle key down
addEventListener('keydown', (event) => {
    let user = document.getElementById('chatbot_admin__access-username-textbox').value
    let pwd = document.getElementById('chatbot_admin__access-password-textbox').value

    if(event.keyCode == 9 && document.getElementById('chatbot_admin__container').classList.contains('chatbot_admin__container-disabled') && document.getElementById('chatbot_admin__access-panel').style.display != 'none'){
        event.preventDefault()

        if(document.activeElement.id == 'chatbot_admin__access-username-textbox'){
            document.getElementById('chatbot_admin__access-password-textbox').select()
        }else{
            document.getElementById('chatbot_admin__access-username-textbox').select()
        }
    }
    else if(event.keyCode == 9 && document.getElementById('chatbot_admin__container').classList.contains('chatbot_admin__container-disabled') && document.getElementById('chatbot_admin__profile-container').style.display != 'none'){
        //const inputTxtboxList = ['chatbot_admin__profile-username', 'chatbot_admin__profile-email', 'chatbot_admin__profile-password', 'chatbot_admin__profile-cpassword']

        if(document.activeElement.id == 'chatbot_admin__profile-cpassword'){
            event.preventDefault()
            document.getElementById('chatbot_admin__profile-username').select()
        }
    }

    if(event.keyCode == 13 && user != '' && pwd != '' && document.getElementById('chatbot_admin__access-submit').classList.contains('chatbot_admin__access-submit-active') && document.getElementById('chatbot_admin__access-panel').style.display != 'none'){
        handleLogin()
    }
})

//ADMIN PANEL

//handle profile
function handleProfile() {
    let profile_container = document.getElementById('chatbot_admin__profile-container')
    
    profile_container.style.display = 'flex'
    profile_container.classList.remove('swing-out-top-bck')
    profile_container.classList.add('swing-in-top-fwd')
    document.getElementById('chatbot_admin__container').classList.add('chatbot_admin__container-disabled')
}

function handleProfileExit() {
    let profile_container = document.getElementById('chatbot_admin__profile-container')

    profile_container.classList.remove('swing-in-top-fwd')
    profile_container.classList.add('swing-out-top-bck')
    setTimeout(() => {
        profile_container.style.display = 'none'
    }, 500);
    document.getElementById('chatbot_admin__container').classList.remove('chatbot_admin__container-disabled')
}

function handleProfileTextInput1() {
    if(document.getElementById('chatbot_admin__profile-update-content').classList.contains('chatbot_admin__access-submit-disable')){
        document.getElementById('chatbot_admin__profile-update-content').classList.remove('chatbot_admin__access-submit-disable')
        document.getElementById('chatbot_admin__profile-update-content').classList.add('chatbot_admin__access-submit-active')
        document.getElementById('chatbot_admin__profile-update-content').innerText = 'Update'
    }
}

function handleProfileTextInput2() {
    if(document.getElementById('chatbot_admin__profile-update-password').classList.contains('chatbot_admin__access-submit-disable')){
        document.getElementById('chatbot_admin__profile-update-password').classList.remove('chatbot_admin__access-submit-disable')
        document.getElementById('chatbot_admin__profile-update-password').classList.add('chatbot_admin__access-submit-active')
        document.getElementById('chatbot_admin__profile-update-password').innerText = 'Update'
    }
}

function handleProfileUpdateContent() {

    let username = document.getElementById('chatbot_admin__profile-username')
    let email = document.getElementById('chatbot_admin__profile-email')

    if(username.value != username.defaultValue || email.value != email.defaultValue){

        fetch(IndexServerUrl+"/api/admin/updateAdminProfile", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                email: email.value,
                username: username.value
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.status == 'success'){
                
                username.defaultValue = username.value
                email.defaultValue = email.value

                document.getElementById('chatbot_admin__profile-update-content').innerText = data.message
    
                setTimeout(() => {
                    document.getElementById('chatbot_admin__profile-update-content').innerText = 'Update'
                }, 1500);
            }else{
                document.getElementById('chatbot_admin__profile-update-content').classList.remove('chatbot_admin__access-submit-active')
                document.getElementById('chatbot_admin__profile-update-content').classList.add('chatbot_admin__access-submit-disable')
                document.getElementById('chatbot_admin__profile-update-content').innerText = data.message
            }
        })
    }
}

function handleProfileUpdatePwd() {
    
    let pwd = document.getElementById('chatbot_admin__profile-password')
    let Cpwd = document.getElementById('chatbot_admin__profile-cpassword')

    if(pwd.value == Cpwd.value){

        fetch(IndexServerUrl+"/api/admin/updateAdminPwd", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                password: pwd.value
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.status == 'success'){

                pwd.value = ''
                Cpwd.value = ''

                document.getElementById('chatbot_admin__profile-update-password').innerText = data.message
    
                setTimeout(() => {
                    document.getElementById('chatbot_admin__profile-update-password').innerText = 'Update'
                }, 1500);
            }else{
                document.getElementById('chatbot_admin__profile-update-password').classList.remove('chatbot_admin__access-submit-active')
                document.getElementById('chatbot_admin__profile-update-password').classList.add('chatbot_admin__access-submit-disable')
                document.getElementById('chatbot_admin__profile-update-password').innerText = data.message
            }
        })
    }
    else{
        document.getElementById('chatbot_admin__profile-update-password').classList.remove('chatbot_admin__access-submit-active')
        document.getElementById('chatbot_admin__profile-update-password').classList.add('chatbot_admin__access-submit-disable')
        document.getElementById('chatbot_admin__profile-update-password').innerText = "Passwords dosen't match"
    }
}

//handle on text input
function handleTextInput(id){
    let textbox1 = document.getElementById('id_textbox-'+id)
    let textbox2 = document.getElementById('token_textbox-'+id)
    let textbox3 = document.getElementById('email_textbox-'+id)

    if(textbox2.defaultValue == '' || textbox3.defaultValue == ''){
        document.getElementById('update-'+id).style.display = 'none'
        document.getElementById('delete-'+id).style.display = 'block'
    }else{
        document.getElementById('delete-'+id).style.display = 'none'
        document.getElementById('update-'+id).style.display = 'flex'
    }

    if(textbox1.defaultValue == textbox1.value && textbox2.defaultValue == textbox2.value && textbox3.defaultValue == textbox3.value){
        document.getElementById('update-'+id).style.display = 'none'
        document.getElementById('delete-'+id).style.display = 'block'
    }
}

//update record
function handleUpdate(id) {
    let token = document.getElementById('token_textbox-'+id).value
    let email = document.getElementById('email_textbox-'+id).value
    let file = document.getElementById('credentials_textbox-'+id).files[0]

    if(token != '' && email != '' && validateEmail(email) == true){
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(file);

        function onReaderLoad(event){
            
                fetch(IndexServerUrl+"/api/updateAccess", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        token: token,
                        email: email,
                        credentials: event.target.result
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    handleNotification(data.status, data.message)
            
                    if(data.status == 'success'){
                        document.getElementById('token_textbox-'+id).defaultValue = document.getElementById('token_textbox-'+id).value
                        document.getElementById('email_textbox-'+id).defaultValue = document.getElementById('email_textbox-'+id).value
                        document.getElementById('id_textbox-'+id).defaultValue = document.getElementById('id_textbox-'+id).value
        
                        document.getElementById('update-'+id).style.display = 'none'
                        document.getElementById('delete-'+id).style.display = 'block'
                    }
                })
        }
    }
    else if (token == '' || email == ''){
        handleNotification('failed', 'All fields are required')
     }
     else if(token != '' && email != '' && validateEmail(email) == false){
        handleNotification('failed', 'Email is not valid')
     }
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

function dataExist() {
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

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//add record
function handleInsert(id) {
    let token = document.getElementById('token_textbox-'+id).value
    let email = document.getElementById('email_textbox-'+id).value
    let file = document.getElementById('credentials_textbox-'+id).files[0]
    let label = document.getElementById('credentials_label-'+id).textContent
    
    if(token != '' && email != '' && validateEmail(email) == true && label != 'Select file'){
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(file);

        function onReaderLoad(event){
            
                fetch(IndexServerUrl+"/api/allowAccess", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    token: token,
                    email: email,
                    credentials: event.target.result
                }),
            })
            .then(response => response.json())
            .then(data => {
                handleNotification(data.status, data.message)
    
                if(data.status == 'success'){
                    document.getElementById('token_textbox-'+id).defaultValue = document.getElementById('token_textbox-'+id).value
                    document.getElementById('id_textbox-'+id).defaultValue = document.getElementById('id_textbox-'+id).value
                    document.getElementById('email_textbox-'+id).defaultValue = document.getElementById('email_textbox-'+id).value
        
                    document.getElementById('insert-'+id).remove()
                    document.getElementById('update-'+id).classList.remove('chatbot_admin__insert-new')
                    document.getElementById('delete-'+id).classList.remove('chatbot_admin__insert-new')
                    document.getElementById('update-'+id).classList.add('chatbot_admin__button')
                    document.getElementById('delete-'+id).classList.add('chatbot_admin__button')
                    document.getElementById('chatbot_admin_new-data-'+id).classList.remove('chatbot_admin__new-data')
                }
            })
        }
    }
    else if (token == '' || email == '' || label == 'Select file'){
            handleNotification('failed', 'All fields are required')
    }
    else if(token != '' && email != '' && validateEmail(email) == false && label != 'Select file'){
            handleNotification('failed', 'Email is not valid')
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

//handle file input
function handleFileInput(id) {
    let fileInput = document.getElementById('credentials_textbox-'+id);
    fileInput.addEventListener('change', (e) => {

        let [file] = e.target.files;

         var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);

        function onReaderLoad(event){
            let jsonFile = JSON.parse(event.target.result)

            if(jsonFile.name != undefined && jsonFile.name != '' && jsonFile.apiEndPoint != undefined && jsonFile.apiEndPoint != '' && jsonFile.agent_Id != undefined && jsonFile.agent_Id != ''){
                fileInput.files = e.target.files
                let { name: fileName } = file;
        
                document.getElementById('credentials_label-'+id).style.backgroundColor = '#7873f5'
                document.getElementById('credentials_label-'+id).textContent = fileName;
        
                document.getElementById('delete-'+id).style.display = 'none'
                document.getElementById('update-'+id).style.display = 'flex'
            }
            else if(jsonFile.name == undefined || jsonFile.name == ''){
                handleNotification('failed', 'name is required in json file')
            }
            else if(jsonFile.apiEndPoint == undefined || jsonFile.apiEndPoint == ''){
                handleNotification('failed', 'apiEndPoint is required in json file')
            }
            else if(jsonFile.agent_Id == undefined || jsonFile.agent_Id == ''){
                handleNotification('failed', 'agent_Id is required in json file')
            }
        }
    });
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
                <input id="email_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="email" class="chatbot_admin__data"/>
                <input id="token_textbox-${data.message}" oninput="handleTextInput(${data.message})" type="text" class="chatbot_admin__data"/>
                <div class="chatbot_admin__data">
                    <input id="credentials_textbox-${data.message}" oninput="handleTextInput(${data.message})" onclick="handleFileInput(${data.message})" type="file" class="chatbot_admin__file-input"/>
                    <label for="credentials_textbox-${data.message}" id="credentials_label-${data.message}">Select file</label>    
                </div>
                <div class="chatbot_admin__data chatbot_admin__new-data" id="chatbot_admin_new-data-${data.message}">
                    <button id="insert-${data.message}" onclick="handleInsert(${data.message})" class="chatbot_admin__insert-button chatbot_admin__insert-new">Upload</button>
                    <button id="update-${data.message}" onclick="handleUpdate(${data.message})" class="chatbot_admin__update-button chatbot_admin__insert-new">Update</button>
                    <button id="delete-${data.message}" onclick="handleDelete(${data.message})" class="chatbot_admin__delete-button chatbot_admin__insert-new">Delete</button>
                </div>
            </div>`
        }

        document.getElementById('email_textbox-'+data.message).select();
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
                    <input id="email_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="email" class="chatbot_admin__data" value="${subdata.email}"/>
                    <input id="token_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" type="text" class="chatbot_admin__data" value="${subdata.token}"/>
                    <div class="chatbot_admin__data">
                        <input id="credentials_textbox-${subdata.id}" oninput="handleTextInput(${subdata.id})" onclick="handleFileInput(${subdata.id})" type="file" class="chatbot_admin__file-input"/>
                        <label for="credentials_textbox-${subdata.id}" id="credentials_label-${subdata.id}" style="background-color: #7873f5;">${subdata.credentials.name}</label>    
                    </div>
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