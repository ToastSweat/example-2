/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import * as chat from './chat';

alt.log('Hello from server');
alt.on('playerConnect', handleConnect);
alt.on('playerDeath', handleDeath);

export const DeadPlayers = {};

const TimeBetweenRespawn = 5000; // 5 Seconds

/**
 * @param {alt.Player} player
 */
function handleConnect(player) {
    player.spawn(-1291.71, 83.43, 54.89, 1000); // Spawns after 1 second.
    player.model = `mp_m_freemode_01`;

    const spawnedVehicle = createVehicle(player, 'infernus');

    if (!spawnedVehicle) {
        console.error('Vehicle could not be spawned.');
        return;
    }
}

/**
 * @param {alt.Player} player
 */
 function handleDeath(player) {
    // If it exists they are already dead.
    if (deadPlayers[player.id]) {
        return;
    }

    // Mark the player as dead.
    deadPlayers[player.id] = alt.setTimeout(() => {
        // Check if the player still has an entry.
        if (deadPlayers[player.id]) {
            delete deadPlayers[player.id];
        }

        // Check if the player hasn't just left the server yet.
        if (!player || !player.valid) {
            return;
        }

        player.spawn(0, 0, 0, 0); // Respawn the player.
    }, TimeBetweenRespawn);
}

export function cancelRespawn(player) {
    // Check if an entry exists for a player respawn.
    if (!deadPlayers[player.id]) {
        return;
    }

    // This cancels the timeout from ever being finished.
    alt.clearTimeout(deadPlayers[player.id]);
    delete deadPlayers[player.id];
}

