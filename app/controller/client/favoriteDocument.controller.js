createDocuments();

let email;
async function createDocuments(){
    await ZOHO.CREATOR.init().then(async function() {
        //get User Email
        const initparams = ZOHO.CREATOR.UTIL.getInitParams();

        email = initparams.loginUser;
        // End get User Email

        //Get Document for Mentee Page
        const configGetDocument = { 
            appName : "database-books-app",
            reportName : "All_Documents",
            criteria : `(Deleted == \"false\" && Status == \"Active\" && Intellectual_Property_Agreement == \"true\")`,
        }

        await ZOHO.CREATOR.API.getAllRecords(configGetDocument).then(async function(response){
            const recordDocuments = response.data;
            if (recordDocuments.length > 0) {
                for(let i = 0; i < recordDocuments.length; i++) {
                    let documentRecord = recordDocuments[i];

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

                    let heart="";
                    const configCountFavoriteDocument = {
                        appName: "database-books-app",
                        reportName: "All_Favorite_Documents",
                        criteria: "(Document_ID == \""+ documentRecord.Document_ID + "\" && Email == \""+ email + "\")"
                    }
            
                    await ZOHO.CREATOR.API.getRecordCount(configCountFavoriteDocument).then(function(response) {
                        console.log(response.result)
                        if(response.result.records_count > 0){
                            heart = "❤️";
                            documentBlock.innerHTML = `
                            <a href="https://anlnhoubookapp.zohocreatorportal.com/#Page:Detail_Document?docID=${documentRecord.Document_ID}"  target="_blank">
                                <div class=inner-document id=${documentRecord.Document_ID}>
                                    <div class="inner-title">${documentRecord.Title}</div>
                                    <div class ="inner-author">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7.5C10.6569 7.5 12 6.15685 12 4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5C6 6.15685 7.34315 7.5 9 7.5Z" stroke="black" stroke-width="1.5"/>
                                        <path d="M14.9985 13.5C15 13.377 15 13.2517 15 13.125C15 11.2613 12.3135 9.75 9 9.75C5.6865 9.75 3 11.2613 3 13.125C3 14.9887 3 16.5 9 16.5C10.6732 16.5 11.88 16.3822 12.75 16.1722" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>        
                                        ${documentRecord.Author}
                                    </div>
                                    <div class="inner-date-create">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_321_1457)">
                                        <path d="M9.99996 1.66699C14.6025 1.66699 18.3333 5.39783 18.3333 10.0003C18.3333 14.6028 14.6025 18.3337 9.99996 18.3337C5.39746 18.3337 1.66663 14.6028 1.66663 10.0003C1.66663 5.39783 5.39746 1.66699 9.99996 1.66699ZM9.99996 3.33366C8.23185 3.33366 6.53616 4.03604 5.28591 5.28628C4.03567 6.53652 3.33329 8.23222 3.33329 10.0003C3.33329 11.7684 4.03567 13.4641 5.28591 14.7144C6.53616 15.9646 8.23185 16.667 9.99996 16.667C11.7681 16.667 13.4638 15.9646 14.714 14.7144C15.9642 13.4641 16.6666 11.7684 16.6666 10.0003C16.6666 8.23222 15.9642 6.53652 14.714 5.28628C13.4638 4.03604 11.7681 3.33366 9.99996 3.33366ZM9.99996 5.00033C10.2041 5.00035 10.4011 5.07529 10.5536 5.21092C10.7061 5.34655 10.8036 5.53345 10.8275 5.73616L10.8333 5.83366V9.65533L13.0891 11.9112C13.2386 12.0611 13.3254 12.2624 13.3318 12.474C13.3383 12.6856 13.2639 12.8918 13.1239 13.0506C12.9839 13.2094 12.7887 13.3089 12.5779 13.329C12.3671 13.3491 12.1566 13.2882 11.9891 13.1587L11.9108 13.0895L9.41079 10.5895C9.28128 10.4599 9.19809 10.2912 9.17413 10.1095L9.16663 10.0003V5.83366C9.16663 5.61264 9.25442 5.40068 9.4107 5.2444C9.56698 5.08812 9.77894 5.00033 9.99996 5.00033Z" fill="black"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_321_1457">
                                        <rect width="20" height="20" fill="white"/>
                                        </clipPath>
                                        </defs>
                                        </svg>
                                        ${documentRecord.Date_Created}
                                    </div>
                                    <div class="inner-status">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_321_1466)">
                                        <path d="M7.536 8.657L10.364 5.827C10.457 5.73416 10.5673 5.66053 10.6888 5.61034C10.8102 5.56014 10.9403 5.53435 11.0717 5.53444C11.2031 5.53454 11.3332 5.56051 11.4545 5.61088C11.5759 5.66125 11.6862 5.73502 11.779 5.828C11.8718 5.92098 11.9455 6.03133 11.9957 6.15276C12.0459 6.27419 12.0716 6.40431 12.0716 6.53571C12.0715 6.6671 12.0455 6.79719 11.9951 6.91855C11.9448 7.03991 11.871 7.15016 11.778 7.243L8.243 10.778C8.15019 10.871 8.03996 10.9449 7.91859 10.9953C7.79723 11.0457 7.66712 11.0717 7.53571 11.0718C7.40429 11.0719 7.27415 11.0461 7.15271 10.9958C7.03128 10.9456 6.92094 10.8719 6.828 10.779L4.708 8.659C4.61243 8.56682 4.53617 8.45653 4.48368 8.33456C4.43118 8.2126 4.4035 8.0814 4.40226 7.94862C4.40101 7.81584 4.42622 7.68415 4.47641 7.56122C4.52661 7.43829 4.60078 7.32658 4.69461 7.23262C4.78843 7.13867 4.90003 7.06433 5.02289 7.01397C5.14575 6.9636 5.27741 6.9382 5.41019 6.93926C5.54297 6.94032 5.67421 6.96781 5.79625 7.02013C5.91829 7.07246 6.02869 7.14856 6.121 7.244L7.536 8.657ZM8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16ZM8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14Z" fill="black"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_321_1466">
                                        <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                        </defs>
                                        </svg>
                                        Trạng thái: Đã duyệt
                                    </div>
                                </div>
                            </a>
                                <button onclick="likeDocument(this)" class="inner-heart" email = ${email} id=${documentRecord.Document_ID}>
                                        ${heart}
                                </button>
                                <a href="${filelUrl}" class="inner-download">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 17V7M9 17L13 13M9 17L5 13M1 1H17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                                    Tải Xuống
                                </a>
                            `;
                            // End Insert Document bock
                            const section_2_document = document.querySelector('.section-2-document');
                            section_2_document.querySelector('.container').appendChild(documentBlock);
                        }
                    });
                }
            }
        });
    });
}

