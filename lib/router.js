
Router.configure({
  layoutTemplate: 'layout' ,
  loadingTemplate: 'loading' ,
  notFoundTemplate: 'notFound' ,
  waitOn: function() {
    Meteor.subscribe('trades_queue');
    Meteor.subscribe('comments_queue');
    return Meteor.subscribe('posts_queue');
  }
});

Router.route('/',{name:'postsList'});

Router.route('/posts/:_id',{
  name : 'postPage',
  data : function() {
    return Posts.findOne(this.params._id);
  }
});

Router.route('/posts/:_id/edit',{
  name : 'postEdit' ,
  data : function() {
    return Posts.findOne(this.params._id) ;
  }
});

Router.route('/submit',{name:'postSubmit'});

Router.route('/trades',{name:'tradesList'});

var requireLogin = function() {
  if (!Meteor.user()){
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound',{only:'postPage'});
Router.onBeforeAction(requireLogin,{only:'postSubmit'});
Router.onBeforeAction(requireLogin,{only:'tradesList'});