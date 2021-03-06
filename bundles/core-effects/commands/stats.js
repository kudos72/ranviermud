'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    command : (state) => (args, player) => {
      Broadcast.sayAt(player, "Stats:");

      for (const [ name ] of player.attributes) {
        Broadcast.sayAt(player, `  ${name}: ${player.getAttribute(name)}/${player.getBaseAttribute(name)}`);
      }
    }
  };
};
