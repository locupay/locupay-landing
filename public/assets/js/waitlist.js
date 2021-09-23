$(document).ready(function(){
  (function($) {
    "use strict";

    jQuery.validator.addMethod('answercheck', function (value, element) {
      return this.optional(element) || /^\bcat\b$/.test(value)
    }, "type the correct answer -_-");

    // validate waitListForm form
    $(function() {
      $('#waitListForm').validate({
        rules: {
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          email: {
            required: "no email, no subscription"
          }
        },
        submitHandler: function(form) {
          $('#formSpinner').css('display', 'inline-block');

          const db = firebase.firestore();
          let formEmail = $(form).find('input[name="email"]').val();

          // Add a new email as document in collection "waitlist" if not found
          let dbTable = db.collection("waitlist")
          let docRef = dbTable.doc(formEmail);

          docRef.get().then((doc) => {
            if (doc.exists) {
              $('#waitListForm').fadeTo( "slow", 1, function() {
                $('#formSpinner').hide();
                $('#formMsg').html("<p class='text-right text-warning'>You have already subscribed to Locupay waitlist.</p>");
                $('#formMsg').fadeIn()
              })
            } else {
              dbTable.doc(formEmail).set({
                email: formEmail,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              }).then(() => {
                $(form)[0].reset();
                $('#waitListForm').fadeTo( "slow", 1, function() {
                  $('#formSpinner').hide();
                  $("#formMsg").html("<p class='text-right text-success'>You have successfully joined Locupay waitlist!</p>");
                  $('#formMsg').fadeIn()
                })
              }).catch((error) => {
                console.error("Error writing document: ", error);
                $('#waitListForm').fadeTo( "slow", 1, function() {
                  $('#formSpinner').hide();
                  $('#formMsg').html("<p class='text-right text-danger'>Something went wrong! Please try again.</p>");
                  $('#formMsg').fadeIn()
                })
              });
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
            $('#waitListForm').fadeTo( "slow", 1, function() {
              $('#formSpinner').hide();
              $('#formMsg').html("<p class='text-right text-danger'>Something went wrong! Please try again.</p>");
              $('#formMsg').fadeIn()
            })
          });
        }
      })
    })
  })(jQuery)
})