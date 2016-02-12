Messages = new Mongo.Collection('messages');

Router.route('/', function()
{
  this.render('guestbook');
  this.layout('layout')
});

Router.route('/about', function()
{
  this.render('about');
  this.layout('layout')
});

Router.route('/message/:_id', function()
{
  this.render('message',
  {
    data: function()
    {
      return Messages.findOne({_id: this.params._id});
    }
  });
  this.layout('layout')
},
{
  name: 'message.show'
});

if (Meteor.isClient)
{
  Meteor.subscribe('messages');
  
  Template.guestbook.helpers
  (
    {
      'messages': function()
      {
        return Messages.find({}, {sort: {submitted: -1}}) || {};
      }
    }
  );
  
  Template.guestbook.events
  (
    {
      'submit form': function(event)
      {
        event.preventDefault();
        var messbox = $(event.target).find('textarea[name=message]');
        
        var messtext = messbox.val();
        
        Messages.insert
        (
          {
            username: user.name,
            message: messtext,
            submitted: Date.now()
          }
        );
        
        namebox.val('');
        messbox.val('');
        
      }
    }
  );
  
  Accounts.ui.config
  ({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  })
}

if (Meteor.isServer)
{
  Meteor.publish('messages', function()
  {
    return Messages.find();
  })
  
  Accounts.onCreateUser(function (options, user)
  {
    if (options.profile)
    {
      user.profile = options.profile;
    }
    else
    {
      user.profile = {};
    }
    
    return user;
  });
}
