"use strict";

createDocuments();
document.querySelector('.search-bar').addEventListener('keypress', function _callee(event) {
  var section_2_document;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(event.key === 'Enter' || event.key === 'Go')) {
            _context.next = 9;
            break;
          }

          event.preventDefault();
          localStorage.setItem('keyword', this.value);
          console.log(localStorage.getItem('keyword'));
          section_2_document = document.querySelector('.section-2-document');
          section_2_document.querySelector('.container').innerHTML = "";
          _context.next = 8;
          return regeneratorRuntime.awrap(createDocuments());

        case 8:
          localStorage.removeItem('keyword');

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});

function likeDocument(buttonElement) {
  return regeneratorRuntime.async(function likeDocument$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ZOHO.CREATOR.init().then(function _callee2() {
            var heart, formFavoriteDocumentData, configAddFavoriteDocument, configDeleteFavoriteDocument;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    heart = buttonElement.textContent;

                    if (!(heart === "🤍")) {
                      _context2.next = 9;
                      break;
                    }

                    buttonElement.textContent = "❤️"; //Add record to Favorite Documents

                    formFavoriteDocumentData = {
                      "data": {
                        Email: buttonElement.getAttribute('email'),
                        Document_ID: buttonElement.getAttribute('id')
                      }
                    };
                    configAddFavoriteDocument = {
                      appName: "database-books-app",
                      formName: "Favorite_Document",
                      data: formFavoriteDocumentData
                    };
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(ZOHO.CREATOR.API.addRecord(configAddFavoriteDocument).then(function (response) {}));

                  case 7:
                    _context2.next = 14;
                    break;

                  case 9:
                    buttonElement.textContent = "🤍"; // Delete Record in Favorite Documents

                    configDeleteFavoriteDocument = {
                      appName: "database-books-app",
                      reportName: "All_Favorite_Documents",
                      criteria: "(Email == \"" + buttonElement.getAttribute('email') + "\" && Document_ID == \"" + buttonElement.getAttribute('id') + "\" )"
                    };
                    console.log(configDeleteFavoriteDocument);
                    _context2.next = 14;
                    return regeneratorRuntime.awrap(ZOHO.CREATOR.API.deleteRecord(configDeleteFavoriteDocument).then(function (response) {
                      console.log(response);
                    }));

                  case 14:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function createDocuments() {
  return regeneratorRuntime.async(function createDocuments$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(ZOHO.CREATOR.init().then(function _callee4() {
            var initparams, email, configGetDocument;
            return regeneratorRuntime.async(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    //get User Email
                    initparams = ZOHO.CREATOR.UTIL.getInitParams();
                    email = initparams.loginUser; // End get User Email
                    //Get Document for Mentee Page

                    configGetDocument = {
                      appName: "database-books-app",
                      reportName: "All_Documents",
                      criteria: "(Deleted == \"false\" && Status == \"Active\" && Intellectual_Property_Agreement == \"true\")",
                      page: 1,
                      pageSize: 2
                    };
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(ZOHO.CREATOR.API.getAllRecords(configGetDocument).then(function _callee3(response) {
                      var recordDocuments, i, documentRecord, originalUrl, parts, desiredPart, encodedFilePath, modifiedDesiredPart, baseUrl, fileUrl, documentBlock, heart, configCountFavoriteDocument, section_3_homepage;
                      return regeneratorRuntime.async(function _callee3$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              recordDocuments = response.data;

                              if (!(recordDocuments.length > 0)) {
                                _context4.next = 24;
                                break;
                              }

                              i = 0;

                            case 3:
                              if (!(i < recordDocuments.length)) {
                                _context4.next = 24;
                                break;
                              }

                              documentRecord = recordDocuments[i]; // URL của tệp tải xuống

                              originalUrl = documentRecord.File_upload; // Bước 1: Tách URL thành các phần dựa trên dấu '/'

                              parts = originalUrl.split('/'); // Bước 2: Lấy phần mong muốn từ các phần đã tách và thay đổi 'download' thành 'download-file'

                              desiredPart = parts.slice(6).join('/').replace('download', 'download-file'); // Bước 3: Thay thế 'filepath=' với 'filepath=/' và mã hóa URL

                              encodedFilePath = encodeURIComponent(desiredPart.split('filepath=')[1]);
                              modifiedDesiredPart = desiredPart.replace("filepath=".concat(desiredPart.split('filepath=')[1]), "filepath=/".concat(encodedFilePath)); // Bước 4: Tạo URL hoàn chỉnh

                              baseUrl = "https://anlnhoubookapp.zohocreatorportal.com/anln_hou/database-books-app/report/";
                              fileUrl = "".concat(baseUrl).concat(modifiedDesiredPart, "&mediaType=3&digestValue=eyJkaWdlc3RWYWx1ZSI6MTcyMjk1Njk4MjgyMywibGFuZ3VhZ2UiOiJ2aSJ9"); //insert Document block

                              documentBlock = document.createElement('div');
                              documentBlock.className = 'inner-new-document-container-1';
                              heart = "";
                              configCountFavoriteDocument = {
                                appName: "database-books-app",
                                reportName: "All_Favorite_Documents",
                                criteria: "(Document_ID == \"" + documentRecord.Document_ID + "\" && Email == \"" + email + "\")"
                              };
                              _context4.next = 18;
                              return regeneratorRuntime.awrap(ZOHO.CREATOR.API.getRecordCount(configCountFavoriteDocument).then(function (response) {
                                console.log(response.result);

                                if (response.result.records_count > 0) {
                                  heart = "❤️";
                                } else {
                                  heart = "🤍";
                                }
                              }));

                            case 18:
                              documentBlock.innerHTML = "\n                            <a href=\"https://anlnhoubookapp.zohocreatorportal.com/#Page:Detail_Document?docID=".concat(documentRecord.Document_ID, "\"  target=\"_blank\">\n                                <div class=\"inner-new-document-1\" id=").concat(documentRecord.Document_ID, ">\n                                        <div class=\"inner-title\"><b>").concat(documentRecord.Title, "</b></div>\n                                        <div class=\"inner-author\">\n                                            <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                            <path d=\"M9 7.5C10.6569 7.5 12 6.15685 12 4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5C6 6.15685 7.34315 7.5 9 7.5Z\" stroke=\"black\" stroke-width=\"1.5\"></path>\n                                            <path d=\"M14.9985 13.5C15 13.377 15 13.2517 15 13.125C15 11.2613 12.3135 9.75 9 9.75C5.6865 9.75 3 11.2613 3 13.125C3 14.9887 3 16.5 9 16.5C10.6732 16.5 11.88 16.3822 12.75 16.1722\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path>\n                                            </svg>        \n                                            ").concat(documentRecord.Author, "\n                                        </div>\n                                    <div class=\"inner-date-create\">\n                                        <svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                        <g clip-path=\"url(#clip0_321_1457)\">\n                                        <path d=\"M9.99996 1.66699C14.6025 1.66699 18.3333 5.39783 18.3333 10.0003C18.3333 14.6028 14.6025 18.3337 9.99996 18.3337C5.39746 18.3337 1.66663 14.6028 1.66663 10.0003C1.66663 5.39783 5.39746 1.66699 9.99996 1.66699ZM9.99996 3.33366C8.23185 3.33366 6.53616 4.03604 5.28591 5.28628C4.03567 6.53652 3.33329 8.23222 3.33329 10.0003C3.33329 11.7684 4.03567 13.4641 5.28591 14.7144C6.53616 15.9646 8.23185 16.667 9.99996 16.667C11.7681 16.667 13.4638 15.9646 14.714 14.7144C15.9642 13.4641 16.6666 11.7684 16.6666 10.0003C16.6666 8.23222 15.9642 6.53652 14.714 5.28628C13.4638 4.03604 11.7681 3.33366 9.99996 3.33366ZM9.99996 5.00033C10.2041 5.00035 10.4011 5.07529 10.5536 5.21092C10.7061 5.34655 10.8036 5.53345 10.8275 5.73616L10.8333 5.83366V9.65533L13.0891 11.9112C13.2386 12.0611 13.3254 12.2624 13.3318 12.474C13.3383 12.6856 13.2639 12.8918 13.1239 13.0506C12.9839 13.2094 12.7887 13.3089 12.5779 13.329C12.3671 13.3491 12.1566 13.2882 11.9891 13.1587L11.9108 13.0895L9.41079 10.5895C9.28128 10.4599 9.19809 10.2912 9.17413 10.1095L9.16663 10.0003V5.83366C9.16663 5.61264 9.25442 5.40068 9.4107 5.2444C9.56698 5.08812 9.77894 5.00033 9.99996 5.00033Z\" fill=\"black\"></path>\n                                        </g>\n                                        <defs>\n                                        <clipPath id=\"clip0_321_1457\">\n                                        <rect width=\"20\" height=\"20\" fill=\"white\"></rect>\n                                        </clipPath>\n                                        </defs>\n                                        </svg>\n                                        ").concat(documentRecord.Date_Created, "\n                                    </div>\n                                </div>\n                            </a>\n                            <button onclick=\"likeDocument(this)\" class=\"inner-heart\" email=").concat(email, " id=").concat(documentRecord.Document_ID, ">\n                                ").concat(heart, "\n                            </button>\n                            <a href=").concat(fileUrl, " class=\"inner-download-1\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M9 17V7M9 17L13 13M9 17L5 13M1 1H17\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>\n                                T\u1EA3i Xu\u1ED1ng\n                            </a>\n                    "); // End Insert Document bock

                              section_3_homepage = document.querySelector('.section-3-homepage');
                              section_3_homepage.querySelector('.inner-wrap').appendChild(documentBlock);

                            case 21:
                              i++;
                              _context4.next = 3;
                              break;

                            case 24:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      });
                    }));

                  case 5:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          }));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
}