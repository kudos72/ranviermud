'use strict';

const util   = require('util');

module.exports = (srcPath) => {
  const Data = require(srcPath + 'Data');
  const Account = require(srcPath + 'Account');

  return {
    event: state => (socket, args) => {
      if (!args || !args.dontwelcome) {
        socket.write("Welcome, what is your name? ");
      }

      socket.once('data', name => {
        name = name.toString().trim();

        const invalid = Account.validateName(name);
        if (invalid) {
          socket.write(invalid + "\r\n");
          return socket.emit('login', socket);
        }

        name = name[0].toUpperCase() + name.slice(1);

        let account = Data.exists('account', name);

        // That player account doesn't exist so ask if them to create it
        if (!account) {
          util.log('No account found');
          return socket.emit('create-account', socket, name);
        }

        account = state.AccountManager.loadAccount(name);
        return socket.emit('password', socket, { dontwelcome: false, account });
      });
    }
  };
};
