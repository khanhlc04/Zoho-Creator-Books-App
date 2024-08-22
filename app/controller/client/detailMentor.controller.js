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

let emailMentor;
ZOHO.CREATOR.init().then(async function() { 
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    emailMentor = queryParams.email;
    console.log(queryParams.chat);
});

function contactMentor(){
    window.open(`https://anlnhoubookapp.zohocreatorportal.com/#Page:Detail_Mentor?email=${emailMentor}&&chat=true`);
    alert("We have invited you, check your email pls");
}

function formatDate(timestamp) {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; // Lấy tháng và chuyển thành dạng viết tắt
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

//Get UserLogin Info
let idRecord;
let email;
let accountMentor;
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

    if(emailMentor == email){
        document.querySelector('.section-4-mentor').style.display = 'none';
        document.querySelector('.contact-mentor').style.display = 'none';
    }
    
    const configGet = { 
        appName : "database-books-app",
        reportName : "All_Accounts", 
        criteria : "(Email == \"" + email + "\")",
    }

    await ZOHO.CREATOR.API.getAllRecords(configGet).then(function(response){
        const recordArr = response.data;
        if (recordArr.length > 0) {
            const userRecord = recordArr[0];
            idRecord = userRecord.ID;
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

    const avatarMentee = document.querySelector('.section-4-mentor');

    if(accountMentee.avatar){
        await ZOHO.CREATOR.UTIL.setImageData(avatarMentee.querySelector('img'), accountMentee.avatar);
    }

    avatarMentee.querySelector('.inner-name').textContent = accountMentee.username || '';
});
//End Get Account Info for MyAccount


ZOHO.CREATOR.init().then(async function() {    
    const configGetDetailMentor = { 
        appName : "database-books-app",
        reportName : "All_Accounts", 
        criteria : `(Email == \"${emailMentor}\")`,
    }

    await ZOHO.CREATOR.API.getAllRecords(configGetDetailMentor).then(async function(response){
        const recordArr = response.data;
        if (recordArr.length > 0) {
        
            const recordAccounts = response.data;
            if (recordAccounts.length > 0) {
                const userRecord = recordAccounts[0];
                idRecord = userRecord.ID;
                accountMentor = new Account(
                    userRecord.Account_ID,
                    userRecord.Avatar,
                    userRecord.User_Name,
                    userRecord.Email,
                    userRecord.Phone_Number,
                    userRecord.CCCD,
                    userRecord.Status
                )
            }
        
            const mentorInfo = document.querySelector('.section-1-mentor');
            if(accountMentor.avatar){
                const avatarMentor = mentorInfo.querySelector('img');
                await ZOHO.CREATOR.UTIL.setImageData(avatarMentor, account.avatar);
            }

            const infoMentor = document.querySelector('.section-2-mentor');
            infoMentor.querySelector('.inner-name').textContent = accountMentor.username || '';
            infoMentor.querySelector('.inner-email').textContent = accountMentor.email || '';

            formRating = document.querySelector('.section-3-mentor');
            const configCountComments = {
                appName: "database-books-app",
                reportName: "All_Comments",
                criteria: `(ID_Object == \"${accountMentor.accountId}\" && Object_Type == \"Mentor\")`
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
                    
                        let accountMentee;
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

                        const menteeCommentSection = document.querySelector('.section-6-mentor');
                        menteeCommentSection.querySelector('.container').appendChild(menteeComment);
                        const avatarMentee = menteeComment.querySelector('.inner-avatar');
                        const urlAvatarMentee = accountMentee.avatar;
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
    console.log(accountMentor)
    event.preventDefault();
    await ZOHO.CREATOR.init().then(async function() {
        let rating = 0;
        if(document.querySelector('input[name="rating"]:checked')){
            rating = document.querySelector('input[name="rating"]:checked').value;
            document.querySelector('input[name="rating"]:checked').checked = false;
        }

        const formComment = document.querySelector(".section-4-mentor");
        const comment = formComment.querySelector('textarea').value;

        const configCountComments = {
            appName: "database-books-app",
            reportName: "All_Comments",
            criteria: "(ID_Comment != \""+ "0" + "\")" 
        }

        await ZOHO.CREATOR.API.getRecordCount(configCountComments).then(async function(response) {
            const idComment = (parseInt(response.result.records_count) + 1000).toString();
            const dateCreated = formatDate(Date.now());

            const commentData = {
                "data" : {
                    ID_Comment: idComment,
                    Email: email,
                    ID_Object: accountMentor.accountId,
                    Object_Type: "Mentor",
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

                    const menteeCommentSection = document.querySelector('.section-6-mentor');
                    menteeCommentSection.querySelector('.container').insertBefore(menteeComment, menteeCommentSection.querySelector('.container').firstChild);
                }
            });
        });
    });
}