import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { isaacCommand } from './commands/isaac.js';
import { getIdByName, getNameById } from './data/items.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment');
  process.exit(1);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'isaac') {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'lookup') {
      const input = interaction.options.getString('item', true);
      const id = Number.parseInt(input, 10);
      const itemId = Number.isNaN(id) ? getIdByName(input) : id;
      const name = itemId !== undefined ? getNameById(itemId) : undefined;

      if (name) {
        await interaction.reply(`**${name}** (ID: ${itemId})`);
      } else {
        await interaction.reply({ content: `Item not found: "${input}"`, ephemeral: true });
      }
    } else if (subcommand === 'sp' || subcommand === 'spfind') {
      const input = interaction.options.getString('item', true);
      const parsedId = Number.parseInt(input, 10);
      const itemId = Number.isNaN(parsedId) ? getIdByName(input) : parsedId;
      const currentName = itemId !== undefined ? getNameById(itemId) : undefined;

      if (itemId === undefined || !currentName) {
        await interaction.reply({ content: `Item not found: "${input}"`, ephemeral: true });
        return;
      }

      // sp: 10 items before (lower IDs), descending. spfind: 10 items after (higher IDs), ascending.
      const isSpfind = subcommand === 'spfind';
      const lowId = isSpfind ? itemId + 1 : Math.max(1, itemId - 10);
      const highId = isSpfind ? itemId + 10 : itemId - 1;

      const ids: number[] = [];
      for (let i = highId; i >= lowId; i--) {
        if (getNameById(i)) ids.push(i);
      }
      if (isSpfind) ids.reverse();
      const items = ids.map((id) => ({ id, name: getNameById(id)! }));

      let reply = `**Items after ${currentName}** (ID: ${itemId}):\n`;
      reply += items.map(({ id, name }, i) => `${i + 1}. ${name} (ID: ${id})`).join('\n');
      if (items.length < 10) {
        reply += `\n\n_Only ${items.length} item(s) ${isSpfind ? 'above' : 'below'} this one._`;
      }

      await interaction.reply(reply);
    }
  }
});

async function registerCommands() {
  const rest = new REST().setToken(token!);
  const commands = [isaacCommand.toJSON()];

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    console.error('Missing DISCORD_CLIENT_ID in environment');
    process.exit(1);
  }

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Slash commands registered');
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
}

async function main() {
  await registerCommands();
  await client.login(token);
}

main();
