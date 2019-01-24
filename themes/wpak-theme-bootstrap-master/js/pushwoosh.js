function initPushwoosh() {
  
    var pushwoosh = cordova.require("pushwoosh-cordova-plugin.PushNotification");
  
    // Should be called before pushwoosh.onDeviceReady
    document.addEventListener('push-notification', function(event) {
      var notification = event.notification;
      // handle push open here
    });
    
    // Initialize Pushwoosh. This will trigger all pending push notifications on start.
    pushwoosh.onDeviceReady({
      appid: "F17B5-7146B",
      projectid: "1011179920641",
      serviceName: ""
    });
  
    //register for push notifications
    pushwoosh.registerDevice(
      function(status) {
       // document.getElementById("pushToken").innerHTML = status.pushToken + "<p>";
       // onPushwooshInitialized(pushNotification);
        var pushToken = status.pushToken;
        
      },
      function(status) {
        alert("failed to register: " + status);
        console.warn(JSON.stringify(['failed to register ', status]));
      });
  };