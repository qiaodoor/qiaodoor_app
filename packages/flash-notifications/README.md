flash-notifications
===================

Flash Notifications for MeteorJS

Built for use with bootstrap styles, but bootstrap is not required.
Integrates easily with Iron Router

Inspiration and and a great start on the code came from: <http://stackoverflow.com/questions/14086958/whats-a-good-way-to-handle-flash-notifications-in-meteor-with-meteor-router> and [Telesc.pe](http://telesc.pe)


## Usage

### Drop these in your template somewhere

Flash-Notifications comes with support for displaying all of the notifications together, or for displaying notifications by type.

To display all notifications together just drop this into your template where you want the notifications.
    
    {{> flashes}}

To display only success, error, warning, or info messages, you can use specific templates like this. Note that if you are not displaying a template, but create a message, it will still get marked as seen.

    {{> successFlashes}}
    {{> errorFlashes}}
    {{> warningFlashes}}
    {{> infoFlashes}}


### To create a flash notification for the user

    flash.success('This is a success message');
    flash.error('This is a error message');
    flash.info('This is a info message');
    flash.warning('This is a warning message');


### Iron Router integration

Flash notifications can automatically be dismissed if they have been seen for more than 250ms and the user visits a new route if you have Iron Router installed. 

Drop this into your routes.js file:

    Router.before(function() {
        flash.clear();
    });

 or if you already have a global before function defined add this to it.

    flash.clear();

 if you want to have flashes automatically dismissed when users visit new routes.