export function createVehicle(player, vehicleModel) {
    let vehicle;

    try {
        vehicle = new alt.Vehicle(vehicleModel, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    } catch (err) {
        console.error(`${vehicleModel} does not exist.`);
        throw err;
    }

    if (!vehicle) {
        console.error(`${vehicleModel} does not exist.`);
        return;
    }

    console.log('Spawned a vehicle');
    return vehicle;
}

chat.registerCmd('test', (player) => {
    console.log('hello world');
});

chat.registerCmd('pos', (player) => {
    chat.send(player, `${JSON.stringify(player.pos)}`);
    console.log(player.pos);
});

let playerVehicles = [];
chat.registerCmd('vehicle', (player, modelName) => {
    if (!modelName) {
        chat.send(player, `/vehicle [modelName]`);
        return;
    }

    if (playerVehicles[player]) {
        playerVehicles[player].destroy();
        playerVehicles[player] = null;
    }

    let vehicle;

    try {
        vehicle = new alt.Vehicle(modelName, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
        playerVehicles[player] = vehicle;
    } catch (err) {
        chat.send(player, `~r~Invalid vehicle model.`);
        return;
    }
});

chat.registerCmd('spawn', (player, modelName) => {
    if (!modelName) {
        modelName = 'mp_m_freemode_01';
    }

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);

    try {
        player.model = modelName;
    } catch (err) {
        player.send(player, 'Invalid Model. Using default.');
        player.model = 'mp_m_freemode_01';
    }
});

chat.registerCmd('setHealth', (player, newHealth) => {
    if (!newHealth) {
        chat.send(player, '{80eb34}Specify a new value for health, {34dfeb}0-200');

    } else if (newHealth > 200) {
        chat.send(player, '{80eb34}Setting health to {34dfeb} MAX.');
        player.health = 200;
    } else if (newHealth < 0) {
        chat.send(player, '{80eb34}Setting health to {34dfeb} MIN.');
        player.health = 0;
    } else {
        chat.send(player, '{80eb34}Setting health to {34dfeb}' + newHealth + '.');
        player.health = newHealth;
    }
});

chat.registerCmd('setArmour', (player, newArmor) => {
    if (!newArmor) {
        chat.send(player, '{80eb34}Specify a new value for armour, {34dfeb}0-100');

    } else if (newArmor > 100) {
        chat.send(player, '{80eb34}Setting armour to {34dfeb} MAX.');
        player.armour = 100;
    } else if (newArmor < 0) {
        chat.send(player, '{80eb34}Setting armour to {34dfeb} MIN.');
        player.armour = 0;
    } else {
        chat.send(player, '{80eb34}Setting armour to {34dfeb}' + newArmor + '.');
        player.armour = newArmor;
    }
});

chat.registerCmd('engine', (player) => {
    const vehicle = player.vehicle;

    //check if in vehicle
    if (!vehicle) {
        chat.send(player, '{80eb34}You must be in a {34dfeb}vehicle {80eb34}to enter this command.');
        
        return;
    } else {
        if (vehicle.engineOn === true) {
            chat.send(player, '{80eb34}Turning engine {34dfeb}OFF.');
            vehicle.engineOn = false;
            
            return;
        } else {
            chat.send(player, '{80eb34}Turning engine {34dfeb}ON.');
            vehicle.engineOn = true;
            
            return;
        }
    }
});

chat.registerCmd('yeet', (player) => {
    const vehicle = player.vehicle;

    //check if in vehicle
    if (!vehicle) {
        chat.send(player, '{80eb34}You must be in a {34dfeb}vehicle {80eb34}to enter this command.');
        
        return;
    } else {
        chat.send(player, '{80eb34}Bye bye {34dfeb}bitch!');
        
        vehicle.engineOn = false;

        vehicle.engineHealth = 0;
        vehicle.bodyHealth = 0;

        vehicle.setBumperDamageLevel(0, 2);
        vehicle.setBumperDamageLevel(1, 2);

        vehicle.setLightDamaged(0, true);
        vehicle.setLightDamaged(1, true);
        vehicle.setLightDamaged(2, true);
        vehicle.setLightDamaged(3, true);
        vehicle.setLightDamaged(4, true);
        vehicle.setLightDamaged(5, true);
        
        vehicle.setLightDamaged(0, 3);
        vehicle.setLightDamaged(1, 3);
        vehicle.setLightDamaged(2, 3);
        vehicle.setLightDamaged(3, 3);
        vehicle.setLightDamaged(4, 3);
        vehicle.setLightDamaged(5, 3);
        
        vehicle.setPartDamageLevel(0, 3);
        vehicle.setPartDamageLevel(1, 3);
        vehicle.setPartDamageLevel(2, 3);
        vehicle.setPartDamageLevel(3, 3);
        vehicle.setPartDamageLevel(4, 3);
        vehicle.setPartDamageLevel(5, 3);
        
        vehicle.setWheelDetached(0, true);
        vehicle.setWheelDetached(1, true);
        vehicle.setWheelDetached(2, true);
        vehicle.setWheelDetached(3, true);

        vehicle.setWindowDamaged(0, true);
        vehicle.setWindowDamaged(1, true);
        vehicle.setWindowDamaged(2, true);
        vehicle.setWindowDamaged(3, true);
        vehicle.setWindowDamaged(4, true);
        vehicle.setWindowDamaged(5, true);
        vehicle.setWindowDamaged(6, true);
        vehicle.setWindowDamaged(7, true);
        
        vehicle.destroy();
        
        //vehicle.explodeVehicle();

        return;
    }
});

//lifted from freeroam resource
chat.registerCmd("getpos", (player, args) => {
    alt.log(`Position: ${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
    chat.send(player, `Position: ${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
});
  
chat.registerCmd("setpos", (player, xPos, yPos, zPos) => {
    alt.log('xPos: ' + xPos);
    alt.log('yPos: ' + yPos);
    alt.log('zPos: ' + zPos);

    if (xPos && yPos && zPos) {
        chat.send(player, '{80eb34}Teleporting you to {34dfeb}' + xPos + ', ' + yPos + ', ' + zPos);
        player.pos = { xPos, yPos, zPos };
        return;
    } else {
        chat.send(player, "Usage: /tp (x y z)");
        return;
    }
});

//lifted from freeroam resource
chat.registerCmd("tp", (player, args) => {
    if (args && args.length === 0) {
        chat.send(player, "Usage: /tp (target player)");
        return;
    }
    const foundPlayers = alt.Player.all.filter((p) => p.name === args[0]);
    if (foundPlayers && foundPlayers.length > 0) {
        player.pos = foundPlayers[0].pos;
        chat.send(player, `You got teleported to {1cacd4}${foundPlayers[0].name}{ffffff}`);
    } else {
        chat.send(player, `{ff0000} Player {ff9500}${args[0]} {ff0000}not found..`);
    }
});

