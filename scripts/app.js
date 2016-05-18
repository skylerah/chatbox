var socket = io('http://localhost:3000');

new Vue({
  el: '#chat',

  data: {
    messages: [],
    message: null,
  },

  ready: function() {
    socket.on('connect', function() {
      console.log("Connected to server.");
      socket.emit('join', [channel, userId, userName]);
    });

    socket.on('chat.' + channel, function(payload) {
      this.messages.push(['chat', payload[1], payload[2]]);
    }.bind(this));
  },

  methods: {
    send: function(e) {
      e.preventDefault();

      var payload = [channel, userId, this.message, userName];

      /* validation isn't working, blank msg can be sent, need to fix */
      if(this.message === ('')) {
        this.message = null;
      }

      if(this.message !== null) {
        socket.emit('chat', payload);
      }

      console.log(payload);
      this.message = null;
    },

    isPoster: function(id) {
      if(userId === id) {
        return true;
      }
      return false;
    }
  }
});
