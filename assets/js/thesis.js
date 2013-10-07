// Thesis Javascript file
function AddKeywords()
 {
  var span_kw = document.getElementById('span-keywords');
  var name_seed = span_kw.childNodes.length - 1;
  if (name_seed > 7)
  {
    var more_anchor = document.getElementById('more-a');
    more_anchor.style.visibility = "hidden";
  } 
  span_kw.appendChild(document.createElement('br'));

  for(i=0;i<=2;i++)
  {

     var input = document.createElement('input');
     input.type = 'text';
     input.size = 20;
     input.name = "subject-keyword_" + (name_seed+i);
     span_kw.appendChild(input);
  }
 }

// Thesis Knockout.js View Models
function ThesisViewModel() {
   var self = this;
   self.formError = ko.observable(false);
   self.thesisProgressValue = ko.observable(0);
   self.thesisProgressWidth = ko.observable('width: 0%');
   self.thesisPID = ko.observable("");

   // Creator 
   self.showAuthorView = ko.observable(true);
   self.advisorList = ko.observableArray();
   self.advisorFreeFormValue = ko.observable();
   self.advisorsStatus = ko.observable();
   self.emailValue = ko.observable();
   self.familyValue  = ko.observable();
   self.familyNameStatus = ko.observable();
   self.givenValue  = ko.observable();
   self.givenNameStatus = ko.observable();
   self.gradDateValue  = ko.observable();
   self.middleValue = ko.observable();
   self.suffixValue = ko.observable();

   // Upload Thesis
   self.showUploadThesis = ko.observable(false);
   self.pageNumberValue = ko.observable();
   self.titleValue = ko.observable();
   self.thesisKeywords = ko.observableArray([
     { name: 'keyword1' },
     { name: 'keyword2' },
     { name: 'keyword3' }
   ]);

   // Thesis Support Files
   self.showThesisSupport = ko.observable(false);

   // Thesis Honor Code
   self.showHonorCode = ko.observable(false);
   self.hasHonorCode = ko.observable();
   self.hasSubmissionAgreement = ko.observable();
   self.ContinueHonorCodeBtn = ko.observable(false);

   // Thesis Review and Submit
   self.showReviewSubmit = ko.observable(false);

   // Event Handlers for Thesis
   self.enableContinueHonorBtn = function() {
     if(self.hasHonorCode() == true && self.hasSubmissionAgreement()) {
        self.ContinueHonorCodeBtn(true);
     }
   }

   self.resetViews = function() {
     self.showAuthorView(false);
     self.showUploadThesis(false);
     self.showThesisSupport(false);
     self.showHonorCode(false);
     self.showReviewSubmit(false);
   }

   self.setProgressBar = function(value) {
     self.thesisProgressValue(value);
     self.thesisProgressWidth('width: ' + value + '%');
   }

   self.submitThesis = function() {
     self.resetViews();
     self.setProgressBar(100);
   }

   self.uploadFile = function() {
     alert("IN UPLOAD FILE");
     var file = this.files[0];
     name = file.name;
     size = file.size;
     type = file.type;
     alert("In uploadFile " + name + " " + size + "\n" + type);

   }


   self.validateStepOne = function()  {
     if(!self.givenValue()) {
       self.givenNameStatus('has-error');
       self.formError(true);
     }
     
     if(!self.familyValue()) {
       self.familyNameStatus('has-error');
       self.formError(true);
     }
     if(self.advisorList().length < 1 && !self.advisorFreeFormValue())  {
       self.advisorsStatus('has-error'); 
       self.formError(true);
     }
     if(self.formError()) {
       return;
     }
     var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     var data = {
       csrfmiddlewaretoken: csrf_token,
       step: 1,
       advisors: self.advisorList(),
       freeform_advisor: self.advisorFreeFormValue(),
       family: self.familyValue(),
       given: self.givenValue(),
       middle: self.middleValue(),
       suffix: self.suffixValue(),
       workflow: $('#workflow').val()
     }
     $.ajax({
       data: data,
       dataType: 'json',
       type: 'POST', 
       url: 'update',
       success: function(response) {
         var pid = response['pid'];
         alert("PID is " + pid);
         self.thesisPID(pid);
         self.resetViews();
         self.showUploadThesis(true);
         self.setProgressBar(20);
        }
       });
 
   }

   self.validateStepTwo = function() {
     self.resetViews();
     var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     var data = {
       csrfmiddlewaretoken: csrf_token,
       step: 2,
       pid: self.thesisPID()
     }

     $.ajax({
       data: data,
       dataType: 'json',
       type: 'POST',
       url: 'update',
       success: function(response) {
         if(response['response'] == 'error') {
          self.formError(true);
          return;
         }
       }
      });

     self.showThesisSupport(true);
     self.setProgressBar(40);
   }

 
   self.validateHonorCode = function() {
     self.resetViews();
     self.showReviewSubmit(true);
     self.setProgressBar(80);
   }
 
      self.validateThesisSupport = function() {
     self.resetViews();
     self.showHonorCode(true);
     self.setProgressBar(60);
   }
}


function uploadFile() {
  var formData = new FormData(this);
  var fileLoadReq = new XMLHttpRequest();
  fileLoadReq.open('POST', 'uploadFile', true);
  fileLoadReq.onload = function(oEvent) {
    if(fileLoadReq.status == 200) {
      alert("File uploaded");
    } else {
      alert("Error " + fileLoadReq.status + " occurred uploading your file");
    }
  }
   fileLoadReq.send(formData);
}
