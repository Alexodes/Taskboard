// Tabs functionality


function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// MODULE IMPLEMENTATION

// Data Controller
var tbController = (function() {

    var data = {
        // Members Array
        members:[],
        board:[]
    };


    //Public methods
    return {
        // Local Storage
        saveMembersToLocal() {
            localStorage.setItem('members', JSON.stringify(data.members));
        },

        loadMembersFromLocal() {
            if (localStorage.getItem('members')) {
                data.members = JSON.parse(localStorage.getItem('members'));
              }
            return data.members;
        },

        saveBoardToLocal() {
            localStorage.setItem('board', JSON.stringify(data.board));
        },

        loadBoardFromLocal() {
            if (localStorage.getItem('board')) {
                data.board = JSON.parse(localStorage.getItem('board'));
              }
            return data.board;
        },

        addMember: function (value) {
            var newMember = {id: uuidv4(), name: value};
            if(newMember.name !== "") {
                data.members.push(newMember);
            }
            return newMember;
        },

        deleteMember: function(id) {
            var ids, index;

            ids = data.members.map(function(item) {
                return item.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.members.splice(index,1);
            }
        },

        saveMember: function(ID, newValue) {
            for(let item of data.members) {
                if(item.id === ID) {
                    item.name = newValue;
                    return item;
                }
            }
        },


        // IMPLEMENTATION FUNCTIONS FOR BOARD PART

        addNewList: function() {
            var newList = {id:uuidv4(), title: "New List", tasks: []};
            data.board.push(newList);
            return newList;
        },

        deleteList: function(id) {
            let ids, index;

            ids = data.board.map(function(item) {
                return item.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.board.splice(index,1);
            }
        },

        editListTitle: function(ID, newTitle) {
            for(let item of data.board) {
                if(item.id === ID) {
                    item.title = newTitle;
                    return item.title;
                }
            }
        },

        AddNewCard: function(listIndex) {
            var newCard = {id: uuidv4(),text: "Add new task", members: []};
            for(let item of data.board) {
                if (item.id === listIndex) {
                    item.tasks.push(newCard);
                }
            }
            return newCard;
        },

        OpenModal: function(cardId, listId) {
            
            // names of lists
            let result = [
                {
                    listId: "",
                    cardId: "",
                    cardText:"",
                    actualListTitle:"",
                    otherListTitlesAndIds: [],
                    actualMembersOfCard:[],
                    membersAll:[]
                }
            ];


            for(let list of data.board) {
                if(list.id === listId) {
                    result[0].listId = list.id;
                    result[0].actualListTitle = list.title;
                }
            }

            // I need text of task
            for(let list of data.board) {
                if(list.id === listId) {
                    for(let card of list.tasks) {
                        if(card.id === cardId) {
                            result[0].cardId = card.id;
                            result[0].cardText = card.text;
                            if(card.members.length > 0) {
                                for(let cardMember of card.members) {
                                    result[0].actualMembersOfCard.push(cardMember);
                                }
                            }
                        }
                    }
                }
            }

            

            if(result[0].actualMembersOfCard.length === 0) {
                for(let member of data.members) {
                    result[0].membersAll.push(member);
                }
            } else if(result[0].actualMembersOfCard.length > 0) {
                for(let member of data.members) {
                    result[0].membersAll.push(member);
                }

                for (let i = 0, len = result[0].actualMembersOfCard.length; i < len; i++) { 
                    for (let j = 0, len2 = result[0].membersAll.length; j < len2; j++) { 
                        if (result[0].actualMembersOfCard[i].member_id === result[0].membersAll[j].id) {
                            result[0].membersAll.splice(j, 1);
                            len2=result[0].membersAll.length;
                        }
                    }
                }
            }

            for(let list of data.board) {
                if(list.id !== listId){
                    result[0].otherListTitlesAndIds.push({list_id: list.id, list_title:list.title});
                }
            }
            
            return(result);
        },

        deleteCard: function(listID, cardID) {
            let ids, index;

            for(let list of data.board) {
                if(list.id === listID) {
                    
                    ids = list.tasks.map(function(card) {
                        return card.id;
                    });

                    index = ids.indexOf(cardID);

                    if(index !== -1) {
                        list.tasks.splice(index, 1);
                    }
                }
            }
        },

        saveCardNewText: function(listId, cardId, newText) {
            for(let list of data.board) {
                if (list.id === listId) {
                    for(let card of list.tasks) {
                        if(card.id === cardId) {
                            card.text = newText;
                            return card.text;
                        }
                    }
                }
            }
        },

        saveCardNewMembers: function(listId, cardId, MemberArray) {
            for(let list of data.board) {
                if(list.id === listId) {
                    for(let card of list.tasks) {
                        if(card.id === cardId) {
                            card.members = MemberArray;
                            return card.members;
                        }
                    }
                }
            }
        },

        changeListForCard: function(listId, CardId, listToMove) {
            var TargetCard;
            let ids, index;

            for(let list of data.board) {
                if(list.id === listId) {
                    for(let card of list.tasks) {
                        if(card.id === CardId) {
                            TargetCard = card;
                        }
                    }
                }
            }

            for(let list of data.board) {
                if(list.id == listToMove && list.id !== listId) {
                    list.tasks.push(TargetCard);
                }
            }

            if(listId != listToMove) {
                for(let list of data.board) {
                    if(list.id === listId) {
                        
                        ids = list.tasks.map(function(card) {
                            return card.id;
                        });
    
                        index = ids.indexOf(CardId);
    
                        if(index !== -1) {
                            list.tasks.splice(index, 1);
                        }
                    }
                }
            }
        },

         testing: function() {
             console.log(data);
         }
    }

})();

// UI Controller
var UIController = (function() {


    return {

        loadMembersToUI: function(obj) {
            var html = ``;

            if(obj.length !== 0) {
                for(let member of obj) {
                    html += `<li class="list-group-item member-in-list" data-id=${member.id}>
                            <span class="member-name" id="span_to_show_the_name">${member.name}</span>
                            <input type="text" class="new-member-name displayState" maxlength="25" id="input_to_member_change" value="${member.name}">
                            <div>
                                <button type="button" class="btn btn-primary member-edit-btn seen" id="edit-btn">Edit</button>
                                <button type="button" class="btn btn-danger member-delete-btn seen" id="delete-btn">Delete</button>
                                <button type="button" class="btn btn-success member-save-btn" id="save-btn">Save</button>
                                <button type="button" class="btn btn-secondary member-cancel-btn" id="cancel-btn">Cancel</button>
                            </div>
                        </li>`;
                        
                }
                document.querySelector(".members_group").insertAdjacentHTML('beforeend', html);
            }
            
        },

        loadBoardToUI: function(obj) {
            var html = ``;

            for(let list of obj) {
                html += `<li class="list-li" data-id=${list.id}>
                                <div class="list-content">
                                    <div class="panel">
                                        <div class="panel_header">
                                            <h3 class="panel-title" id="panel-title">${list.title}</h3>
                                            <input type="text" class="input_list_change displayState" id="input_list_change" value="${list.title}">
                                            <div class="dropdown_delete">
                                            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                              <a class="dropdown-item" id="delete_list_btn">Delete list</a>
                                            </div>
                                          </div>
                                        </div>
                                        <ul class="panel_notes" id="panel_notes">`;
                

                if(list.tasks){
                    for(let card of list.tasks) {
                        html += `<li class="note" data-id=${card.id} draggable="true">
                            <span id="span_for_text">${card.text}</span>
                            <button type="button" class="btn btn-primary" id="edit_note_btn">Edit</button>
                            <div id="label-holder">`;

                            if(card.members.length !== 0) {
                                for(let member of card.members) {
                                    html += `<span>${member.member_name.split(" ").map((n)=>n[0]).join("").toUpperCase()}</span>`;
                                }
                            }

                            html += `</div></li>`;
                    }
            }


                html += `</ul>
                <div class="panel_footer">
                    <button class="btn-add_a_card" id="btn-add-card">Add a card...</button>
                            </div>
                        </div>
                    </div>
                </li>`;
            }

            document.querySelector("#lists-list").insertAdjacentHTML('beforeend', html);

        },

        getNewMemberInput: function() {
            return document.querySelector(".new_member_input").value;
        },

        addMemberListItem: function(obj) {
            
            var html;

            //1. Create html
            if(obj.name !== "") {
                html = `<li class="list-group-item member-in-list" data-id=${obj.id}>
                            <span class="member-name" id="span_to_show_the_name">${obj.name}</span>
                            <input type="text" class="new-member-name displayState" maxlength="25" id="input_to_member_change" value="${obj.name}">
                            <div>
                                <button type="button" class="btn btn-primary member-edit-btn seen" id="edit-btn">Edit</button>
                                <button type="button" class="btn btn-danger member-delete-btn seen" id="delete-btn">Delete</button>
                                <button type="button" class="btn btn-success member-save-btn" id="save-btn">Save</button>
                                <button type="button" class="btn btn-secondary member-cancel-btn" id="cancel-btn">Cancel</button>
                            </div>
                        </li>`;
                // 2. Add to node in document
                document.querySelector(".members_group").insertAdjacentHTML('beforeend', html);
            } else {
                alert("Enter the name please");
            }
        },

        deleteMemberItem: function(selectorID) {
            var node = selectorID;
            node.parentNode.removeChild(node);
        },

        handleEditMember: function(selectorToEdit) {

            var editButton = selectorToEdit.querySelector("#edit-btn");
            var deleteButton = selectorToEdit.querySelector("#delete-btn");
            var saveButton = selectorToEdit.querySelector("#save-btn");
            var cancelButton = selectorToEdit.querySelector("#cancel-btn");
            var inputField = selectorToEdit.querySelector("#input_to_member_change");
            var spanElement = selectorToEdit.querySelector("#span_to_show_the_name");

            editButton.classList.remove("seen");
            deleteButton.classList.remove("seen");

            saveButton.classList.add("seen");
            cancelButton.classList.add("seen");

            inputField.classList.remove("displayState");
            spanElement.classList.add("displayState");
        },

        handleCancelMember: function(selectorToCancel) {
            var editButton = selectorToCancel.querySelector("#edit-btn");
            var deleteButton = selectorToCancel.querySelector("#delete-btn");
            var saveButton = selectorToCancel.querySelector("#save-btn");
            var cancelButton = selectorToCancel.querySelector("#cancel-btn");
            var inputField = selectorToCancel.querySelector("#input_to_member_change");
            var spanElement = selectorToCancel.querySelector("#span_to_show_the_name");

            editButton.classList.add("seen");
            deleteButton.classList.add("seen");

            saveButton.classList.remove("seen");
            cancelButton.classList.remove("seen");

            inputField.classList.add("displayState");
            spanElement.classList.remove("displayState");
        },

        handleSaveMember: function(selectorToSave, memberEditedObj) {
            var editButtonS = selectorToSave.querySelector("#edit-btn");
            var deleteButtonS = selectorToSave.querySelector("#delete-btn");
            var saveButtonS = selectorToSave.querySelector("#save-btn");
            var cancelButtonS = selectorToSave.querySelector("#cancel-btn");
            var inputFieldS = selectorToSave.querySelector("#input_to_member_change");
            var spanElementS = selectorToSave.querySelector("#span_to_show_the_name");

            editButtonS.classList.add("seen");
            deleteButtonS.classList.add("seen");

            saveButtonS.classList.remove("seen");
            cancelButtonS.classList.remove("seen");

            inputFieldS.classList.add("displayState");
            spanElementS.classList.remove("displayState");

            var NewHtmlMember;

            //1. Create html
            NewHtmlMember = `
                <span class="member-name" id="span_to_show_the_name">${memberEditedObj.name}</span>
                <input type="text" class="new-member-name displayState" maxlength="25" id="input_to_member_change" value=${memberEditedObj.name}>
                <div>
                    <button type="button" class="btn btn-primary member-edit-btn seen" id="edit-btn">Edit</button>
                    <button type="button" class="btn btn-danger member-delete-btn seen" id="delete-btn">Delete</button>
                    <button type="button" class="btn btn-success member-save-btn" id="save-btn">Save</button>
                    <button type="button" class="btn btn-secondary member-cancel-btn" id="cancel-btn">Cancel</button>
                </div>
            `;

            // 2. Add to node in document
            selectorToSave.innerHTML = NewHtmlMember;

        },

        clearMemberInput: function() {
            var memInputField;

            memInputField = document.querySelector(".new_member_input");
            memInputField.value = '';
        },

        getEditedMemberInput: function(elementToEditAndSave) {
            return elementToEditAndSave.querySelector("#input_to_member_change").value;
        },

        //---------- IMPLEMENTATION FOR BOARD ----------//

        addNewListItem: function(newListObject) {
            var NewListHTML;

            NewListHTML = `<li class="list-li" data-id=${newListObject.id}>
                                <div class="list-content">
                                    <div class="panel">
                                        <div class="panel_header">
                                            <h3 class="panel-title" id="panel-title">${newListObject.title}</h3>
                                            <input type="text" class="input_list_change displayState" id="input_list_change" value="${newListObject.title}">
                                            <div class="dropdown_delete">
                                            <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                              <a class="dropdown-item" id="delete_list_btn">Delete list</a>
                                            </div>
                                          </div>
                                        </div>
                                        <ul class="panel_notes" id="panel_notes"></ul>
                                        <div class="panel_footer">
                                            <button class="btn-add_a_card" id="btn-add-card">Add a card...</button>
                                        </div>
                                    </div>
                                </div>
                            </li>`;

            document.querySelector("#lists-list").insertAdjacentHTML('beforeend', NewListHTML);
        },

        deleteListItem: function(selectorListID) {
            let node = selectorListID;
            node.parentNode.removeChild(node);
        },

        handleEditListTitle: function(TitleToEdit) {
            var listTitle = TitleToEdit.querySelector("#panel-title");
            var inputTitle = TitleToEdit.querySelector("#input_list_change");

            
            listTitle.classList.add("displayState");
            inputTitle.classList.remove("displayState");
            inputTitle.focus();
        },

        getNewListTitleInput: function(node) {
            return node.querySelector("#input_list_change").value;
        },

        handleSaveNewListTitle: function(ListTitleToSaveElement) {
            var listTitle = ListTitleToSaveElement.querySelector("#panel-title");
            var inputTitle = ListTitleToSaveElement.querySelector("#input_list_change");

            listTitle.classList.remove("displayState");
            inputTitle.classList.add("displayState");
        },

        handleChangeListTitle: function(list, new_title) {
            list.querySelector("#panel-title").innerHTML = new_title;
        },

        handleAddNewCard: function(listToAddCard, NewCardsObj) {
            var toWhatToAttach = listToAddCard.querySelector("#panel_notes");

            var newCardHTML = `<li class="note" data-id=${NewCardsObj.id} draggable="true">
                                    <span id="span_for_text">${NewCardsObj.text}</span>
                                    <button type="button" class="btn btn-primary" id="edit_note_btn">Edit</button>
                                    <div id="label-holder"></div>
                                </li>`;

            toWhatToAttach.insertAdjacentHTML('beforeend', newCardHTML);
        },

        handleOpenModal: function(necessaryObject) {
            var modal = document.querySelector("#modal_container");
            var select = document.querySelector("#list_options");
            var checkbox_div = document.querySelector(".checkbox_modal");
            var selectHTML, checkboxHTML = ``;

            modal.setAttribute("card-id", necessaryObject[0].cardId);
            modal.setAttribute("list-id", necessaryObject[0].listId);
            document.querySelector("#card-text").value = necessaryObject[0].cardText;
            
            selectHTML = `<option class="lists-options" data_id=${necessaryObject[0].listId} selected>${necessaryObject[0].actualListTitle}</option>`;

            if(necessaryObject[0].otherListTitlesAndIds.length > 0) {
                for(let list of necessaryObject[0].otherListTitlesAndIds){
                    selectHTML += `<option class="lists-options" data_id=${list.list_id}>${list.list_title}</option>`;
                }
            }

            select.innerHTML = selectHTML;

            if(necessaryObject[0].actualMembersOfCard.length > 0) {
                for(let member of necessaryObject[0].actualMembersOfCard) {
                    checkboxHTML += `<label>
                                        <input type="checkbox" class="checkbox_members_option" name=${member.member_name} value="${member.member_name}" member_id=${member.member_id} checked="checked">
                                            ${member.member_name}
                                    </label>`;
                }
            } 

            if(necessaryObject[0].membersAll.length > 0) {
                for(let member of necessaryObject[0].membersAll) {
                    checkboxHTML += `<label>
                                        <input type="checkbox" class="checkbox_members_option" name=${member.name} value="${member.name}" member_id=${member.id}>
                                            ${member.name}
                                    </label>`;
                }
            }

            checkbox_div.innerHTML = checkboxHTML;

            modal.style.display = "block";
        },

        handleCloseModal: function() {
            var modal = document.querySelector("#modal_container");
            modal.style.display = "none";
        },

        handleDeleteCard: function(card) {
            let node = card;
            node.parentNode.removeChild(node);
        },

        handleGetCardTextInput: function() {
            return document.querySelector("#card-text").value;
        },

        handleSaveCardNewText: function(cardTochangeTextIn, text) {
            cardTochangeTextIn.querySelector("#span_for_text").innerHTML = text;
        },

        handleGetInputMembers: function() {
            var result = [];
            var membersCheckboxArea = document.getElementsByClassName("checkbox_members_option");
            for(let member of membersCheckboxArea){
                if(member.checked) {
                    result.push({member_id: member.attributes.member_id.nodeValue, member_name: member.attributes.value.nodeValue});
                }
            }
            return result;

        },

        handleGetInputLists: function() {
            var selectedListID = [];
            var selectArea = document.getElementsByClassName("lists-options");
            for(let list of selectArea) {
                if(list.selected) {
                    selectedListID.push(list.attributes.data_id.nodeValue);
                }
            }
            return selectedListID;
        },

        handleInputInitials: function(cardToInputInitials, membersArray) {
            var namesArray = [];
            var initials = [];
            var initialsHTML = ``;

            if(membersArray.length > 0) {
                for(let member of membersArray) {
                    namesArray.push(member.member_name);
                }
            }

            for(let name of namesArray) {
                initials.push(name.split(" ").map((n)=>n[0]).join("").toUpperCase());
            }

            var currentCard = cardToInputInitials.querySelector("#label-holder");

                for(let initial of initials) {
                    initialsHTML += `<span>${initial}</span>`;
                }

                currentCard.innerHTML = initialsHTML;
        },

        SwitchCard: function(listToAttachCard, CardObj) {
            var toWhatToAttach = listToAttachCard.querySelector("#panel_notes");
            toWhatToAttach.appendChild(CardObj);
        },        
    };

})();


// Global Application Controller
var controller = (function(tbCtrl,UICtrl) {

    var setEventListeners = function () {
        // Event listener for adding members
        document.querySelector('.btn-add-member').addEventListener("click", ctrlAddMember);

        // Add member on Enter press key
        // document.addEventListener("keypress", function(event) {
        //     if(event.keyCode === 13 || event.which === 13) {
        //         ctrlAddMember();
        //     };
        // });

        // Event listener for deleting members
        document.querySelector(".members_group").addEventListener("click", ctrlDeleteMember);

        // Event listener for edit button
        document.querySelector(".members_group").addEventListener("click", ctrlEditMember);

        // Event listener for cancel button
        document.querySelector(".members_group").addEventListener("click", ctrlCancelMember);

        // Event listener for save button
        document.querySelector(".members_group").addEventListener("click", ctrlSaveMember);

        //---------- IMPLEMENTATION FOR BOARD ----------//

        // Event listener for list addition
        document.querySelector("#add_list_btn").addEventListener("click", ctrlAddList);
        
        // Event listener for deleting element
        //if(document.querySelector("#lists-list").childNodes.length > 0){
            document.querySelector("#lists-list").addEventListener("click", ctrlDeleteList);
        //}

        // Event listener for editing List title
        //if(document.querySelector("#lists-list").childNodes.length >= 1){
            document.querySelector("#lists-list").addEventListener("click", ctrlEditListTitle);
        //}
        

            //document.querySelector("#lists-list").addEventListener("blur", ctrlSaveListTitle);

        // Event listener for addition of new Card
        //if(document.querySelector("#lists-list").childNodes.length >= 1){
            document.querySelector("#lists-list").addEventListener("click", ctrlAddCard);
        //}

        // Event listener for open a certain modal window for a card editing
        //if(document.querySelector("#lists-list").childNodes.length >= 1){
            document.querySelector("#lists-list").addEventListener("click", ctrlOpenModalWindow);
        //}

        // Event listener for closing the modal window
        document.querySelector("#modal_container").addEventListener("click", ctrlCloseModalWindow);

        // Event listener for deleting of certain card
        document.querySelector("#modal_container").addEventListener("click", ctrlDeleteCard);

        // Event listener for save changes in card
        document.querySelector("#modal_container").addEventListener("click", ctrlSaveCard);
        
    };

    var setEventListenerForListInput = function() {
        var listsClass = document.getElementsByClassName("list-li");
            for (var i = 0; i < listsClass.length; i++) {
                listsClass[i].querySelector("#input_list_change").addEventListener("blur", ctrlSaveListTitle);
            }
    };

    var ctrlAddMember = function() {
        // 1. get the input field value
        var newMemberInput = UICtrl.getNewMemberInput();
       
        // 2. add the item to the tbController
        var newMemeber = tbCtrl.addMember(newMemberInput);

        // 3. add the new item to the UI
        UICtrl.addMemberListItem(newMemeber);

        // 4. clear the input field
        UICtrl.clearMemberInput();

        // 5. save member to local storage
        tbCtrl.saveMembersToLocal();
    };

    var ctrlDeleteMember = function(event) {
        var memberID;

        memberID = event.target.parentNode.parentNode.getAttribute('data-id');
        var memberToDelete = document.querySelector('li[data-id="' + memberID + '"]'); 
        
        if(memberID && event.target.id === "delete-btn" && confirm("Are you sure you want to delete this member?")) {
            // 1. Delete the member from data structure
            tbCtrl.deleteMember(memberID);
            // 2. Delete the member from the ui
            UICtrl.deleteMemberItem(memberToDelete);
            // 5. save member to local storage
            tbCtrl.saveMembersToLocal();
        };
    };

    var ctrlEditMember = function(event) {

        var memberToEditID;

        memberToEditID = event.target.parentNode.parentNode.getAttribute('data-id');
        var memberToEdit = document.querySelector('li[data-id="' + memberToEditID + '"]');

        if(memberToEditID && event.target.id === "edit-btn") {
            UICtrl.handleEditMember(memberToEdit);
            tbCtrl.saveMembersToLocal();
        }
    };

    var ctrlCancelMember = function(event) {

        var memberToCancelID;

        memberToCancelID = event.target.parentNode.parentNode.getAttribute('data-id');
        var memberToCancel = document.querySelector('li[data-id="' + memberToCancelID + '"]');

        if(memberToCancelID && event.target.id === "cancel-btn") {
            UICtrl.handleCancelMember(memberToCancel);
        }
    };

    var ctrlSaveMember = function(event) {

        var memberToEditIndex = event.target.parentNode.parentNode.getAttribute('data-id');
        var memberToSaveElement = document.querySelector('li[data-id="' + memberToEditIndex + '"]');

        // 1. get the input field value
        var editionOfMember = UICtrl.getEditedMemberInput(memberToSaveElement);

        if(editionOfMember && event.target.id === "save-btn"){
            // 2. add the item to the tbController
            var EditedObjM = tbCtrl.saveMember(memberToEditIndex, editionOfMember);
            UICtrl.handleSaveMember(memberToSaveElement, EditedObjM);  
            tbCtrl.saveMembersToLocal();
        }
        
    };

    var ctrlAddList = function() {
        // 1. Add new list to database
        var new_list = tbCtrl.addNewList();
        // 2. Add new html with UI controller
        UICtrl.addNewListItem(new_list);
        setEventListenerForListInput();
        tbCtrl.saveBoardToLocal();
    };

    var ctrlDeleteList = function(event) {
        var ListID,
            ElementToDelete,
            listItemToDelete;

        ElementToDelete = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        ListID = ElementToDelete.getAttribute('data-id');
        listItemToDelete = document.querySelector('li[data-id="' + ListID + '"]');
        
        if(ListID && event.target.id === "delete_list_btn" && confirm("Are you sure you want to delete this list?")) {
            // 1. Delete the member from data structure
            tbCtrl.deleteList(ListID);
            // 2. Delete the member from the ui
            UICtrl.deleteListItem(listItemToDelete);
            tbCtrl.saveBoardToLocal();
        };
    };

    var ctrlEditListTitle = function(event) {
        var ListID,
            ElementToEdit,
            listItemToEdit;

        ElementToEdit = event.target.parentNode.parentNode.parentNode.parentNode;
        ListID = ElementToEdit.getAttribute('data-id');
        listItemToEdit = document.querySelector('li[data-id="' + ListID + '"]');

        if(event.target.id === "panel-title") {
            UICtrl.handleEditListTitle(listItemToEdit);
        }
    };

    var ctrlSaveListTitle = function(event) {
        var ListID,
            ElementToEdit,
            listItemToEdit;

        ElementToEdit = event.target.parentNode.parentNode.parentNode.parentNode;
        ListID = ElementToEdit.getAttribute('data-id');
        listItemToEdit = document.querySelector('li[data-id="' + ListID + '"]');

        if(listItemToEdit.querySelector("#input_list_change").style.display !== "none") {
            var newTitle = UICtrl.getNewListTitleInput(listItemToEdit);
            tbCtrl.editListTitle(ListID,newTitle);
            UICtrl.handleChangeListTitle(listItemToEdit, newTitle);
            UICtrl.handleSaveNewListTitle(listItemToEdit);
        }
    }


    var ctrlAddCard = function(event) {
        var ListID,
            ElementToAddACard,
            listItemToAddACard;

        ElementToAddACard = event.target.parentNode.parentNode.parentNode.parentNode;
        ListID = ElementToAddACard.getAttribute('data-id');
        listItemToAddACard = document.querySelector('li[data-id="' + ListID + '"]');
        
        
        if(ListID && event.target.id === "btn-add-card") {
            var newCard = tbCtrl.AddNewCard(ListID);
            UICtrl.handleAddNewCard(listItemToAddACard, newCard);
            
            tbCtrl.saveBoardToLocal();
        }
    };

    var ctrlOpenModalWindow = function(event) {
        var CardID, CardToEdit, ListID, ListToCardEdit;
        
        CardID = event.target.parentNode.getAttribute('data-id');
        CardToEdit = document.querySelector('li[data-id="' + CardID + '"]');

        ListID = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
        ListToCardEdit = document.querySelector('li[data-id="' + ListID + '"]');

        

        if(CardID && ListID && event.target.id === "edit_note_btn") {
            var result = tbCtrl.OpenModal(CardID, ListID);
            UICtrl.handleOpenModal(result);
        }
    };

    var ctrlCloseModalWindow = function(event) {
        

        if(event.target.id === "close_modal_cross") {
            UICtrl.handleCloseModal();
        } else if(event.target.id === "close_modal-btn") {
            UICtrl.handleCloseModal();
        } else if(event.target.id === "close_modal") {
            UICtrl.handleCloseModal();
        }
    };

    var ctrlDeleteCard = function(event) {

        var listid = document.querySelector("#modal_container").getAttribute("list-id");
        var cardid = document.querySelector("#modal_container").getAttribute("card-id");
        var cardToDelete = document.querySelector('li[data-id="' + cardid + '"]');

        if(event.target.id === "delete_card-btn" && confirm("Are you sure you want to delete this card?")) {
            tbCtrl.deleteCard(listid, cardid);
            UICtrl.handleDeleteCard(cardToDelete);
            UICtrl.handleCloseModal();
            tbCtrl.saveBoardToLocal();
        }
    };

    var ctrlSaveCard = function(event) {

        var listid = document.querySelector("#modal_container").getAttribute("list-id");
        var cardid = document.querySelector("#modal_container").getAttribute("card-id");
        var cardToChange = document.querySelector('li[data-id="' + cardid + '"]');

        if(event.target.id === "save_card-btn") {
            var card_input_text = UICtrl.handleGetCardTextInput();
            tbCtrl.saveCardNewText(listid,cardid,card_input_text);
            UICtrl.handleSaveCardNewText(cardToChange, card_input_text);

            var members_to_save = UICtrl.handleGetInputMembers();
            var saved_members_to_card = tbCtrl.saveCardNewMembers(listid, cardid, members_to_save);
            UICtrl.handleInputInitials(cardToChange, saved_members_to_card);

            // Get selected list ID
            var selectedList = UICtrl.handleGetInputLists();
            ListToAddCardNewToIt = document.querySelector('li[data-id="' + selectedList + '"]');
          
                // Make changes to data
                if(listid != selectedList){
                    tbCtrl.changeListForCard(listid, cardid, selectedList);
                    UICtrl.handleDeleteCard(cardToChange);
                    UICtrl.SwitchCard(ListToAddCardNewToIt, cardToChange)
                   
                    tbCtrl.saveBoardToLocal();
                }
               
            tbCtrl.saveBoardToLocal(); 
            UICtrl.handleCloseModal();
        }
    };
    
    return {
        init: function() {
            console.log("Application has started!");
            var local_members = tbCtrl.loadMembersFromLocal();
            if(local_members.length !== 0) {
                UICtrl.loadMembersToUI(local_members);
            }


            var local_board = tbCtrl.loadBoardFromLocal();
            if(local_board.length !== 0) {
                UICtrl.loadBoardToUI(local_board);
            }


            setEventListeners();
            setEventListenerForListInput();
        }
    };

})(tbController, UIController);

controller.init();