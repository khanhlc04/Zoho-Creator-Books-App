function formatDate(timestamp) {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; // Lấy tháng và chuyển thành dạng viết tắt
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

ZOHO.CREATOR.init().then(async function() {
    const id = localStorage.getItem("id");
    localStorage.removeItem("id");
    
    const configGetDocumentByID = { 
      appName : "database-books-app",
      reportName : "All_Documents",
      criteria : '(Document_ID == \"' + id + '\")',
    }

    await ZOHO.CREATOR.API.getAllRecords(configGetDocumentByID).then(async function(response){
        const recordArr = response.data;
        console.log(recordArr)
        if (recordArr.length > 0) {
            const documentRecord = recordArr[0];

            const url = documentRecord.Cover_Image;
            const filepath =  url.split('filepath=')[1];;
            const imageurl = "https://creator.zoho.com/anln_hou/database-books-app/All_Documents/Photo/image/" + filepath;

            const banner = document.querySelector('.section-1-detail');
            banner.querySelector('img').src = imageurl;

            document.querySelector('.inner-title').textContent = documentRecord.Title;
            document.querySelector('.author').textContent = "Author: " + documentRecord.Author;
            document.querySelector('.category').textContent = "Category: " + documentRecord.Category;

            if(documentRecord.Cost == ""){
                document.querySelector('.cost').textContent = "Cost: Free";
            }
            else{
                document.querySelector('.cost').textContent = "Cost: " +  documentRecord.Cost;
            }

            document.querySelector('.date-created').textContent = "Date Created: " + documentRecord.Date_Created;
            document.querySelector('.date-publication').textContent = "Date Publication: " + documentRecord.Date_Publication;
            document.querySelector('.description').textContent = "Description: " + documentRecord.Description;
            document.querySelector('.file-format').textContent = "File Format: " + documentRecord.File_Format;
            document.querySelector('.copyright').textContent = "Copyright: " + documentRecord.Copyright;

            // document.querySelector('.commentForm').addEventListener('submit', function(event) {
            //     event.preventDefault();

            //     const rating = document.querySelector('input[name="rating"]:checked').value;
            //     const comment = document.getElementById('comment').value;

            //     const configCountComments = {
            //         appName: "database-books-app",
            //         reportName: "All_Comments",
            //         criteria: "(ID_Comment!= \""+ "0" + "\")" 
            //     }

            //     ZOHO.CREATOR.API.getRecordCount(configCountComments).then(function(response) {
            //         const idComment = (parseInt(response.result.records_count) + 1000).toString();
            //         const dateCreated = formatDate(Date.now());

            //         const commentData = {
            //             "data" : {
            //                 ID_Comment: idComment,
            //                 Email: email,
            //                 ID_Object: userRecord.Document_ID,
            //                 Object_Type: "Documents",
            //                 Comment: comment,
            //                 Star: parseInt(rating),
            //                 Date_Created: dateCreated
            //             }
            //         }

            //         console.log(commentData)

            //         const configComment = {
            //             appName: "database-books-app",
            //             formName: "Comment",
            //             data: commentData
            //         };
                        
            //         ZOHO.CREATOR.API.addRecord(configComment).then(function(response){
            //             console.log(response)
            //         });
                // });
            // });
        }
    });
});