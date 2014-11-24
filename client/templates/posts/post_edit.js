Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var pId  = this._id ;
    var props= {
      url  : $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    } ;
    
    Posts.update(pId,{$set:props},function(error){
      if (error) {
        alert(error.reason);
      } else {
        Router.go('postPage',{_id:pId});
      }
    });
  },
  'click .delete' : function(e) {
    e.preventDefault();
    
    if (confirm('delete this post?')){
      var pId = this._id ;
      Posts.remove(pId)  ;
      Router.go('postsList');
    }
  }
});