let pageNumber;
const pageSize = 5;
ZOHO.CREATOR.init().then(async function() {
    const configCountDocuments = { 
        appName : "database-books-app",
        reportName : "All_Favorite_Documents",
        criteria : `(Email == \"${email}\")`,
    }

    let cntRecord;
    await ZOHO.CREATOR.API.getRecordCount(configCountDocuments).then(function(response) {
        cntRecord = response.result.records_count;
        const pagination = document.createElement('div');
        pagination.classList.add('pagination');

        pagination.innerHTML = `<span class="page-item" data-page="1">Trang Đầu</span>`;

        for(let i = 1; i <= Math.ceil(cntRecord/pageSize); i++){
            pagination.innerHTML += `<span class="page-item" data-page="${i}">${i}</span>`;
        }

        pagination.innerHTML += `<span class="page-item" data-page="${Math.ceil(cntRecord/pageSize)}">Trang Cuối</span>`
        
        const boxPagination = document.querySelector('.section-pagination');
        boxPagination.appendChild(pagination);

        const pageItems = document.querySelectorAll('.pagination .page-item');
        pageItems.forEach(item => {
            item.addEventListener('click', async function() {
                pageNumber = parseInt(this.getAttribute('data-page'));

                // Cập nhật trạng thái active
                pageItems.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                
                const section_2_document = document.querySelector('.section-2-document');
                section_2_document.querySelector('.container').innerHTML = "";
                await createDocuments();
                // Thực hiện các hành động khác như tải dữ liệu của trang mới
            });
        });
    });
});

async function likeDocument(buttonElement){
    await ZOHO.CREATOR.init().then(async function() {
        const heart = buttonElement.textContent;
        if (heart === "🤍") {
            buttonElement.textContent = "❤️";
            
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
                
            await ZOHO.CREATOR.API.addRecord(configAddFavoriteDocument).then(function(response){});
            //End Add record to Favorite Documents

        } else {
            buttonElement.textContent = "🤍";
                
            // Delete Record in Favorite Documents
            const configDeleteFavoriteDocument = {
                appName: "database-books-app",
                reportName: "All_Favorite_Documents",
                criteria: "(Email == \"" + buttonElement.getAttribute('email') + "\" && Document_ID == \"" + buttonElement.getAttribute('id') + "\" )"

            };

            console.log(configDeleteFavoriteDocument);
        
            await ZOHO.CREATOR.API.deleteRecord(configDeleteFavoriteDocument).then(function(response) { console.log(response)});
            //End Delete Record in Favorite Documents
        }
    });
}