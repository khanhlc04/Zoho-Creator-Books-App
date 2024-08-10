createDocuments();

document.querySelector('.search-bar').addEventListener('keypress', async function(event) {
    if (event.key === 'Enter' || event.key === 'Go') {
        event.preventDefault();
        localStorage.setItem('keyword', this.value);
        console.log(localStorage.getItem('keyword'));
        const section_2_document = document.querySelector('.section-2-document');
        section_2_document.querySelector('.container').innerHTML = "";
        await createDocuments();
        localStorage.removeItem('keyword');
    }
});

async function createDocuments(){
    await ZOHO.CREATOR.init().then(async function() {
        //get User Email
        const initparams = ZOHO.CREATOR.UTIL.getInitParams();

        const email = initparams.loginUser;
        // End get User Email

        const configGetFavoriteDocument = {
            appName : "database-books-app",
            reportName : "All_Favorite_Documents",
            criteria : '(Email == \"' + email + '\")',
        }

        await ZOHO.CREATOR.API.getAllRecords(configGetFavoriteDocument).then(async function(response){
            const recordFavoriteDocuments = response.data;
            if(recordFavoriteDocuments.length > 0){
                for(let i = 0; i < recordFavoriteDocuments.length; i++){
                    let favoriteDocumentRecord = recordFavoriteDocuments[i];

                    //Get Document for Mentee Page
                    const configGetDocument = { 
                        appName : "database-books-app",
                        reportName : "All_Documents",
                        criteria : `(Deleted == \"false\" && Status == \"Active\" && Intellectual_Property_Agreement == \"true\" && Document_ID == \"${favoriteDocumentRecord.Document_ID}\")`,
                    }

                    await ZOHO.CREATOR.API.getAllRecords(configGetDocument).then(async function(response){
                        const recordDocuments = response.data;
                        if (recordDocuments.length > 0) {
                            for(let i = 0; i < recordDocuments.length; i++) {
                                let documentRecord = recordDocuments[i];
                                let regex = new RegExp(localStorage.getItem('keyword'), 'i');
                                console.log(regex);
                                // URL của tệp tải xuống
                                if(regex.test(documentRecord.Title) || regex == "/null/i"){
                                    const originalUrl = documentRecord.File_upload;

                                    // Bước 1: Tách URL thành các phần dựa trên dấu '/'
                                    const parts = originalUrl.split('/');

                                    // Bước 2: Lấy phần mong muốn từ các phần đã tách và thay đổi 'download' thành 'download-file'
                                    const desiredPart = parts.slice(6).join('/').replace('download', 'download-file');
                                    // Bước 3: Thay thế 'filepath=' với 'filepath=/' và mã hóa URL
                                    const encodedFilePath = encodeURIComponent(desiredPart.split('filepath=')[1]);
                                    const modifiedDesiredPart = desiredPart.replace(`filepath=${desiredPart.split('filepath=')[1]}`, `filepath=/${encodedFilePath}`);

                                    // Bước 4: Tạo URL hoàn chỉnh
                                    const baseUrl = "https://anlnhoubookapp.zohocreatorportal.com/anln_hou/database-books-app/report/";
                                    const filelUrl = `${baseUrl}${modifiedDesiredPart}&mediaType=3&digestValue=eyJkaWdlc3RWYWx1ZSI6MTcyMjk1Njk4MjgyMywibGFuZ3VhZ2UiOiJ2aSJ9`;

                                    //insert Document block
                                    const documentBlock = document.createElement('div');
                                    documentBlock.className = 'inner-wrap';
                                    documentBlock.setAttribute('id', documentRecord.Document_ID)

                                    documentBlock.innerHTML = `
                                        <div class="inner-title">${documentRecord.Title}</div>
                                        <div class ="inner-author">
                                            <img src="../../../public/images/solar_user-broken.svg">         
                                            ${documentRecord.Author}
                                        </div>
                                        <div class="inner-date-create">
                                            <img src="../../../public/images/mingcute_time-line.svg">
                                            ${documentRecord.Date_Created}
                                        </div>
                                        <div class="inner-status">
                                            <img src="../../../public/images/pajamas_status-closed.svg">
                                            Trạng thái: Đã duyệt
                                        </div>
                                        <button onclick="likeDocument(this)" class="inner-heart" email = ${email} id=${documentRecord.Document_ID}>
                                            <img src="../../../public/images/pajamas_status-closed.svg">
                                        </button>
                                        <a href="${filelUrl}" class="inner-download">
                                            <img src="../../../public/images/Vector(2).svg">
                                            Tải Xuống
                                        </a>
                                    `;
                                    // End Insert Document bock
                                    const section_2_document = document.querySelector('.section-2-document');
                                    section_2_document.querySelector('.container').appendChild(documentBlock);
                                }
                            }
                        }
                    });
                }
            }
        });
    });
}

function likeDocument(buttonElement){
    const src = buttonElement.querySelector('img').src;
    if (src.includes("solar_heart-broken.svg")) {
        buttonElement.querySelector('img').src = "../../../public/images/pajamas_status-closed.svg";
        
        //Add record to Favorite Documents
        const formFavoriteDocumentData = {
            "data" : {
                Email: buttonElement.getAttribute('email'),
                Document_ID: buttonElement.getAttribute('id')
            }
        }

        const configAddFavoriteDocument = {
            appName: "database-books-app",
            formName: "Favorite_Document",
            data: formFavoriteDocumentData
        };
            
        ZOHO.CREATOR.API.addRecord(configAddFavoriteDocument).then(function(response){});
        //End Add record to Favorite Documents

    } else {
        buttonElement.querySelector('img').src = "../../../public/images/solar_heart-broken.svg";
            
        // Delete Record in Favorite Documents
        const configDeleteFavoriteDocument = {
            appName: "database-books-app",
            reportName: "All_Favorite_Documents",
            criteria: "(Email == \"" + buttonElement.getAttribute('email') + "\" && Document_ID == \"" + buttonElement.getAttribute('id') + "\" )"

        };
    
        ZOHO.CREATOR.API.deleteRecord(configDeleteFavoriteDocument).then(function(response) { });
        //End Delete Record in Favorite Documents
    }
}