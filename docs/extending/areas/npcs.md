In Ranvier all npcs for an area are defined in a single file within the area folder: `npcs.yml`

[TOC]

## Example File

`bundles/core-areas/areas/limbo/npcs.yml`
``` yaml
- id: 1
  keywords: ['rat']
  name: 'Rat'
  level: 2
  description: "The rat's beady red eyes dart frantically, its mouth foaming as it scampers about."
  behaviors: [ 'combat' ]
  script: '1-rat'
  items: ['limbo:2']
  quests: ['limbo:2']
  attributes:
    health: 100
    speed: 2.5
  damage: 1-7
- id: 2
  keywords: ["wise", "old", "man"]
  name: "Wise Old Man"
  description: "A wise looking old man sits on the ground with legs crossed."
```

Here we have two npcs. The rat can enter combat, has a custom script, a default inventory, hands out a quest and has some extra attributes. The old man is the most basic NPC you can have.

## Definition Fields

`field` _`type`_ `(default)`

----

`id` _`number`_
:    ***required*** NPC id unique among the npcs of the current area

`name` _`string`_
:    ***required*** String displayed the player sees the npc in the room

`keywords` _`string`_
:    ***required*** Keywords that the player can use to target this npc, does not need to be unique

`description` _`string`_
:    ***required*** String displayed when the player looks directly at the npc

`script` _`string`_
:    Name of custom script to attach to this npc (See [Scripting](scripting.md))

`behaviors` _`array<string>`_
:    List of behaviors to attach to this npc (See [Scripting](scripting.md))

`attributes` _`object`_
:    Arbitrary list of attributes to attach to this NPC. There are no constraints on this so you are free to assign basically anything here that you want to look for inside commands/scripts/etc.

`items` _`array<EntityReference>`_
:    List of Entity References representing the NPC's default inventory

`quests` _`array<EntityReference>`_
:    List of Entity References representing the quests that this character gives out (See [Quests](quests.md))
