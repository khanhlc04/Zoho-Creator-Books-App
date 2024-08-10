//Get Account Info for MyAccount
class Account {
    constructor(accountId, username, email, phone, cccd, status) {
        this.accountId = accountId;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.cccd = cccd;
        this.status = status;
    }
}

//Get UserLogin Info
let idRecord;
ZOHO.CREATOR.init().then(async function() {
    const initparams = ZOHO.CREATOR.UTIL.getInitParams();

    const email = initparams.loginUser;
    
    const configGet = { 
        appName : "database-books-app",
        reportName : "All_Accounts", 
        criteria : "(Email == \"" + email + "\")",
    }

    let account;
    await ZOHO.CREATOR.API.getAllRecords(configGet).then(function(response){
        const recordArr = response.data;
        if (recordArr.length > 0) {
            const userRecord = recordArr[0];
            idRecord = userRecord.ID;
            account = new Account(
                userRecord.Account_ID,
                userRecord.User_Name,
                userRecord.Email,
                userRecord.Phone_Number,
                userRecord.CCCD,
                userRecord.Status
            )
        }
    });

    document.querySelector('input[name="username"]').value = account.username || '';
    document.querySelector('input[name="email"]').value = account.email || '';
    document.querySelector('input[name="phone"]').value = account.phone || '';
    document.querySelector('input[name="cccd"]').value = account.cccd || '';
    document.querySelector(`input[name="status"][value="${account.status || 'Active'}"]`).checked = true;
});
//End Get Account Info for MyAccount

//Update Click
function updateClick(){
    const formDataUpdate = {
        "data" : {
            User_Name: document.querySelector('input[name="username"]').value,
            Email: document.querySelector('input[name="email"]').value,
            Phone_Number: document.querySelector('input[name="phone"]').value,
            CCCD: document.querySelector('input[name="cccd"]').value,
            Status: document.querySelector('input[name="status"]:checked').value
        }
    }

    ZOHO.CREATOR.init().then(async function() {            
        const configUpdate = {
            appName: "database-books-app",
            reportName: "All_Accounts",
            id: idRecord,  
            data: formDataUpdate
        };
        
        await ZOHO.CREATOR.API.updateRecord(configUpdate).then(function(response) { 
            if (response.code == 3000) {
                console.log("Record updated successfully");
            } 
        });
    });
}
//End Update Click

// Delete Click
function deleteClick(){
    const formDataDelete = {
        "data" : {
            "Deleted": "true"
        }
    }
  
    ZOHO.CREATOR.init().then(async function() {            
        const configDelete = {
            appName: "database-books-app",
            reportName: "All_Accounts",
            id: idRecord,  
            data: formDataDelete
        };
        
        await ZOHO.CREATOR.API.updateRecord(configDelete).then(function(response) { 
            if (response.code == 3000) {
                console.log("Record updated successfully");
            } 
        });
    });
    location.reload();
}
//End Delete Click