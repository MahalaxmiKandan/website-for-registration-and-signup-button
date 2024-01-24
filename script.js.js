function frmid(id){
    return document.getElementById(id);
}

function signup(){
    var name = frmid("su-name").value;
    var contact = frmid("su-contact").value;
    var email = frmid("su-email").value;
    var password = frmid("su-password").value;
    var re_password = frmid("su-re_password").value;

    if(name!="" && contact!="" && email!="" && password===re_password){
        $.ajax({
            type: 'POST',  
            url: './php/main.php', 
            data: { fuc:"signup", name:name, contact:contact, email:email, password:password },
            success: function(response) {
                if(response=="registered"){
                    window.localStorage.setItem("signin", true);
                    window.localStorage.setItem("email", email);
                    window.location.href="./profile.html";
                }
                else if(response=="exists") {
                    alert("User with this email already Registered");
                }
            }
        });
    }else{
        alert("Provide required details");
    }
}

function signin(){
    var email = frmid("si-email").value;
    var password = frmid("si-password").value;
    
    if(email!="" && password!=""){
        $.ajax({
            type: 'POST',  
            url: './php/main.php',
            data: { fuc:"signin", email:email, password:password },
            success: function(response) {
                if(response=="found"){
                    window.localStorage.setItem("signin", true);
                    window.localStorage.setItem("email", email);
                    window.location.href="./profile.html";
                }
                else if(response=="notfound") {
                    alert("user not found");
                    window.localStorage.setItem("signin", false);
                }
            }
        });
    }else{
        alert("Provide required details");
    }
}


function signout(){
    window.localStorage.clear();
    window.location.href="./index.html";
}

function isVerified(){
    $('#verified').css("display","none");
}

function fetch_profile(){
    isVerified();
    if(window.localStorage.getItem("signin")){
        $.ajax({
            type: 'POST',  
            url: './php/main.php',
            data: { fuc:"profile", email:window.localStorage.getItem("email") },
            success: function(response) {
                data=response.split("&");
                frmid("name").value=data[0];
                frmid("contact").value=data[1];
                frmid("email").value=data[2];
                frmid("password").value=data[3];
            }
        });
    }else{
        window.location.href = "./index.html";
    }
}

function update(){
    var name = frmid("name").value;
    var contact = frmid("contact").value;
    var email = frmid("email").value;
    var password = frmid("password").value;
    
    if(name!="" && contact!="" && email!="" && password!=""){
        $.ajax({
            type: 'POST',  
            url: './php/main.php', 
            data: { fuc:"update", name:name, contact:contact, email:window.localStorage.getItem("email"), email_c:email, password:password },
            success: function(response) {
                alert(response);
                if(response==="updated"){
                    window.localStorage.setItem("signin", true);
                    window.localStorage.setItem("email", email);
                    window.location.href="./profile.html";
                }
                else{
                    alert(response);
                }
            }
        });
    }else{
        alert("Provide required details")
    }
}





emailjs.init("qeM2khzdeVpPjWCJG");

function sendVerificationLink() {
    var email = frmid("email").value.trim();
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    const verificationCode = generateVerificationCode();
    const verificationLink = `${window.location.href}?code=${verificationCode}?username=${username}`;

    const templateParams = {
        to_email: email,
        verification_link: verificationLink
    };
    emailjs.send("service_qwljrof","template_oz0gjwq", templateParams)
        .then(() => {
            alert('Verification link sent, Check your email. Valid for 2 minutes');
            var timer = setTimeout(function() {
                localStorage.clear();
            }, 120000);
        }, (error) => {
            console.error('Error sending email:', error);
            alert('Error sending verification link. Please try again.');
        });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateVerificationCode() {
    const length = 32;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#~%*()-_=+[]{}|;:.';
    let verificationCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters.charAt(randomIndex);
    }
    localStorage.setItem("verificationCode",verificationCode);
    return verificationCode;
}

