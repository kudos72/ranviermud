'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    usage: 'quit',
    command: (state) => (args, player) => {
      if (player.isInCombat()) {
        Broadcast.sayAt(player, "You're too busy fighting for your life!");
      }

      player.save(() => {
        Broadcast.sayAt(player, "Goodbye!");
        player.socket.emit('close');
      });
    }
  };
};
