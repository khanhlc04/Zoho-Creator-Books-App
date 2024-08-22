ZOHO.CREATOR.init().then(async function() {
    const configPendingDocuments = { 
        appName : "database-books-app",
        reportName : "All_Documents",
        criteria: "(Status == \"Pending\")",
    }

    await ZOHO.CREATOR.API.getRecordCount(configPendingDocuments).then(function (response) {
        document.querySelector('#pending-documents').textContent = response.result.records_count;
    });

    const configActiveDocument = { 
        appName : "database-books-app",
        reportName : "All_Documents",
        criteria: "(Status == \"Active\")",
    }

    await ZOHO.CREATOR.API.getRecordCount(configActiveDocument).then(function (response) {
        document.querySelector('#active-documents').textContent = response.result.records_count;
    });

    const configActiveAccounts = { 
        appName : "database-books-app",
        reportName : "All_Accounts",
        criteria: "(Status == \"Active\")",
    }

    await ZOHO.CREATOR.API.getRecordCount(configActiveAccounts).then(function (response) {
        document.querySelector('#active-accounts').textContent = response.result.records_count;
    });

    const configInactiveAccounts = { 
        appName : "database-books-app",
        reportName : "All_Accounts",
        criteria: "(Status == \"Inactive\")",
    }

    await ZOHO.CREATOR.API.getRecordCount(configInactiveAccounts).then(function (response) {
        document.querySelector('#inactive-accounts').textContent = response.result.records_count;
    });
});