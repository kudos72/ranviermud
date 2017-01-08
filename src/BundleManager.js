'use strict';

const fs = require('fs'),
    path = require('path'),
    util = require('util'),
    Data = require('./Data'),
    Area = require('./Area'),
    Command = require('./Command'),
    CommandType = require('./CommandType'),
    Item = require('./Item'),
    Npc = require('./Npc'),
    Room = require('./Room')
;

const srcPath = __dirname + '/';
const bundlesPath = srcPath + '../bundles/';

class BundleManager {
  constructor(state) {
    this.state = state;
  }

  /**
   * Load in all bundles
   */
  loadBundles() {
    util.log('LOAD: BUNDLES');

    const bundles = fs.readdirSync(bundlesPath);
    for (const bundle of bundles) {
      const bundlePath = bundlesPath + bundle;
      if (fs.statSync(bundlePath).isFile() || bundle === '.' || bundle === '..') {
        continue;
      }

      this.loadBundle(bundle, bundlePath);
    }

    util.log('ENDLOAD: BUNDLES');
  }

  loadBundle(bundle, bundlePath) {
    // TODO: Use bundles.json file to see enabled bundles
    const paths = {
      commands: bundlePath + '/commands/',
      areas: bundlePath + '/areas/',
      events: bundlePath + '/events/',
    };

    util.log(`LOAD: BUNDLE [${bundle}] START`);
    if (fs.existsSync(paths.commands)) {
      this.loadCommands(bundle, paths.commands);
    }

    if (fs.existsSync(paths.areas)) {
      this.loadAreas(bundle, paths.areas)
    }

    if (fs.existsSync(paths.events)) {
      this.loadEvents(bundle, paths.events)
    }
    util.log(`ENDLOAD: BUNDLE [${bundle}]`);
  }

  loadAreas(bundle, areasDir) {
    util.log(`LOAD: BUNDLE[${bundle}] Areas...`);

    const dirs = fs.readdirSync(areasDir);

    for (const areaDir of dirs) {
      if (fs.statSync(areasDir + areaDir).isFile()) {
        continue;
      }

      const areaPath = areasDir + areaDir;
      const areaName = path.basename(areaDir);
      let area = this.loadArea(bundle, areaName, areaPath);
      this.state.AreaManager.addArea(area);
    }

    util.log(`ENDLOAD: BUNDLE[${bundle}] Areas`);
  }

  loadArea(bundle, areaName, areaPath) {
    var paths = {
      manifest: areaPath + '/manifest.yml',
      rooms: areaPath + '/rooms.yml',
      items: areaPath + '/items.yml',
      npcs: areaPath + '/npcs.yml',
    };

    const manifest = Data.parseFile(paths.manifest);

    let area = new Area(bundle, areaName, manifest);
    // TODO: Load listeners

    // load items
    if (fs.existsSync(paths.items)) {
      const items = this.loadItems(area, paths.items);
    }

    // load npcs
    if (fs.existsSync(paths.npcs)) {
      const npcs = this.loadNpcs(area, paths.npcs);
      npcs.forEach(npc => area.addNpc(npc));
    }

    // load rooms
    if (fs.existsSync(paths.rooms)) {
      const rooms = this.loadRooms(area, paths.rooms);
      // distribute items/npcs
      //area.distributeItems(items);
      //area.distributeNpcs(npcs);
    }

    return area;
  }

  loadItems(area, itemsFile) {
    util.log(`LOAD: BUNDLE[${area.bundle}] [${area.name}] Items...`);

    // parse the item files
    let items = Data.parseFile(itemsFile);

    // create and load the items
    items = items.map(item => new Item(area, item));
    items.forEach(item => this.state.ItemManager.add);

    util.log(`ENDLOAD: BUNDLE[${area.bundle}] AREA [${area.name}] Items`);

    return items;
  }

  loadNpcs(area, npcsFile) {
    util.log(`LOAD: BUNDLE[${area.bundle}] [${area.name}] Npcs...`);

    // parse the npc files
    let npcs = Data.parseFile(npcsFile);

    // create and load the npcs
    npcs = npcs.map(npc => new Npc(area, npc));

    util.log(`ENDLOAD: BUNDLE[${area.bundle}] AREA [${area.name}] Npcs`);

    return npcs;
  }

  loadRooms(area, roomsFile) {
    util.log(`LOAD: BUNDLE[${area.bundle}] [${area.name}] Rooms...`);

    // parse the room files
    let rooms = Data.parseFile(roomsFile);

    // create and load the rooms
    rooms = rooms.map(room => new Room(area, room));
    rooms.forEach(room => this.state.RoomManager.addRoom(room));

    util.log(`ENDLOAD: BUNDLE[${area.bundle}] AREA [${area.name}] Rooms`);

    return rooms;
  }

  loadCommands(bundle, commandsDir) {
    util.log(`LOAD: BUNDLE[${bundle}] Commands...`);
    const files = fs.readdirSync(commandsDir);

    for (const commandFile of files) {
      const commandPath = commandsDir + commandFile;
      if (!fs.statSync(commandPath).isFile() || !commandFile.match(/js$/)) {
        continue;
      }

      const commandName = path.basename(commandFile, path.extname(commandFile));
      const injector = require(commandPath);
      const cmdImport = injector(srcPath);

      const command = new Command(
        cmdImport.type || CommandType.Player,
        bundle,
        commandName,
        cmdImport.command(this.state)
      );

      this.state.CommandManager.add(command);
    }

    util.log(`ENDLOAD: BUNDLE[${bundle}] Commands...`);
  }

  loadEvents(bundle, eventsDir) {
    util.log(`LOAD: BUNDLE[${bundle}] Events...`);
    const files = fs.readdirSync(eventsDir);

    for (const eventFile of files) {
      const eventPath = eventsDir + eventFile;
      if (!fs.statSync(eventPath).isFile() || !eventFile.match(/js$/)) {
        continue;
      }

      const eventName = path.basename(eventFile, path.extname(eventFile));
      const eventImport = require(eventPath)(srcPath);

      this.state.EventManager.addEvent(eventName, eventImport.event(this.state));
    }

    util.log(`ENDLOAD: BUNDLE[${bundle}] Events...`);
  }
}

module.exports = BundleManager;
