Meteor.publish('posts_queue',function( ){
  return Posts.find({}, {sort: {title: 1},fields:{date:false}});
});

Meteor.publish('comments_queue',function( ){
  return Comments.find({});
});
