// Model Account
class Account {
    constructor(accountId, avatar, username, email, phone, cccd, status) {
        this.accountId = accountId;
        this.avatar = avatar;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.cccd = cccd;
        this.status = status;
    }
}
//End Model Account

function formatDate(timestamp) {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; // Lấy tháng và chuyển thành dạng viết tắt
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

//Get UserLogin Info
let id;
let idRecord;
let email;
let documentRecord;
let accountMentee;
const ratingNumbers = [];
let star_1_length = 0;
let star_2_length = 0;
let star_3_length = 0;
let star_4_length = 0;
let star_5_length = 0;
let formRating;

ZOHO.CREATOR.init().then(async function() {
    const initparams = ZOHO.CREATOR.UTIL.getInitParams();

    email = initparams.loginUser;
    
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
                userRecord.Avatar,
                userRecord.User_Name,
                userRecord.Email,
                userRecord.Phone_Number,
                userRecord.CCCD,
                userRecord.Status
            )
        }
    });

    const avatarMentee = document.querySelector('.section-7-detail');
    
    if(account.avatar){
        await ZOHO.CREATOR.UTIL.setImageData(avatarMentee.querySelector('img'),account.avatar);
    }

    avatarMentee.querySelector('.inner-name').textContent = account.username || '';
});
//End Get Account Info for MyAccount


