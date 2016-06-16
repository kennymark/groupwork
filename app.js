Resolutions = new Mongo.Collection('contacts');

if (Meteor.isClient) {
  // counter starts at 0


  Meteor.subscribe("contacts");

  Template.body.helpers({
    resolutions: function() {
      if (Session.get('hideFinished')){
        return Resolutions.find({checked: {$ne: true}})
      }
      else{
       return Resolutions.find();
      }
    },
    hideFinished: function(){
      return Session.get('hideFinished')
    }
  });

  Template.body.events({
    'submit .contact': function(event){
      var title = event.target.title.value;
      Meteor.call("addContact", title);
      event.target.title.value ="";
      return false;
    },

    'change .hide-finished': function(event){
      Session.set('hideFinished', event.target.checked);

    }
  });

  Template.resolution.events({
    'click #toggle-checked': function (id){
      Meteor.call("update",this._id, !this.checked)
    },

    'click .delete': function(id){
     Meteor.call("delete", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("resolutions", function(){
   return Resolutions.find();
  });

  Meteor.methods({
  addResolution:function(title){
      Resolutions.insert({
        title: title,
        createdAt: new Date()
      });
  },
  update: function(id, checked){
    Resolutions.update(id,{$set: {checked: !this.checked}})
  },
  delete:function(id){
    Resolutions.remove(id)
  }
  })
}
