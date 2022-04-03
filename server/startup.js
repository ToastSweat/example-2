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

chat.registerCmd('vehicle', (player, modelName) => {
    if (!modelName) {
        chat.send(player, `/vehicle [modelName]`);
        return;
    }

    let vehicle;

    try {
        vehicle = new alt.Vehicle(modelName, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
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