ZOHO.CREATOR.init().then(async function() {
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();

    id = queryParams.docID;

    let heart="";
    const configCountFavoriteDocument = {
        appName: "database-books-app",
        reportName: "All_Favorite_Documents",
        criteria: "(Document_ID == \""+ id + "\" && Email == \""+ email + "\")"
    }

    await ZOHO.CREATOR.API.getRecordCount(configCountFavoriteDocument).then(function(response) {
        console.log(response.result)
        const downloadButton = document.querySelector('.section-2-detail');
        if(response.result.records_count > 0){
            heart = "❤️";
            downloadButton.querySelector('.inner-heart').textContent = heart;
        } else{
            heart = "🤍";
            downloadButton.querySelector('.inner-heart').textContent = heart;
        }
    });
    
    const configGetDocumentByID = { 
      appName : "database-books-app",
      reportName : "All_Documents",
      criteria : '(Document_ID == \"' + id + '\")',
    }

    await ZOHO.CREATOR.API.getAllRecords(configGetDocumentByID).then(async function(response){
        const recordArr = response.data;
        if (recordArr.length > 0) {
            documentRecord = recordArr[0];

            const banner = document.querySelector('.section-1-detail');
            const url = documentRecord.Cover_Image;
            await ZOHO.CREATOR.UTIL.setImageData(banner.querySelector('img'),url);

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
            const fileUrl = `${baseUrl}${modifiedDesiredPart}&mediaType=3&digestValue=eyJkaWdlc3RWYWx1ZSI6MTcyMjk1Njk4MjgyMywibGFuZ3VhZ2UiOiJ2aSJ9`;

            const downloadButton = document.querySelector('.section-2-detail');
            const linkDownloadDocument = document.createElement('a');
            linkDownloadDocument.classList.add('inner-download')
            linkDownloadDocument.innerHTML = `
                <a href=${fileUrl} class="inner-dowload">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20V10M12 20L16 16M12 20L8 16M4 4H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Tải Xuống
                </a>
            `;
            downloadButton.querySelector('.inner-wrap').appendChild(linkDownloadDocument);

            document.querySelector('.inner-title').textContent = documentRecord.Title;
            document.querySelector('.author').textContent = "Author: " + documentRecord.Author;
            document.querySelector('.date-created').textContent = "Date Created: " + documentRecord.Date_Created;
            document.querySelector('.date-publication').textContent = "Date Publication: " + documentRecord.Date_Publication;
            document.querySelector('.description').textContent = "Description: " + documentRecord.Description;
            document.querySelector('.file-format').textContent = "File Format: " + documentRecord.File_Format;
            document.querySelector('.copyright').textContent = "Copyright: " + documentRecord.Copyright;
            document.querySelector('.category').textContent = "Category: " + documentRecord.Category;

            if(documentRecord.Cost == ""){
                document.querySelector('.cost').textContent = "Cost: Free";
            }
            else{
                document.querySelector('.cost').textContent = "Cost: " +  documentRecord.Cost;
            }

            const configGet = { 
                appName : "database-books-app",
                reportName : "All_Accounts", 
                criteria : "(Account_ID == \"" + documentRecord.Mentor_ID + "\")",
            }
        
            let account;
            await ZOHO.CREATOR.API.getAllRecords(configGet).then(function(response){
                const recordAccounts = response.data;
                if (recordAccounts.length > 0) {
                    const userRecord = recordAccounts[0];
                    idRecord = userRecord.ID;
                    account = new Account(
                        userRecord.Account_ID,
                        userRecord.Avatar,
                        userRecord.User_Name,
                        userRecord.Email,
                        userRecord.Phone_Number,
                        userRecord.CCCD,
                        userRecord.Status
                    )
                }
            });
        
            const mentorInfo = document.querySelector('.section-4-detail');
            const linkDetailMentor = mentorInfo.querySelector('a');
            linkDetailMentor.href = linkDetailMentor.href + `?email=${account.email}`;

            if(account.email== email){
                document.querySelector('.section-7-detail').style.display = 'none';
            }

            console.log(linkDetailMentor)
            if(account.avatar){
                const avatarMentor = mentorInfo.querySelector('img');
                await ZOHO.CREATOR.UTIL.setImageData(avatarMentor, account.avatar);
            }

            mentorInfo.querySelector('.inner-name').textContent = account.username || '';
            mentorInfo.querySelector('.inner-email').textContent = account.email || '';

            formRating = document.querySelector('.section-5-detail');
            const configCountComments = {
                appName: "database-books-app",
                reportName: "All_Comments",
                criteria: "(ID_Object == \""+ documentRecord.Document_ID + "\" && Object_Type == \""+ "Documents" + "\")" 
            }

            await ZOHO.CREATOR.API.getAllRecords(configCountComments).then(async function(response) {
                const commentArr = response.data;
                if(commentArr.length > 0){
                    for(let i = 0; i < commentArr.length; i++){
                        const configGetMenteeInfo = { 
                            appName : "database-books-app",
                            reportName : "All_Accounts", 
                            criteria : `(Email == "${commentArr[i].Email}")`,
                        }
                    
                        await ZOHO.CREATOR.API.getAllRecords(configGetMenteeInfo).then(function(response){
                            const recordArr = response.data;
                            if (recordArr.length > 0) {
                                const userRecord = recordArr[0];
                                accountMentee = new Account(
                                    userRecord.Account_ID,
                                    userRecord.Avatar,
                                    userRecord.User_Name,
                                    userRecord.Email,
                                    userRecord.Phone_Number,
                                    userRecord.CCCD,
                                    userRecord.Status
                                )
                            }
                        });

                        const menteeComment = document.createElement('div');
                        menteeComment.classList.add('inner-wrap');
                        if(parseInt(commentArr[i].Star) > 0){
                            menteeComment.innerHTML = `
                                <img class="inner-avatar" src="https://sme.hust.edu.vn/wp-content/uploads/2022/02/Avatar-Facebook-trang.jpg">
                                <div class ="inner-comment">
                                    <div class="inner-stars">
                                        <input type="radio" id="star5" name="rating" value="5">
                                        <label for="star5" title="5 star">☆</label>
                                        <input type="radio" id="star4" name="rating" value="4">
                                        <label for="star4" title="4 star">☆</label>
                                        <input type="radio" id="star3" name="rating" value="3">
                                        <label for="star3" title="3 star">☆</label>
                                        <input type="radio" id="star2" name="rating" value="2">
                                        <label for="star2" title="2 star">☆</label>
                                        <input type="radio" id="star1" name="rating" value="1">
                                        <label for="star1" title="1 star">☆</label>
                                    </div>
                                    <b class="inner-name">${accountMentee.username}</b>
                                    ${commentArr[i].Comment}
                                </div>
                            `;
                            }
                        else{
                            menteeComment.innerHTML = `
                                <img class="inner-avatar" src="https://sme.hust.edu.vn/wp-content/uploads/2022/02/Avatar-Facebook-trang.jpg">
                                <div class ="inner-comment">
                                    <div class="inner-stars"></div>
                                    <b class="inner-name">${accountMentee.username}</b>
                                    ${commentArr[i].Comment}
                                </div>
                            `;
                        }

                        const menteeCommentSection = document.querySelector('.section-8-detail');
                        menteeCommentSection.querySelector('.container').appendChild(menteeComment);
                        const avatarMentee = menteeComment.querySelector('.inner-avatar');
                        const urlAvatarMentee = accountMentee.avatar;
                        console.log(urlAvatarMentee)
                        await ZOHO.CREATOR.UTIL.setImageData(avatarMentee ,urlAvatarMentee);

                        switch(parseInt(commentArr[i].Star)){
                            case 1:{
                                star_1_length++;
                                ratingNumbers.push(parseInt(commentArr[i].Star));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                break;
                            } 
                            case 2:{
                                star_2_length++;
                                ratingNumbers.push(parseInt(commentArr[i].Star));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                break;
                            }
                            case 3:{
                                star_3_length++;
                                ratingNumbers.push(parseInt(commentArr[i].Star));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "3 star"]`).style.color = "#f7d106";
                                break;
                            }
                            case 4:{
                                star_4_length++;
                                ratingNumbers.push(parseInt(commentArr[i].Star));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "3 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "4 star"]`).style.color = "#f7d106";
                                break;
                            }
                            case 5:{
                                star_5_length++;
                                ratingNumbers.push(parseInt(commentArr[i].Star));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "3 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "4 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "5 star"]`).style.color = "#f7d106";
                                break;
                            }
                            default:{
                                break;
                            }
                        }
                    }

                    const total = ratingNumbers.reduce((acc, cur) => acc + cur, 0);
                    formRating.querySelector('.inner-average-rating').textContent = (total / ratingNumbers.length).toFixed(1).toString();

                    const totalStarLength = star_1_length + star_2_length + star_3_length + star_4_length + star_5_length;

                    document.querySelector('#star-1').style.width = `${(star_1_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-2').style.width = `${(star_2_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-3').style.width = `${(star_3_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-4').style.width = `${(star_4_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-5').style.width = `${(star_5_length * (100 / totalStarLength))}%`;
                } 
            })
        }
    });
});

async function submitComment() {
    event.preventDefault();
    await ZOHO.CREATOR.init().then(async function() {
        let rating = 0;
        if(document.querySelector('input[name="rating"]:checked')){
            rating = document.querySelector('input[name="rating"]:checked').value;
            document.querySelector('input[name="rating"]:checked').checked = false;
        }

        const formComment = document.querySelector(".section-7-detail");
        const comment = formComment.querySelector('textarea').value;

        const configCountComments = {
            appName: "database-books-app",
            reportName: "All_Comments",
            criteria: "(ID_Comment != \""+ "0" + "\")" 
        }

        await ZOHO.CREATOR.API.getRecordCount(configCountComments).then(async function(response) {
            console.log(response)
            const idComment = (parseInt(response.result.records_count) + 1000).toString();
            const dateCreated = formatDate(Date.now());

            const commentData = {
                "data" : {
                    ID_Comment: idComment,
                    Email: email,
                    ID_Object: documentRecord.Document_ID,
                    Object_Type: "Documents",
                    Comment: comment,
                    Star: parseInt(rating),
                    Date_Created: dateCreated
                }
            }

            formComment.querySelector('textarea').value = "";

            const configComment = {
                appName: "database-books-app",
                formName: "Comment",
                data: commentData
            };

            console.log(configComment)
                
            await ZOHO.CREATOR.API.addRecord(configComment).then(async function(response){
                if(response.code = "3000"){
                    const menteeComment = document.createElement('div');
                    menteeComment.classList.add('inner-wrap');
                    if(parseInt(rating) > 0){
                        menteeComment.innerHTML = `
                            <img class="inner-avatar" src="https://sme.hust.edu.vn/wp-content/uploads/2022/02/Avatar-Facebook-trang.jpg">
                            <div class ="inner-comment">
                                <div class="inner-stars">
                                    <input type="radio" id="star5" name="rating" value="5">
                                    <label for="star5" title="5 star">☆</label>
                                    <input type="radio" id="star4" name="rating" value="4">
                                    <label for="star4" title="4 star">☆</label>
                                    <input type="radio" id="star3" name="rating" value="3">
                                    <label for="star3" title="3 star">☆</label>
                                    <input type="radio" id="star2" name="rating" value="2">
                                    <label for="star2" title="2 star">☆</label>
                                    <input type="radio" id="star1" name="rating" value="1">
                                    <label for="star1" title="1 star">☆</label>
                                </div>
                                <b class="inner-name">${accountMentee.username}</b>
                                ${comment}
                            </div>
                        `;
                        }
                        else{
                            menteeComment.innerHTML = `
                                <img class="inner-avatar" src="https://sme.hust.edu.vn/wp-content/uploads/2022/02/Avatar-Facebook-trang.jpg">
                                <div class ="inner-comment">
                                    <div class="inner-stars"></div>
                                    <b class="inner-name">${accountMentee.username}</b>
                                    ${comment}
                                </div>
                            `;
                        }
                        const avatarMentee = menteeComment.querySelector('.inner-avatar');
                        const urlAvatarMentee = accountMentee.avatar;
                        await ZOHO.CREATOR.UTIL.setImageData(avatarMentee ,urlAvatarMentee);

                        switch(parseInt(rating)){
                            case 1:{
                                star_1_length++;
                                ratingNumbers.push(parseInt(rating));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                break;
                            } 
                            case 2:{
                                star_2_length++;
                                ratingNumbers.push(parseInt(rating));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                break;
                            }
                            case 3:{
                                star_3_length++;
                                ratingNumbers.push(parseInt(rating));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "3 star"]`).style.color = "#f7d106";
                                break;
                            }
                            case 4:{
                                star_4_length++;
                                ratingNumbers.push(parseInt(rating));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "3 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "4 star"]`).style.color = "#f7d106";
                                break;
                            }
                            case 5:{
                                star_5_length++;
                                ratingNumbers.push(parseInt(rating));
                                menteeComment.querySelector(`[title = "1 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "2 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "3 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "4 star"]`).style.color = "#f7d106";
                                menteeComment.querySelector(`[title = "5 star"]`).style.color = "#f7d106";
                                break;
                            }
                            default:{
                                break;
                            }
                        }
                    const total = ratingNumbers.reduce((acc, cur) => acc + cur, 0);
                    formRating.querySelector('.inner-average-rating').textContent = (total / ratingNumbers.length).toFixed(1).toString();

                    const totalStarLength = star_1_length + star_2_length + star_3_length + star_4_length + star_5_length;

                    document.querySelector('#star-1').style.width = `${(star_1_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-2').style.width = `${(star_2_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-3').style.width = `${(star_3_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-4').style.width = `${(star_4_length * (100 / totalStarLength))}%`;
                    document.querySelector('#star-5').style.width = `${(star_5_length * (100 / totalStarLength))}%`;

                    const menteeCommentSection = document.querySelector('.section-8-detail');
                    menteeCommentSection.querySelector('.container').insertBefore(menteeComment, menteeCommentSection.querySelector('.container').firstChild);
                }
            });
        });
    });
}

async function likeDocument(buttonElement){
    await ZOHO.CREATOR.init().then(async function() {
        const heart = buttonElement.textContent;
        if (heart === "🤍") {
            buttonElement.textContent = "❤️";
            
            //Add record to Favorite Documents
            const formFavoriteDocumentData = {
                "data" : {
                    Email: email,
                    Document_ID: id
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
                criteria: "(Email == \"" + email + "\" && Document_ID == \"" + id + "\" )"

            };

            console.log(configDeleteFavoriteDocument);
        
            await ZOHO.CREATOR.API.deleteRecord(configDeleteFavoriteDocument).then(function(response) { console.log(response)});
        }
    });
}